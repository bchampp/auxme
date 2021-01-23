/** 
 * Main Room Component
 * This is where the platform interfaces with the queue
 */
import { Button } from '@material-ui/core';
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { getWSService } from '../../../service/websocket';

export default function Room(props) {
    const roomId = props.match.params.id;

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
        fetchData();
    }, [roomId]);

    const x = () => {
        getWSService().sendMessage('sendMessage', 'Hello world')

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
                {/* TODO: 
            - Connect to websocket here
            - Map the state of the queue here on $connect 
        */}
            </div>
        </>
    )
}