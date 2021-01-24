import { Button } from "@material-ui/core";
import React from "react";
import "./songs.css";

export default function SongCard({ song, handleQueue }) {
  return (
    <div className="song-card">
      <img src={song.album.images[0].url} alt="album-art"></img>
      <div className="song-info-container">
        <h5 className="song-title">{song.name}</h5>
        <div className="song-info-container">
          <Button
            className="queue-song-button"
            variant="outlined"
            color="secondary"
            onClick={e => handleQueue(e, song.id)}>
            QUEUE SONG
          </Button>
        </div>
      </div>
    </div>
  );
}
