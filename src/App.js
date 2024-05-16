import { MdOutlineLibraryMusic } from "react-icons/md";
import { CgPlayListAdd } from "react-icons/cg";
import { CgPlayListRemove } from "react-icons/cg";
import "./App.css";
import { Children, useEffect, useState } from "react";

// const tempMusicData = [
//   {
//     id: 1,
//     title: "Walang Alam",
//     artist: "Hev Abi",
//     genre: "Rap",
//   },
//   {
//     id: 2,
//     title: "Like That",
//     artist: "Future",
//     genre: "Hip-Hop",
//   },
//   {
//     id: 3,
//     title: "Hoodie",
//     artist: "Dionela",
//     genre: "OPM",
//   },
// ];

// const tempPlaylist = [
//   {
//     id: 1,
//     title: "Song 1",
//     artist: "Artist A",
//     genre: "Pop",
//   },
//   {
//     id: 2,
//     title: "Song 2",
//     artist: "Artist B",
//     genre: "Rock",
//   },
//   {
//     id: 3,
//     title: "Song 3",
//     artist: "Artist C",
//     genre: "Jazz",
//   },
// ];

//make components reusable as possible
//separate logic from design//ui
//make our component simple or easily understandable

const CLIENT_ID = "263b3affa87043cd94f3a708cc9d897d";
const ClIENT_SECRET = "74d5e9a29e5c4e2c9ece441475ec653f";

function App() {
  const [music, setMusic] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMusic, setFilteredMusic] = useState([]);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const sortedMusic = [...filteredMusic].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "name-des":
          return (b.name ?? "").localeCompare(a.name ?? "");
        case "artist":
          return (a.artists[0].name ?? "").localeCompare(
            b.artists[0].name ?? ""
          );
        case "releasedateup":
          return (
            new Date(a.album.release_date) - new Date(b.album.release_date)
          );
        case "releasedatedown":
          return (
            new Date(b.album.release_date) - new Date(a.album.release_date)
          );
        default:
          return 0;
      }
    });

    if (!arraysAreEqual(sortedMusic, filteredMusic)) {
      setFilteredMusic(sortedMusic);
    }
  }, [sortOption, filteredMusic]);

  function arraysAreEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredMusic(music);
    } else {
      const filtered = music.filter((music) => {
        if (music.name && music.artist) {
          return (
            music.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            music.artists[0].name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        }
        return false;
      });
      setFilteredMusic(filtered);
    }
  }, [searchQuery, music]);

  const addToPlaylist = (music) => {
    if (!playlist.some((m) => m.id === music.id)) {
      setPlaylist([...playlist, music]);
    }
  };

  const removeFromPlaylist = (music) => {
    setPlaylist(playlist.filter((m) => m.id !== music.id));
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <NavigationBar>
        <Logo />
        <Search setMusic={setMusic} music={setMusic} />
        <NumResult music={music} />
      </NavigationBar>
      <Title />?
      <div className="above">
        <Sorting handleSortChange={handleSortChange} />
        <PlaylistTotal playlist={playlist} />
      </div>
      <Main>
        <Box
          title="MUSIC LIST"
          subtitle="Let the symphony of sounds guide 
          your exploration through the realms of music's wonders."
        >
          <Music
            music={filteredMusic}
            playlist={playlist}
            addToPlaylist={addToPlaylist}
            removeFromPlaylist={removeFromPlaylist}
          />
        </Box>
        <Box
          title="PLAYLIST"
          subtitle="Hit that 'Add Icon' 
          button and let the music you love play on repeat, hassle-free!."
        >
          <Playlist
            playlist={playlist}
            removeFromPlaylist={removeFromPlaylist}
          />
        </Box>
      </Main>
    </div>
  );
}

function NavigationBar({ children }) {
  return <nav className="nav-container">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo-container">
      <div className="logo-content">
        <MdOutlineLibraryMusic className="icon" />
        <h1 className="logo-text">D Y M U S I C</h1>
      </div>
    </div>
  );
}

function NumResult({ music }) {
  return (
    <p className="result">
      Found <strong>{music.length}</strong> results
    </p>
  );
}

function Search({ setMusic }) {
  const [query, setQuery] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    var authParameter = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        ClIENT_SECRET,
    };

    fetch("https://accounts.spotify.com/api/token", authParameter).then(
      (result) =>
        result.json().then((data) => setAccessToken(data.access_token))
    );
  }, []);

  async function search() {
    // console.log("Searching for " + query);
    var trackParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    var tracks = await fetch(
      "https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=10",
      trackParameters
    ).then((result) => result.json());

    if (tracks.tracks && tracks.tracks.items) {
      setMusic(tracks.tracks.items);
    } else {
      setMusic([]);
    }
  }

  return (
    <input
      className="search"
      type="text"
      placeholder="Start Vibing..."
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          search();
        }
      }}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Title() {
  return (
    <div className="title-container">
      <h1 className="title">魂 の 慰 め</h1>
      <h3 className="title-description">"Solace for the Soul"</h3>
    </div>
  );
}

function Sorting({ handleSortChange }) {
  return (
    <div className="sort-container">
      <label className="sort-title">Filtered By: </label>
      <select id="sort" className="sort-select" onChange={handleSortChange}>
        <option value="name-asc">Title (A-Z)</option>
        <option value="name-des">Title (Z-A)</option>
        <option value="artist">Artist</option>
        <option value="releasedateup">Release Date ↑</option>
        <option value="releasedatedown">Release Date ↓</option>
      </select>
    </div>
  );
}
// function MusicListBox({ music }) {
//   return (
//     <div className="container">
//       <h2>Music List</h2>
//       <Music music={music} />
//     </div>
//   );
// }

// function PlaylistBox() {
//   return (
//     <div className="container">
//       <h2>Playlist</h2>
//       <Playlist />
//     </div>
//   );
// }

function Main({ children }) {
  return (
    <div className="container">
      {/* <MusicListBox music={music} />
          <PlaylistBox /> */}
      {children}
    </div>
  );
}

function Box({ children, title, subtitle }) {
  return (
    <div className="box-container">
      <div className="list-container">
        <h2 className="list-title">{title}</h2>
        <h3 className="subtitle">{subtitle}</h3>
      </div>
      {children}
    </div>
  );
}

function Music({ music, playlist, addToPlaylist, removeFromPlaylist }) {
  const togglePlaylist = (music) => {
    if (playlist.some((m) => m.id === music.id)) {
      removeFromPlaylist(music);
    } else {
      addToPlaylist(music);
    }
  };

  return (
    <ul>
      {music.map((music) => (
        <li key={music.id} className="music-container">
          <img src={music.album.images[0].url} alt="Album" width={200} />
          <div
            className="track"
            style={{ width: "calc(100% - 210px)", paddingLeft: "10px" }}
          >
            <h1 className="name">{music.name}</h1>
            <h4 className="album">
              {music.album.total_tracks === 1 ? "Single" : music.album.name}
            </h4>
            <h2 className="artist">{music.artists[0].name}</h2>
            <h4 className="date">
              Released:{" "}
              {new Date(music.album.release_date).toLocaleDateString()}
            </h4>
          </div>
          <button
            className={playlist.some((m) => m.id === music.id) ? "liked" : ""}
            onClick={() => togglePlaylist(music)}
          >
            {playlist.some((m) => m.id === music.id) ? (
              <span className="mutton">
                <CgPlayListRemove />
              </span>
            ) : (
              <span className="mutton">
                <CgPlayListAdd />
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

function PlaylistTotal({ playlist }) {
  return (
    <div className="playlist-total">
      <h3 className="playlist-total-title">
        Total Tracks in Playlist: {playlist.length}
      </h3>
    </div>
  );
}

function Playlist({ playlist, removeFromPlaylist }) {
  const togglePlaylist = (music) => {
    if (playlist.some((m) => m.id === music.id)) {
      removeFromPlaylist(music);
    }
  };
  return (
    <ul>
      {playlist.map((music) => (
        <li key={music.id} className="music-container">
          <img src={music.album.images[0].url} alt="Album" width={200} />
          <div
            className="track"
            style={{ width: "calc(100% - 210px)", paddingLeft: "10px" }}
          >
            <h1 className="name">{music.name}</h1>
            <h4 className="album">
              {music.album.total_tracks === 1 ? "Single" : music.album.name}
            </h4>
            <h2 className="artist">{music.artists[0].name}</h2>
            <h4 className="date">
              Released:{" "}
              {new Date(music.album.release_date).toLocaleDateString()}
            </h4>
          </div>
          <button
            className={playlist.some((m) => m.id === music.id) ? "liked" : ""}
            onClick={() => togglePlaylist(music)}
          >
            {playlist.some((m) => m.id === music.id) ? (
              <span className="mutton">
                <CgPlayListRemove />
              </span>
            ) : (
              <span className="mutton">
                <CgPlayListAdd />
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default App;

//stateful components

//stateless/presentation components

//structural components
