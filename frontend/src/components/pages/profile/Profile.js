import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { API } from "aws-amplify";
import { useAppContext } from "../../../libs/contextLib";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import "./profile.css";

const fake_avatar =
  "https://www.nj.com/resizer/h8MrN0-Nw5dB5FOmMVGMmfVKFJo=/450x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg";

export default function Profile() {
  const { userHasAuthenticated } = useAppContext();
  const history = useHistory();

  const [avatorSrc, setAvatarSrc] = useState("");
  const [nickname, setNickName] = useState("");
  const [numRooms, setNumRooms] = useState(0);

  useEffect(() => {
    async function getUserInfo() {
      const user = await Auth.currentUserInfo();
      const userId = user.username;

      API.get("auxme", `/users/${userId}`)
        .then(res => {
          setAvatarSrc(fake_avatar);
          setNumRooms(res.data.numRooms);
          setNickName(res.data.nickname);
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
    getUserInfo();
  }, []);

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/");
  }

  const handleSpotifyLogin = async () => {
    window.location = "https://accounts.spotify.com/en/authorize?response_type=token&client_id=359de0c1b4284c0294a710c41c139bbacd&redirect_uri=https%3A%2F%2Fnpzwmcjulf.execute-api.ca-central-1.amazonaws.com%2Fdev%2Fspotify%2Fcallback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state&show_dialog=true"
  };

  return (
    <div className="hero section center-content illustration-section-01">
      <h3>Profile Page</h3>
      <div className="profile">
        <img className="profile-img" alt="profile" src={avatorSrc}></img>
      </div>
      <div>Current nickname: {nickname}</div>
      <div>Number of rooms: {numRooms}</div>

      <br style={{ padding: "20px", height: "10px" }}></br>
      <div className="profile-button">
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSpotifyLogin()}
        >
          Connect spotify account!
        </Button>
      </div>
      <div className="profile-button">
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
