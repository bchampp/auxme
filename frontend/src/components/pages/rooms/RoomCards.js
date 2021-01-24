import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import "./room.css";

export default function RoomCards({ room }) {
  const history = useHistory();

  const joinRoom = () => {
    history.push(`/room/${room.roomId}`);
  };

  const deleteRoom = () => {
      console.log("Deleting room!");
    //   TODO: Call API
  };

  return (
    <div className="room-card">
      <h5 className="room-name">{room.name}</h5>
      <p>Users: {room.numUsers}</p>
      <Button variant="contained" color="primary" onClick={joinRoom}>
        Join Room!
      </Button>
      <br></br>
      {room.isAdmin === true && (
        <Button variant="contained" color="secondary" onClick={deleteRoom}>
          Delete
        </Button>
      )}
    </div>
  );
}
