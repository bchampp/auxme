import { useState } from "react";
import { useHistory } from "react-router-dom";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { API } from "aws-amplify";

const ROOM_CODE_LENGTH = 5;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function Room() {
  const classes = useStyles();
  const history = useHistory();

  const [roomCode, setRoomCode] = useState(""); // Room code state
  const [joinRoomDisabled, setJoinRoomDisabled] = useState(true); // Ensure valid code

  const [newRoomDialogOpen, setNewRoomDialogOpen] = useState(false);

  const handleNewRoomOpen = () => {
    setNewRoomDialogOpen(true);
  };

  const handleNewRoomClose = () => {
    setNewRoomDialogOpen(false);
  };

  /**
   * Handle user text input for room codes
   */
  const handleChange = (e) => {
    // TODO: Add logic such that no more than 5 characters inputted and checkmark when full
    if (roomCode.length >= ROOM_CODE_LENGTH - 1) {
      // TODO: Validate that the room code is valid in the DB
      setJoinRoomDisabled(false);
    } else {
      setJoinRoomDisabled(true);
    }
    setRoomCode(e.target.value);
  };

  /**
   * Handle user selecting join room
   * @param e
   */
  const joinRoom = (e) => {
    history.push(`/room/${roomCode}`);
  };

  return (
    <div style={{textAlign: "center"}}>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Enter Room Code"
          onChange={handleChange}
          value={roomCode}
        />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          disabled={joinRoomDisabled}
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          onClick={joinRoom}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Paper>
      <div style={{padding: "50px"}}>
        <Button variant="contained" color="primary" onClick={handleNewRoomOpen}>
          Create New Room
        </Button>
      </div>
      <NewRoomDialog
        open={newRoomDialogOpen}
        handleClose={handleNewRoomClose}
      />
    </div>
  );
}

function NewRoomDialog({ open, handleClose }) {
  const history = useHistory();
  const [roomName, setRoomName] = useState("");

  const createRoom = () => {

    API.post("auxme", "/rooms/create", {
      body: {
        roomName,
        creatorId: "123",
      },
    }).then(res => {
      handleClose();
      history.push(`/room/${res.roomCode}`);
    }).catch(err => {
      console.log(err);
      alert("Error creating room!");
    })
  };

  const handleChange = (e) => {
    setRoomName(e.target.value);
  };

    // TODO: Display "join room" text box to unauthenticated users
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      {/* TODO: Fix title color */}
      <DialogTitle id="form-dialog-title" color="secondary">Create a new music room!</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>
      Enter a room name to create a new room!
    </DialogContentText> */}
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Room Name"
          type="name"
          value={roomName}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={createRoom} color="primary">
          Create Room!
        </Button>
      </DialogActions>
    </Dialog>
  );
}
