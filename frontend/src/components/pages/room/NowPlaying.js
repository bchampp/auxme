import { useState } from "react";
import { useEffect } from 'react';
import "../../styles/nowplaying.css";
import { ProgressBar } from 'react-bootstrap';

export default function NowPlaying ( { song } ) {
    
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        this.interval = setInterval(() => setTimeElapsed(timeElapsed+1), 1000);
    },[]);

    return(
        <div>
            <h2>Now Playing: {song.name} by {song.artist}</h2>
            <ProgressBar now={0} max={song.length}/>
        </div>
    );
}
