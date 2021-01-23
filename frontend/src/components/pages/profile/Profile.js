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

    return (
        <div className="hero section center-content illustration-section-01">
            Profile Page
            <Button variant="contained" color="primary" onClick={handleLogout}>
                Log Out
            </Button>
        </div>
    )
}