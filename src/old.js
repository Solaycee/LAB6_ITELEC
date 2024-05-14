import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

const tempMusicData = [
  {
    id: 1,
    title: "Walang Alam",
    artist: "Hev Abi",
    genre: "Rap",
  },
  {
    id: 2,
    title: "Like That",
    artist: "Future",
    genre: "Hip-Hop",
  },
  {
    id: 3,
    title: "Hoodie",
    artist: "Dionela",
    genre: "OPM",
  },
];

const tempPlaylist = [
  {
    id: 1,
    title: "Song 1",
    artist: "Artist A",
    genre: "Pop",
  },
  {
    id: 2,
    title: "Song 2",
    artist: "Artist B",
    genre: "Rock",
  },
  {
    id: 3,
    title: "Song 3",
    artist: "Artist C",
    genre: "Jazz",
  },
];

//make components reusable as possible
//separate logic from design//ui
//make our component simple or easily understandable

function App() {
  const [music, setMusic] = useState(tempMusicData);
  return (
    <div>
      <NavigationBar music={music} />
      <Main music={music} />
    </div>
  );
}

function NavigationBar({ music }) {
  return (
    <nav className="container">
      <Logo />
      <Search />
      <NumResult music={music} />
    </nav>
  );
}

function Logo() {
  return <h1 style={{ textAlign: "center" }}>Music App</h1>;
}

function NumResult({ music }) {
  return (
    <p>
      Found <strong>{music.length}</strong> results
    </p>
  );
}

function Search() {
  const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search music..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function MusicListBox({ music }) {
  return (
    <div className="container">
      <h2>Music List</h2>
      <Music music={music} />
    </div>
  );
}

function Music({ music }) {
  return (
    <ul>
      {music.map((music) => (
        <li key={music.id}>
          {music.title} by {music.artist} ({music.genre})<button>♥️</button>
        </li>
      ))}
    </ul>
  );
}

function PlaylistBox() {
  return (
    <div className="container">
      <h2>Playlist</h2>
      <Playlist />
    </div>
  );
}

function Playlist() {
  const [playlist, setPlaylist] = useState(tempPlaylist);
  const addToPlaylist = (music) => {
    setPlaylist([...playlist, music]);
  };
  return (
    <ul>
      {playlist.map((music) => (
        <li key={music.id}>
          {music.title} by {music.artist}
        </li>
      ))}
    </ul>
  );
}

function Main({ music }) {
  return (
    <div>
      <div className="container">
        <MusicListBox music={music} />
        <PlaylistBox />
      </div>
    </div>
  );
}

export default App;

//stateful components

//stateless/presentation components

//structural components
