import { Button } from "@material-ui/core";
import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {API, Auth} from 'aws-amplify';

import "./room.css";

// TODO: Update card mobile optimization if time

export default function RoomCards({ room }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchUserId() {
      const user = await Auth.currentUserInfo();
      console.log(user);
      if (room.admins.includes(user.username)) {
        setIsAdmin(true);
      }
    }
    fetchUserId();
  }, [room.admins]);

  const deleteRoom = () => {
    API.del("auxme", `/rooms/${room.roomId}`)
    .then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  };

  if (room) {
    return (
      <div className="room-card">
        <h5 className="room-name">{room.name}</h5>
        <div className="button-container">
        <Button variant="contained" color="primary">
          <Link to={`/room/${room.roomId}`}>Join Room!</Link>
        </Button>
        { isAdmin === true && (
          <Button variant="contained" color="secondary" onClick={deleteRoom}>
            Delete
          </Button>
        )}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
