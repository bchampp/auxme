import { Button } from "@material-ui/core";
import React from "react";
// import "./songs.css";

export default function DeviceCard({ device, handleDevices }) {
  return (
    <div className="song-card">
      <div className="song-info-container">
        <h5 className="song-title">{device.name}</h5>
        <h5>Volume: {device.volume_percent}</h5>
        <div className="song-info-container">
          <Button
            className="queue-song-button"
            variant="outlined"
            color="secondary"
            onClick={e => handleDevices(e, device.id)}>
            Use Device
          </Button>
        </div>
      </div>
    </div>
  );
}
