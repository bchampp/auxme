/** 
 * Main Room Component
 * This is where the platform interfaces with the queue
 */
import { Button, TextField } from '@material-ui/core';
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { getWSService } from '../../../service/websocket';
import SpotifyWebApi from "spotify-web-api-js";
import List from './List';

const spotifyApi = new SpotifyWebApi();

export default function Room(props) {
    const roomId = props.match.params.id;

    const [accessToken, setAccessToken] = useState('');
    const [search, setSearch] = useState('');
    const [socketConnection, setSocketConnection] = useState(null);
    const [roomLoading, setRoomLoading] = useState(true);
    const [roomName, setRoomName] = useState('');

    useEffect(() => {
        async function fetchData() {
            API.get("auxme", `/rooms/get/${roomId}`)
                .then(res => {
                    setRoomName(res.data.name)
                    setRoomLoading(false);
                }).catch(err => {
                    console.log(err);
                    alert("The room doesn't exist");
                })
        }
        setSocketConnection(getWSService());
        console.log(window.document.cookie);
        const cookies = window.document.cookie.split(";");
        for (const cookie of cookies) {
            if (cookie.includes("access_token")) {
                console.log(cookie);
                setAccessToken(cookie.split("=")[1]);
                spotifyApi.setAccessToken(cookie.split("=")[1]);
            }
        }
        // SpotifyWebApi.setAccessToken(accessToken);
        fetchData();
    }, [roomId]);

    const x = () => {
        socketConnection.sendMessage('sendMessage', 'Hello world')
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const doSearch = () => {
        spotifyApi.searchTracks(search)
        .then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <>
            <div className="hero section center-content illustration-section-01">
                {
                    roomLoading === true ? (
                        <div>Loading...</div>
                    ) : (
                            <h3>Welcome to Room {roomName}</h3>
                        )
                }
                <Button variant="contained" onClick={() => x()} />
                <TextField value={search} onChange={handleSearch} />
                <Button onClick={doSearch} variant="contained">Search</Button>
                <List />
                {/* TODO: 
            - Connect to websocket here
            - Map the state of the queue here on $connect 
        */}
            </div>
        </>
    )
}