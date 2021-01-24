import React from 'react';
import QueuedSongCard from './QueuedSongCard';

export default function QueuedSongCards({songs, handleVote}) {
    return (
        <ul className="song-list">
            {songs.map(song => (
                <QueuedSongCard song={song} handleVote={handleVote}  />
            ))            
            }
        </ul>
    )
}