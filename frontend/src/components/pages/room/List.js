import { useState } from "react";
import SongCard from "./SongCard";

const songCardList = [
    //TODO: add default 'queue empty' row
  {
    name: "I Love College",
    artist: "Asher Roth",
    id: "1",
    votes: 0,
    length: 0
  },
  {
    name: "BUTTERFLY EFFECT",
    artist: "Travis Scott",
    id: "2",
    votes: 0,
    length: 0

  },
  {
    name: "goosebumps",
    artist: "Travis Scott",
    id: "3",
    votes: 0,
    length: 0

  }
];

export default function List( { songList }) {
  const [songs, setSongs] = useState(songList);


  const handleVote = (val, id) => {
    console.log("Handling the vote");
    const newArray = [...songs]; 

    if (val == -1) {
      console.log("Downvoted song with ID", id);
    //   TODO: Integrate with websocket 
        for (var i = 0; i < newArray.length; i++) {
            if (newArray[i] === id) {
                newArray[i].votes = newArray[i].votes - 1
            }
        }
    } else {
      console.log("Upvoted song with ID", id);
      for (var i = 0; i < newArray.length; i++) {
        if (newArray[i].id === id) {
            newArray[i].votes= newArray[i].votes + 1;
        }
    }
    }
    setSongs(newArray);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", paddingTop: "50px" }}>
    {/* TODO: Sort logic for same number of votes, one that was most recently voted should be on top  */}
      {songs.sort((a, b) => a.votes < b.votes ? 1 : -1).map((song) => (
        <SongCard song={song} handleVote={handleVote} />
      ))}
    </div>
  );
}
