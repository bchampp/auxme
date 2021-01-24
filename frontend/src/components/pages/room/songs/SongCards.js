import React from 'react';
import SongCard from './SongCard';
import '../songs.css'

export default function SongCards({songs, handleQueue}) {
    return (
        <ul className="song-list">
            {songs.map(song => (
                    <SongCard song={song} handleQueue={handleQueue} />
            ))}
        </ul>
    )
}