import React, { useState } from 'react';
const rooms = [];
export default function Rooms() {
    const [roomList, setroomList] = useState([]);

    return (
    <div className="hero section center-content illustration-section-01">
        Rooms Page
        {/* TODO: 
            - Call API get all rooms for user 
            - Map the list of available rooms
            - Still show the "Create New Room" Component here     
        
        */}
    </div>
    )
}