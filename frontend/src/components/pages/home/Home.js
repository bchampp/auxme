import React from "react";
// import sections
import { useState } from "react";
import Hero from "./Hero";
import Room from "./Room";
import { useAppContext } from "../../../libs/contextLib";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SignUpDialogue from "../../auth/Signup";

const Home = () => {
  const { isAuthenticated } = useAppContext();
  const history = useHistory();

  const [signUpDialogueOpen, setSignUpDialogueOpen] = useState(false);
  // const handleSignUpDialogueOpen = () => {
  //   setSignUpDialogueOpen(true);
  // };

  const handleSignUpDialogueClose = () => {
    setSignUpDialogueOpen(false);
  };

  return (
    <>
      <Hero className="illustration-section-01" />
      {/* TODO: Enter Room Code Here */}

      {isAuthenticated === true ? (
        <Room />
      ) : (
        <div style={{ textAlign: "center" }}>
          <p>Sign up to get started!</p>
          <Button
            variant="contained"
            color="primary"
            onClick={setSignUpDialogueOpen}
          >
            Sign Up
          </Button>
          <SignUpDialogue
            open={signUpDialogueOpen}
            handleClose={handleSignUpDialogueClose}
          />
        </div>
      )}
    </>
  );
};

export default Home;
