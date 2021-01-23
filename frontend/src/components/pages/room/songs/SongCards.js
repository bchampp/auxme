import React from 'react';
import SongCard from './SongCard';
import './songs.css'

export default function SongCards({songs, handleQueue}) {
    return (
        <ul>
            {songs.map(song => (
                <li key={song.id}>
                    <SongCard song={song} handleQueue={handleQueue} />
                </li>
            ))}
        </ul>
    )
}