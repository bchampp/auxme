import { IconButton } from "@material-ui/core";
import React from "react";
import "../songs.css";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default function QueuedSongCard({ song, handleVote }) {
  return (
    <li className="song-card" key={song.id}>
      <img src={song.album.images[0].url} alt="album-art"></img>
      <div className="song-info-container">
        <h5 className="song-title">{song.name} - {song.artists[0].name}</h5>
        <div className="song-info-container">
          <IconButton onClick={e => handleVote(e, song.id, +1)}>
            <ArrowUpwardIcon style={{color: "white"}}/>
          </IconButton>
          <IconButton onClick={e => handleVote(e, song.id, -1)}>
            <ArrowDownwardIcon style={{color: "white"}}/>
          </IconButton>
          <div>
            {song.votes}
          </div>
        </div>
      </div>
    </li>
  );
}
