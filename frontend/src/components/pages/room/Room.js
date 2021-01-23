import React from 'react';

export default function Room(props){
    return (
        <div className="hero section center-content illustration-section-01">
        <h1>Welcome to room {props.match.params.id}</h1>
        {/* TODO: 
            - Connect to websocket here
            - Map the state of the queue here on $connect 
        */}
    </div>
    )
}