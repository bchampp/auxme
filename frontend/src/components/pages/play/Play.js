import React from 'react';
import Button from '@material-ui/core/Button';
// import api from '../../../api';

const Play = () => {

  const loginButton = () => {
    console.log("Logging In");
    window.location.replace("http://localhost:8080/api/login/login");
  }

  // const handleButton = () => {
  //   console.log("Button Click");
  //   api.spotify.getUser();
  // }

  // const playButton = () => {
  //   console.log("Play button clicked");
  //   api.spotify.togglePlay();
  // }

  // const nextTrack = () => {
  //   console.log("Next track");
  //   api.spotify.nextTrack();
  // }

  // const previousTrack = () => {
  //   console.log("Previous track");
  //   api.spotify.previousTrack();
  // }

  // const addToQueue = () => {
  //   console.log("Adding song to queue");
  //   api.spotify.addToQueue();
  // }

  // const search = () => {
  //   console.log("Searching for song");
  //   api.spotify.search();
  // }
  return (
    <>
      Music Player
      <Button style={{'zIndex': 101, color: 'white'}} onClick={() => {loginButton()}}>
        Login
      </Button>
    </>
  );
}

export default Play;
