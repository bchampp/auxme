import { useEffect, useState } from "react";
import NowPlaying from "../components/room/NowPlaying.js";
import "../styles/room.css";
import QueueSong from "../components/room/QueueSong";
import List from "../components/room/List.js";

export default function Room(props) {
    const noSongPlaying = {
        name: "Nothing currently playing",
        artist: "N/A",
        length:0
    }
    const [songNowPlaying, setSongNowPlaying] = useState(noSongPlaying);
    const [songList, setSongList] = useState({});
    
    const handleGetNextSong = () => {
        // TODO: Make API call to pop next song from queue while fetching song info. Populate new song object
        // TODO: update songList then songNowPlaying to force component update
        const tmpSongList = [...songList];

    }

    return (
        <div>
            <NowPlaying song={songNowPlaying}/>
            <List songList = { songList }/>
            <QueueSong/>
        </div>
    )
}