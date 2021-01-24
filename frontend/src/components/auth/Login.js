import React, { useState } from 'react';
import { useAppContext } from '../../libs/contextLib';
import { Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import { useFormFields } from "../..//libs/hooksLib";
import { onError } from "../../libs/errorLib";
import { Auth } from "aws-amplify";
import Form from "react-bootstrap/Form";
import LoaderButton from "../elements/LoaderButton";
import './signup.css';

export default function LogInDialogue({ open, handleClose }) {
    const history = useHistory();
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [fields, handleFieldChange] = useFormFields({
      email: "",
      password: ""
    });

    function validateForm() {
      return fields.email.length > 0 && fields.password.length > 0;
    }

    async function handleSubmit(event) {
      event.preventDefault();

      setIsLoading(true);

      try {
        await Auth.signIn(fields.email, fields.password);
        userHasAuthenticated(true);
        handleClose();
        history.push("/");
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
    }
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
      <div className="signup-body">
        <DialogTitle id="form-dialog-title" color="secondary">Log In</DialogTitle>
        <DialogContentText>
        Please enter your email and password.
      </DialogContentText>
        <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="email">
            <Form.Control
              autoFocus
              placeholder="Email"
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
              className="input"
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Control
              placeholder="Password"
              type="password"
              value={fields.password}
              onChange={handleFieldChange}
              className="input"
            />
          </Form.Group>

          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Log In
          </LoaderButton>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>

        </Form>
      </div>
      </div>
      </Dialog>

    );
  }
