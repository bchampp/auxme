/**
 * Main Room Component
 * This is where the platform interfaces with the queue
 */
import { TextField } from "@material-ui/core";
import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { getWSService } from "../../../service/websocket";
import SpotifyWebApi from "spotify-web-api-js";
import SongCards from "./songs/SongCards";
import QueuedSongCards from "./queue/QueuedSongCards";
import { Button } from "@material-ui/core";

const spotifyApi = new SpotifyWebApi();

export default function Room(props) {
  const roomId = props.match.params.id;

  const [accessToken, setAccessToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [socketConnection, setSocketConnection] = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomName, setRoomName] = useState("");
  const [playing, setPlaying] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    async function fetchData() {
      API.get("auxme", `/rooms/${roomId}`)
        .then((res) => {
          setRoomName(res.data.name);
          setRoomLoading(false);
        })
        .catch((err) => {
          console.log(err);
          alert("The room doesn't exist");
        });
    }
    setSocketConnection(getWSService());
    console.log(window.document.cookie);
    console.log(accessToken);
    const cookies = window.document.cookie.split(";");
    for (const cookie of cookies) {
      if (cookie.includes("access_token")) {
        console.log(cookie);
        setAccessToken(cookie.split("=")[1]);
        spotifyApi.setAccessToken(cookie.split("=")[1]);
      }
    }
    // SpotifyWebApi.setAccessToken(accessToken);
    fetchData();
  }, [roomId, accessToken]);

  // const x = () => {
  //   socketConnection.sendMessage("sendMessage", "Hello world");
  // };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    doSearch();
  };

  const doSearch = () => {
    spotifyApi
      .searchTracks(searchTerm)
      .then((res) => {
        setSearchResults(res.tracks.items);
      })
      .catch((err) => {
        console.log(err);
        setSearchResults([]);
      });
  };

  const handleQueue = (e, value) => {
    console.log(e);
    console.log(value);
    setSearchTerm('');
    setSearchResults([]); // Close search
    let chosenSong;
    for (const song of searchResults) {
        if (song.id === value) {
            console.log(song);
            chosenSong = song;
        }
    }
    const queue = [...queuedSongs];
    queue.push(chosenSong);
    setQueuedSongs(queue);
  }

  const handleVote = (e) => {
      console.log("Test");
  }
  
  //spotify action functions
  const doPlay = () => {
    spotifyApi.play()
      .then(() => {
        console.log("Play request sent");
      }).catch((err) => {
        console.error(err);
      });
  }
  
  const doPause = () => {
    spotifyApi.pause()
      .then(() => {
        console.log("Pause request sent");
      }).catch((err) => {
        console.error(err);
      });
  }
  
  const doGetDevices = () => {
    spotifyApi.getMyDevices()
      .then((data) => {
        let devices = data.devices;
        console.log(data);
        setDevices(devices);
      }).catch((err) => {
        console.log('Something went wrong!', err);
      });
  }
  
  // const doGetTrack = () => {
  //   spotifyApi.getTrack(trackId)
  //     .then
  // }
  
  //spotify handler functions
  const handlePlaying = (e, value) => {
    console.error(e);
    console.log(value);
    if (playing) {
      doPause();
      setPlaying(false);
    } else {
      doPlay();
      setPlaying(true);
    }
  }
  
  const handleGetDevices = (e, value) => {
    console.error(e);
    console.log(value);
    doGetDevices();
  }

  return (
    <>
      <div className="hero section center-content illustration-section-01">
        {roomLoading === true ? (
          <div>Loading...</div>
        ) : (
          <h3>Welcome to Room {roomName}</h3>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", padding: "50px" }}>
          <div style={{ width: "50%" }}>
            <h4>Search Songs</h4>
            <TextField
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Party Rock Anthem"
              variant="outlined"
              color="primary"
            />
            {
                searchResults.length > 0 &&
                <SongCards songs={searchResults} handleQueue={handleQueue}/>
            }
          </div>
          <div style={{ width: "50%" }}>
            <h4>Song Queue</h4>
            {
                queuedSongs.length > 0 ? (
                    <QueuedSongCards songs={queuedSongs} handleVote={handleVote} />
                ) : 
                (
                    <p>Queue some songs to get started!</p>
                )
            }
          </div>
        </div>
        <div>
          <h4>Devices</h4>
          {/* <TextField
            value={devices}
            variant="outlined"
            color="primary"
          /> */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetDevices}>
              Get Devices
          </Button>
        </div>
      </div>
    </>
  );
}
