import { useState } from "react";
import "../../styles/songCard.css";
import { Button, IconButton } from "@material-ui/core";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

export default function SongCard({ song, handleVote }) {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        display: "flex",
        padding: "20px",
        justifyContent: "space-evenly",
      }}
    >
      <div>{song.name}</div>
      <div>{song.artist}</div>
      <div>{song.votes}</div>
      <IconButton onClick={() => handleVote(1, song.id)}>
          <ArrowUpwardIcon />
      </IconButton>
      <IconButton onClick={() => handleVote(-1, song.id)}>
          <ArrowDownwardIcon />
      </IconButton>
    </div>
  );
}

function LoadNewTrack({ hash }) {
  return;
}
