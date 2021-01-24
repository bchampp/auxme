import React from "react";

export default function QueuedSongCard({ song, handleVote }) {
  return (
    <div className="song-card">
      <img src={song.album.images[0].url} alt="Now Playing"></img>
      <div className="song-info-container">
        <h5 className="song-title">{song.name}</h5>
        <div className="song-info-container">
          {/* <div className="song-about-container">
                <div className="song-artist">{song.artists[0].name}</div>
                <div className="song-album">{song.album.name}</div>
              </div> */}
        </div>
      </div>
    </div>
  );
}
