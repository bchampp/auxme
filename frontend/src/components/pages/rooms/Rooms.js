import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import RoomCards from "./RoomCards";
import { Auth } from "aws-amplify";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Rooms() {
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const user = await Auth.currentUserInfo();
      const userId = user.username;

      await API.get("auxme", `/rooms/all/${userId}`)
        .then((res) => {
          const roomsInfo = res.items;
          setRooms(roomsInfo);
          setLoadingRooms(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, []);

  return (
    <div className="hero section center-content illustration-section-01">
      <h3>My Rooms</h3>
      {loadingRooms === true ? (
        <CircularProgress />
      ) : (
        <ul className="rooms-list">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <li className="room-cards" key={room !== null && room.id}>
                <RoomCards room={room} />
              </li>
            ))) : (
              <div>
                <h5>No rooms to show</h5>
                <h5>Make one and get partying!</h5>
              </div>
            )
          }
        </ul>
      )}
    </div>
  );
}
