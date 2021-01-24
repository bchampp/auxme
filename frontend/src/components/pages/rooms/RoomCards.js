import { Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import "./room.css";

export default function RoomCards({ room }) {
  // const history = useHistory();

  const deleteRoom = () => {
    //   TODO: Call API
  };

  if (room) {
  return (
    <div className="room-card">
      <h5 className="room-name">{room.name}</h5>
      <p>Users: {room.numUsers}</p>
      <Button variant="contained" color="primary">
        <Link to={`/room/${room.roomId}`}>
        Join Room!
        </Link>
      </Button>
      <br></br>
      {room.isAdmin === true && (
        <Button variant="contained" color="secondary" onClick={deleteRoom}>
          Delete
        </Button>
      )}
    </div>
  );
      } else {
        return (<div></div>)
      }
}
