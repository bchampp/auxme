import React, { useEffect, useState } from "react";
import RoomCards from "./RoomCards";

const fake_data = [
  {
    roomId: "12345",
    name: "Queen's Friends",
    numUsers: 10,
    isAdmin: true,
  },
  {
    roomId: "12345",
    name: "QHacks friends",
    numUsers: 3,
    isAdmin: false,
  },
  {
    roomId: "12345",
    name: "Another test room",
    numUsers: 1,
    isAdmin: false,
  },
];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // TODO: Integrate with API for getRooms()
      setRooms(fake_data);
    }
    fetchData();
  }, []);
  return (
    <div className="hero section center-content illustration-section-01">
      <h3>My Rooms</h3>
      <ul>
        {rooms.length > 0 &&
          rooms.map((room) => (
            <li>
              <RoomCards room={room} />
            </li>
          ))}
      </ul>
    </div>
  );
}
