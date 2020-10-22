import React, { FunctionComponent, useState } from 'react';
import { Button, TextField, Dialog, DialogContent, DialogActions, IconButton } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Close } from '@material-ui/icons';
import EventService from "../service/EventService";
import useStyles from '../css';

interface Props {
  signInOpen: boolean;
  setSignInOpen: (bool: boolean) => void;
  isSignUp: boolean;
  setIsSignUp: (bool: boolean) => void;
  setSignedIn: (bool: boolean) => void;
  setToken: (token: string) => void;
  setToastOpen: (bool: boolean) => void;
  setUsername: (username: string) => void;
}

interface LogInFields {
  username: string;
  password: string;
  usernameError: boolean;
  passwordError: boolean;
}

const eventService = new EventService();

const SignInWindow: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [logInFields, setLogInFields] = useState<LogInFields>({username: "", password: "", usernameError: false, passwordError: false});

  const resetSignInFields = () => {
    setLogInFields({ username: "", password: "", usernameError: false, passwordError: false });
  }

  const handleCloseSignIn = () => {
    props.setSignInOpen(false);
    resetSignInFields();
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogInFields({ ...logInFields, username: event.target.value, usernameError: false});
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogInFields({ ...logInFields, password: event.target.value, passwordError: false});
  };

  // Handles signing the user in/up
  const handleUserSignIn = async (username: string, password: string) => {
    try {
      if (username.length == 0 || password.length == 0) {
        throw new Error("Username and password required.")
      }
      if (props.isSignUp) {
        await eventService.userSignUp(username, password);
      }
      // Hit the backend to sign the user in, then set token and username
      const token: string = await eventService.userLogIn(username, password);
      props.setToken(token);
      props.setUsername(username);
      props.setSignedIn(true);
      handleCloseSignIn();
      setErrorMessage("");
      // Display confirmation toast
      props.setToastOpen(true);
    } catch(error) {
      setLogInFields({ username: "", password: "", usernameError: true, passwordError: true })
      setErrorMessage(error.message);
    }
  };

  const handleSwapToSignUp = () => {
    props.setIsSignUp(true);
    setErrorMessage("");
    resetSignInFields();
  };

  return (
    <Dialog open={props.signInOpen} onClose={handleCloseSignIn}>
      <div style={{display: "flex", alignItems: "flex-start"}}>
        <div className={classes.gap}/>
        <img src={logo} style={{marginTop: "3%"}} className={classes.logoImg}/>
        <div className={classes.endDiv}><IconButton onClick={handleCloseSignIn}><Close/></IconButton></div>
      </div>
      <DialogContent style={{display: "flex", flexDirection: "column"}}>
        <TextField
        autoFocus
        id="username"
        label="Username"
        value={logInFields.username}
        onChange={handleUsernameChange}
        error={logInFields.usernameError}
        />
        <div style={{marginTop: "1%"}} />
        <TextField
        id="password"
        label="Password"
        type="password"
        value={logInFields.password}
        onChange={handlePasswordChange}
        error={logInFields.passwordError}
        />
      </DialogContent>
      <DialogActions disableSpacing style={{display: "flex", flexDirection: "column"}}>
        <Button
          onClick={async () => {await handleUserSignIn(logInFields.username, logInFields.password);}}
          variant="contained"
          color="primary"
          size="large">
          {props.isSignUp ? "Sign Up" : "Sign In"}
        </Button>
        <div style={{marginTop: 8}}/>
        {!props.isSignUp &&
          <Button onClick={handleSwapToSignUp} color="primary" size="small">
            Create an account
          </Button>
        }
      </DialogActions>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Dialog>
  )
}

export default SignInWindow;
