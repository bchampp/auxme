import React from 'react';
// import sections
import Hero from './Hero';
import Room from './Room';
import { useAppContext } from "../../../libs/contextLib";
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';


const Home = () => {
  const { isAuthenticated } = useAppContext();
  const history = useHistory();
  return (
    <>
      <Hero className="illustration-section-01" />
      {/* TODO: Enter Room Code Here */}

      {
        isAuthenticated === true ? (
          <Room />
        ) : (
          <div style={{textAlign: "center"}}>
            <p>
            Sign up to get started!
              </p>
            <Button variant="contained" color="primary" onClick={() => history.push('/signup')}>Sign Up</Button>
          </div>
        )
      }
    </>
  );
}

export default Home;