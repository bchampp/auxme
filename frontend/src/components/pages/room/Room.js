/**
 * Main Room Component
 * This is where the platform interfaces with the queue
 */
import { IconButton, TextField } from "@material-ui/core";
import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { getWSService } from "../../../service/websocket";
import SpotifyWebApi from "spotify-web-api-js";
import SongCards from "./songs/SongCards";
import QueuedSongCards from "./queue/QueuedSongCards";
import { Auth } from "aws-amplify";
import SpotifyPlayer from "react-spotify-web-playback";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import InputAdornment from '@material-ui/core/InputAdornment';
const spotifyApi = new SpotifyWebApi();

export default function Room(props) {
  const roomId = props.match.params.id;
  const sharingLink = `localhost:3000/room/${roomId}`;
  const [queueId, setQueueId] = useState('');
  const [userAdded, setUserAdded] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [queuedSongs, setQueuedSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [socketConnection, setSocketConnection] = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    async function postUser() {
      const user = await Auth.currentUserInfo();
      const userId = user.username;

      API.patch("auxme", `/rooms/${roomId}`, {
        body: {
          userId,
        },
      }).then(() => setUserAdded(true));
    }
    
    async function fetchData() {
      API.get("auxme", `/rooms/${roomId}`)
        .then((res) => {
          setQueueId(res.data.queueId);
          setRoomName(res.data.name);
          setRoomLoading(false);
        })
        .catch((err) => {
          console.log(err);
          alert("The room doesn't exist");
        });
    }

    if (userAdded === false) {
      postUser();
    }

    setSocketConnection(getWSService());
    const cookies = window.document.cookie.split(";");
    for (const cookie of cookies) {
      if (cookie.includes("access_token")) {
        setAccessToken(cookie.split("=")[1]);
        spotifyApi.setAccessToken(cookie.split("=")[1]);
      }
    }
    // SpotifyWebApi.setAccessToken(accessToken);
    fetchData();
  }, [roomId, accessToken, socketConnection, userAdded]);

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
    setSearchTerm("");
    setSearchResults([]); // Close search
    let chosenSong;
    for (const song of searchResults) {
      if (song.id === value) {
        chosenSong = song;
      }
    }
    const queue = [...queuedSongs];
    queue.push(chosenSong);
    setQueuedSongs(queue);
    API.patch('auxme', '/queue/add', {
      body: {
      queueId,
      songId: value
      }
    })
  };

  const handleVote = async (e, id, value) => {
    API.patch("auxme", "/queue/vote", {
      body: {
        queueId,
        songId: id,
        voteValue: value
      }
    })
  };

  const copyToClipboard = () => {
    const sharingText = document.getElementById('sharing-link');
    sharingText.select();
    sharingText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <>
      <div
        style={{ height: "100vh" }}
        className="hero section center-content illustration-section-01"
      >
        {roomLoading === true ? (
          <div>Loading...</div>
        ) : (
          <>
            <h4>Welcome to the room - {roomName}</h4>
            {/* TODO: This should be light color */}
            <TextField
            color="secondary"
            style={{color: 'white'}}
              id="sharing-link"
              value={sharingLink}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={copyToClipboard}>
                      <FileCopyIcon/>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
                {searchResults.length > 0 && (
                  <SongCards songs={searchResults} handleQueue={handleQueue} />
                )}
              </div>
              <div style={{ width: "50%" }}>
                <h4>Song Queue</h4>
                {queuedSongs.length > 0 ? (
                  <QueuedSongCards
                    songs={queuedSongs}
                    handleVote={handleVote}
                  />
                ) : (
                  <p>Queue some songs to get started!</p>
                )}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
              }}
            >
              <SpotifyPlayer
                token="BQDX_n2_bFl49XqEYQ8wliYL8KU-AYXKDVKyv26Ec72lGxi6QBNeAIEP35hejX67Yo7sLQKrYNdqpZEZXEjxsCJzdqsOfyTENodpd75cqstGPkVheGJ2Hxo6Jmu6zNmbS71Xk7xqX-pYh42V5n0g5fGcU0gFN0LZA195qK4moJ0IRcJZ-jR2ZYhxWr46_lKcBX1jSqR9y26cD8I"
                uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
                styles={{ bgColor: "#C5C8C6", trackArtistColor: "black" }}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
