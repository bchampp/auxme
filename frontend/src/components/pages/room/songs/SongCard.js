import { Button } from "@material-ui/core";
import React, { useState } from "react";
import "./songs.css";

export default function SongCard({ song, handleQueue }) {
  return (
    <div className="song-card">
      <img src={song.album.images[0].url}></img>
      <div className="song-info-container">
        <h5 className="song-title">{song.name}</h5>
        <div className="song-info-container">
          {/* <div className="song-about-container">
            <div className="song-artist">{song.artists[0].name}</div>
            <div className="song-album">{song.album.name}</div>
          </div> */}
          <Button variant="contained" onClick={e => handleQueue(e, song.id)}>
            Queue song!
          </Button>
        </div>
      </div>
    </div>
  );
}
