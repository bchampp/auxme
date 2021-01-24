import React from 'react';
import DeviceCard from './DeviceCard';
// import './songs.css'

export default function DeviceCards({devices, handleDevices}) {
    return (
        <ul>
            {devices.map(device => (
                <li key={device.id}>
                    <DeviceCard device={device} handleDevices={handleDevices} />
                </li>
            ))}
        </ul>
    )
}