import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
import { API, Auth } from "aws-amplify";
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import { useAppContext } from "../../../libs/contextLib";

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
  const { isAuthenticated } = useAppContext();

  const [roomCode, setRoomCode] = useState(""); // Room code state
  const [roomLoading, setRoomLoading] = useState(false);
  const [joinRoomDisabled, setJoinRoomDisabled] = useState(true); // Ensure valid code
  const [roomError, setRoomError] = useState(false);
  const [newRoomDialogOpen, setNewRoomDialogOpen] = useState(false);

  const handleNewRoomOpen = () => {
    setNewRoomDialogOpen(true);
  };

  const handleNewRoomClose = () => {
    setNewRoomDialogOpen(false);
  };

  useEffect(() => {
    async function validateRoomExists() {
      await API.get("auxme", `/rooms/${roomCode}`, {
        body: {
          pathParameters: {
            id: roomCode,
          },
        },
      }).then((res) => { // Room exists!
        setRoomLoading(false);
        setJoinRoomDisabled(false);
      }).catch((err) => {
        console.log("Something went wrong!", err);
        setRoomError(true);
        setRoomLoading(false);
      });
    }

    if (roomCode.length === ROOM_CODE_LENGTH ) { // room code is full length, does the room exist?
      setRoomLoading(true);
      validateRoomExists();
    } else if (roomCode.length > 0) {
      setRoomError(false);
      setJoinRoomDisabled(true);
    } else {
      setRoomError(false);
    }

  }, [roomCode]);

  /**
   * Handle user text input for room codes
   */
  const handleChange = async (e) => {
    setRoomCode(e.target.value);
  };

  /**
   * Handle user selecting join room
   * @param e
   */
  const joinRoom = (e) => {
    history.push(`/room/${roomCode}`);
  };
  
  const keyPress = (e) => {
    if (e.keyCode === 13) {
      joinRoom();
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder="Enter an Room Code"
          onChange={handleChange}
          value={roomCode}
          inputProps={{maxLength: 5}}
          onKeyDown={keyPress}
        />
        {
          (roomLoading === true &&
            <CircularProgress />
          )
        }
        {
          joinRoomDisabled === false &&
          <CheckCircleIcon />
        }
        {
          roomError && 
          <CloseIcon />
        }
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
      {
          roomError && 
          <div style={{"color": "red"}}>Please enter a valid room code.</div>
        }
      
      { isAuthenticated === true ? (
        <div>
          <div style={{ padding: "50px" }}>
            <Button variant="contained" color="primary" onClick={handleNewRoomOpen}>
              Create New Room
            </Button>
          </div>
          <NewRoomDialog
            open={newRoomDialogOpen}
            handleClose={handleNewRoomClose}
          />
        </div>
        ) : (<></>)
      }
    </div>
  );
}

function NewRoomDialog({ open, handleClose }) {
  const history = useHistory();
  const [roomName, setRoomName] = useState("");
  const { isAuthenticated } = useAppContext();


  const createRoom = async () => {
    const user = await Auth.currentUserInfo();
    const userId = user.username;
    console.log(userId);
    API.post("auxme", "/rooms", {
      body: {
        roomName,
        userId,
      },
    }
    )
      .then((res) => {
        handleClose();
        history.push(`/room/${res.roomCode}`);
      })
      .catch((err) => {
        console.log(err);
        alert("Error creating room!");
      });
    handleClose();
  };

  const handleChange = (e) => {
    setRoomName(e.target.value);
  };

  return (
    <>
    { isAuthenticated === false ? (
      <Room />
    ) : (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {/* TODO: Fix title color */}
        <DialogTitle id="form-dialog-title" color="secondary">
          <div style={{color: "black"}}>Create a new music room!</div>
        </DialogTitle>
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
        <DialogActions style={{display: "flex", "justifyContent": "center"}}> 
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={createRoom} color="primary">
            Create Room!
          </Button>
        </DialogActions>
      </Dialog>
    )}
    </>
  );
}
