/** 
 * Main Room Component
 * This is where the platform interfaces with the queue
 */
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react';

export default function Room(props) {
    const roomId = props.match.params.id;

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
        fetchData();
    }, []);

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
                {/* TODO: 
            - Connect to websocket here
            - Map the state of the queue here on $connect 
        */}
            </div>
        </>
    )
}