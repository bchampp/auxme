import { Button } from "@material-ui/core";
import React from "react";
import "../songs.css";

export default function SongCard({ song, handleQueue }) {
  return (
    <li className="song-card" key={song.id}>
      <img src={song.album.images[0].url} alt="album-art"></img>
      <div className="song-info-container">
        <h5 className="song-title">{song.name} - {song.artists[0].name}</h5>
        <div className="song-info-container">
          <Button
            className="queue-song-button"
            variant="contained"
            color="primary"
            onClick={e => handleQueue(e, song.id)}>
            Add to queue
          </Button>
        </div>
      </div>
    </li>
  );
}
