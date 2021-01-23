import { Button } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../../libs/contextLib';

export default function Profile() {
  const { userHasAuthenticated } = useAppContext();
 const history = useHistory();
    async function handleLogout() {
        await Auth.signOut();
        userHasAuthenticated(false);
        history.push('/');
      }

      const handleSpotifyLogin = async () => {
          window.location = "https://npzwmcjulf.execute-api.ca-central-1.amazonaws.com/dev/spotify/login"
      }

    return (
        <div className="hero section center-content illustration-section-01">
            <h3>Profile Page</h3>
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Log Out
            </Button>
            <br style={{padding: "20px", height: "10px"}}></br>
            <Button variant="contained" color="primary" onClick={() => handleSpotifyLogin()}>
                Login to spotify
            </Button>
        </div>
    )
}