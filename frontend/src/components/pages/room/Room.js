/**
 * Main Room Component
 * This is where the platform interfaces with the queue
 */
import { IconButton, TextField } from "@material-ui/core";
import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import SongCards from "./songs/SongCards";
import QueuedSongCards from "./queue/QueuedSongCards";
import SpotifyPlayer from "react-spotify-web-playback";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import InputAdornment from "@material-ui/core/InputAdornment";
import "./room.css";
const spotifyApi = new SpotifyWebApi();

export default function Room(props) {
  // Room Constants
  const roomId = props.match.params.id;
  const sharingLink = `https://auxme.ca/room/${roomId}`;

  const [accessToken, setAccessToken] = useState(""); // Spotify Access Token

  // Song searching
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Queue State
  const [queueId, setQueueId] = useState("");
  const [queuedSongs, setQueuedSongs] = useState([]);

  // Room Info
  const [roomLoading, setRoomLoading] = useState(true);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    let interval = setInterval(() => fetchQueueState(), 5000);

    async function fetchQueueState() {
      const res = await API.get("auxme", `/queue/${queueId}`);
      console.log(res);
      const queueState = res.items;
      const songs = [];
      for (const song of queueState) {
        const res = await spotifyApi.getTrack(song.songId);
        songs.push({ ...res, votes: song.votes });
      }
      songs.sort((a, b) => (a.votes < b.votes ? 1 : -1));
      setQueuedSongs(songs);
      spotifyApi.queue(songs[0].uri);
    }

    async function fetchRoomData() {
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

    fetchRoomData();

    // Fetch Queue State if it doesn't exist
    if (queueId !== "") {
      fetchQueueState();
    }

    // Fetch Spotify Access Token if it doesn't exist
    if (accessToken === "") {
      const cookies = window.document.cookie.split(";");
      for (const cookie of cookies) {
        if (cookie.includes("access_token")) {
          setAccessToken(cookie.split("=")[1]);
          spotifyApi.setAccessToken(cookie.split("=")[1]);
        }
      }
    }

    // Component unmounts, want to unsubscribe to the interval
    return () => clearInterval(interval);
    // SpotifyWebApi.setAccessToken(accessToken);
  }, [roomId, accessToken, queueId]);

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
    API.patch("auxme", "/queue/add", {
      body: {
        queueId,
        songId: value,
      },
    });
  };

  const handleVote = async (e, id, value) => {
    API.patch("auxme", "/queue/vote", {
      body: {
        queueId,
        songId: id,
        voteValue: value,
      },
    });
    const currentSongs = [...queuedSongs];
    for (const s of currentSongs) {
      if (s.id === id) {
        s.votes += value;
      }
    }
    setQueuedSongs(currentSongs);
  };

  const copyToClipboard = () => {
    const sharingText = document.getElementById("sharing-link");
    sharingText.select();
    sharingText.setSelectionRange(0, 99999);
    document.execCommand("copy");
  };

  return (
    <>
      <div
        style={{ minHeight: "100vh" }}
        className="hero section center-content illustration-section-01"
      >
        {roomLoading === true ? (
          <div>Loading...</div>
        ) : (
          <>
            <h4>Welcome to the room - {roomName}</h4>
            {/* TODO: This should be light color */}
            <TextField
              style={{ width: "400px" }}
              className="input-shrink"
              id="sharing-link"
              value={sharingLink}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={copyToClipboard}>
                      <FileCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                padding: "50px",
              }}
            >
              {accessToken !== "" && (
                <div style={{ width: "50%" }}>
                  <h4>Search Songs</h4>
                  <TextField
                    className="input"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Party Rock Anthem"
                    variant="outlined"
                    color="primary"
                  />
                  {searchResults.length > 0 && (
                    <SongCards
                      songs={searchResults}
                      handleQueue={handleQueue}
                    />
                  )}
                </div>
              )}
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
            {accessToken !== "" && (
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                }}
              >
                <SpotifyPlayer
                  token={accessToken}
                  uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
                  styles={{ bgColor: "#C5C8C6", trackArtistColor: "black" }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
