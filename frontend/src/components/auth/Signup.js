import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import { API, Auth } from "aws-amplify";
import { useFormFields } from "../../libs/hooksLib";
import Form from "react-bootstrap/Form";
import { onError } from "../../libs/errorLib";
import LoaderButton from "../elements/LoaderButton";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../libs/contextLib";
import "./signup.css";

export default function SignUpDialogue({ open, handleClose }) {
  const [fields, handleFieldChange] = useFormFields({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });

  const [validateDialogueOpen, setValidateDialogueOpen] = useState(false);
  // const handleValidateDialogueOpen = () => {
  //   setValidateDialogueOpen(true);
  // };

  // const handleValidateDialogueClose = () => {
  //   setValidateDialogueOpen(false);
  // };

  const history = useHistory();

  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.nickname.length > 0 &&
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setValidateDialogueOpen(true);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      const user = await Auth.currentUserInfo();
      window.localStorage.setItem("user", user.username);

      API.post("auxme", "/users", {
        body: {
          userId: user.username,
          nickname: fields.nickname
        }
      });

      userHasAuthenticated(true);
      handleClose();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Dialog
        open={validateDialogueOpen}
        // onClose={handleValidateDialogueClose}
        aria-labelledby="form-dialog-title"
      >
      <div className="signup-body">
        <DialogTitle id="form-dialog-title" color="secondary">
          Sign Up.
        </DialogTitle>
        <DialogContentText>Please confirm your email.</DialogContentText>
        <div className="Signup">
          <Form onSubmit={handleConfirmationSubmit}>
            <Form.Group controlId="confirmationCode" size="lg">
              <Form.Label>Confirmation Code</Form.Label>
              <Form.Control
                autoFocus
                type="tel"
                onChange={handleFieldChange}
                value={fields.confirmationCode}
              />
              <Form.Text muted>Check your email for the code!</Form.Text>
            </Form.Group>
            <LoaderButton
              block
              size="lg"
              type="submit"
              variant="success"
              isLoading={isLoading}
              disabled={!validateConfirmationForm()}
            >
              Verify
            </LoaderButton>
          </Form>
        </div>
      </div>
      </Dialog>
    );
  }

  function renderForm() {
    return (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
        <div className="signup-body">
          <DialogTitle id="form-dialog-title" color="secondary">
            <div style={{ textAlign: "center", color: "black" }}>
              Welcome to AuxMe!
            </div>
          </DialogTitle>
          <DialogContentText>
            Please enter a valid username, email and password.
          </DialogContentText>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="nickname" size="lg">
              {/* <Form.Label className="label">Nickname</Form.Label> */}
              <Form.Control
                autoFocus
                placeholder="Username"
                type="nickname"
                value={fields.nickname}
                onChange={handleFieldChange}
                className="input"
              />
            </Form.Group>
            <Form.Group controlId="email" size="lg">
              {/* <Form.Label className="label">Email</Form.Label> */}
              <Form.Control
                placeholder="Email"
                type="email"
                value={fields.email}
                onChange={handleFieldChange}
                className="input"
              />
            </Form.Group>
            <Form.Group controlId="password" size="lg">
              {/* <Form.Label className="label">Password</Form.Label> */}
              <Form.Control
                placeholder="Password"
                type="password"
                value={fields.password}
                onChange={handleFieldChange}
                className="input"
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword" size="lg" style={{'margin-bottom':'10px'}}>
              {/* <Form.Label className="label">Confirm Password</Form.Label> */}
              <Form.Control
                placeholder="Confirm Password"
                type="password"
                onChange={handleFieldChange}
                value={fields.confirmPassword}
                className="input"
              />
            </Form.Group>
            <LoaderButton
              block
              className="center"
              size="lg"
              type="submit"
              variant="success"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              Signup
            </LoaderButton>
          </Form>
          </div>
        </Dialog>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
