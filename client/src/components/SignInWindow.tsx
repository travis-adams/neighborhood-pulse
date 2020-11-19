import React, { FunctionComponent, useState } from 'react';
import { Button, TextField, Dialog, DialogContent, DialogActions, IconButton, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Close } from '@material-ui/icons';
import EventService from "../service/EventService";
import useStyles from '../css';
import User from '../domain/User';

interface Props {
  isSignedIn: boolean;
  isSignInOpen: boolean;
  setIsSignInOpen: (bool: boolean) => void;
  isSignUp: boolean;
  setIsSignUp: (bool: boolean) => void;
  setIsSignedIn: (bool: boolean) => void;
  setToken: (token: string) => void;
  isToastOpen: boolean;
  setIsToastOpen: (bool: boolean) => void;
  setUser: (user: User) => void;
}

interface SignInFields {
  username: string;
  password: string;
  usernameValid: boolean;
  passwordValid: boolean;
}

const eventService = new EventService();

const SignInWindow: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [signInFields, setSignInFields] = useState<SignInFields>({username: "", password: "", usernameValid: true, passwordValid: true});

  const handleCloseToast = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setIsToastOpen(false);
  }

  const resetSignInFields = () => {
    setSignInFields({ username: "", password: "", usernameValid: true, passwordValid: true });
  }

  const handleCloseSignIn = () => {
    props.setIsSignInOpen(false);
    setErrorMessage("");
    resetSignInFields();
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFields({ ...signInFields, username: event.target.value, usernameValid: true});
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFields({ ...signInFields, password: event.target.value, passwordValid: true});
  }

  // Handles signing the user in/up
  const handleUserSignIn = async (username: string, password: string) => {
    try {
      if (username.length === 0 || password.length === 0) {
        throw new Error("Username and password required.")
      }
      if (props.isSignUp) {
        await eventService.userSignUp(username, password);
      }
      // Hit the backend to sign the user in, then set token and user
      const token: string = await eventService.userLogIn(username, password);
      props.setToken(token);
      const user: User = await eventService.fetchUserInfo(username, token);
      props.setUser(user);
      props.setIsSignedIn(true);
      handleCloseSignIn();
      // Display confirmation toast
      props.setIsToastOpen(true);
    } catch (error) {
      setSignInFields({ username: "", password: "", usernameValid: false, passwordValid: false })
      setErrorMessage(error.message);
    }
  }

  // Toggles between the sign-in and sign-up screens
  const handleToggleSignUp = () => {
    props.setIsSignUp(!props.isSignUp);
    setErrorMessage("");
    resetSignInFields();
  }

  return (
    <div>
      <Dialog open={props.isSignInOpen} onClose={handleCloseSignIn}>
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
          value={signInFields.username}
          onChange={handleUsernameChange}
          error={!signInFields.usernameValid}
          />
          <div style={{marginTop: "1%"}} />
          <TextField
          id="password"
          label="Password"
          type="password"
          value={signInFields.password}
          onChange={handlePasswordChange}
          error={!signInFields.passwordValid}
          />
        </DialogContent>
        <DialogActions disableSpacing style={{display: "flex", flexDirection: "column"}}>
          <Button
            onClick={async () => {await handleUserSignIn(signInFields.username, signInFields.password);}}
            variant="contained"
            color="primary"
            size="large">
            {props.isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <div style={{marginTop: 8}}/>
          <Button onClick={handleToggleSignUp} color="primary" size="small">
            {props.isSignUp ? "Return to sign in" : "Create an account"}
          </Button>
        </DialogActions>
        {errorMessage && <Alert severity="error" variant="filled">{errorMessage}</Alert>}
      </Dialog>
      <Snackbar
        open={props.isToastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert onClose={handleCloseToast} severity="success">
          {props.isSignedIn ? "Signed in" : "Signed out"}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SignInWindow;
