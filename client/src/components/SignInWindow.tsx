import React, { FunctionComponent, useState } from 'react';
import { Button, TextField, Dialog, DialogContent, DialogActions, IconButton, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Close } from '@material-ui/icons';
import EventService from "../service/EventService";
import useStyles from '../css';
import User from '../domain/User';
import Grid from '@material-ui/core/Grid/Grid';
import Select from '@material-ui/core/Select/Select';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import FormControl from '@material-ui/core/FormControl/FormControl';

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
  firstName: string;
  lastName: string;
  confirmPassword: string;
  usernameError: boolean;
  passwordError: boolean;
  firstNameError: boolean;
  lastNameError: boolean;
  confirmPasswordError: boolean;
}

const eventService = new EventService();

const SignInWindow: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [signInFields, setSignInFields] = useState<SignInFields>({username: "", password: "", usernameError: false, passwordError: false, firstName: "", lastName: "", confirmPassword: "", firstNameError: false, lastNameError: false, confirmPasswordError: false});
  const [group, setGroup] = useState<string>("");

  const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setGroup(event.target.value);
  };

  const resetSignInFields = () => {
    setSignInFields({ username: "", password: "", usernameError: false, passwordError: false, firstName: "", lastName: "", confirmPassword: "", firstNameError: false, lastNameError: false, confirmPasswordError: false});
  }

  const handleCloseSignIn = () => {
    props.setIsSignInOpen(false);
    setErrorMessage("");
    resetSignInFields();
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFields({ ...signInFields, username: event.target.value, usernameError: false});
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFields({ ...signInFields, password: event.target.value, passwordError: false});
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFields({ ...signInFields, confirmPassword: event.target.value, confirmPasswordError: false});
  }

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFields({ ...signInFields, firstName: event.target.value, firstNameError: false});
  }

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInFields({ ...signInFields, lastName: event.target.value, lastNameError: false});
  }

  // Handles signing the user in/up
  const handleUserSignIn = async (username: string, password: string, firstName: string, lastName: string, confirmPassword: string) => {
    try {
      if (username.length === 0 || password.length === 0) {
        throw new Error("Username and password required.")
      }
      if (props.isSignUp) {
        if (firstName.length === 0 || lastName.length === 0) {
          throw new Error("First and last name required.")
        } 
        if (password != confirmPassword) {
          throw new Error("Passwords do not match.")
        }
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
    } catch(error) {
      setSignInFields({ username: "", password: "", usernameError: true, passwordError: true, firstName: "", lastName: "", confirmPassword: "", firstNameError: true, lastNameError: true, confirmPasswordError: true})
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
    <Dialog open={props.isSignInOpen} onClose={handleCloseSignIn}>
      <div style={{display: "flex", alignItems: "flex-start"}}>
        <div className={classes.gap}/>
        <img src={logo} style={{marginTop: "3%"}} className={classes.logoImg}/>
        <div className={classes.endDiv}><IconButton onClick={handleCloseSignIn}><Close/></IconButton></div>
      </div>
      <DialogContent style={{display: "flex", flexDirection: "column"}}>
      <Grid
        container
        direction="row"
        alignContent="space-between"
      >
        {props.isSignUp && (
        <TextField
        autoFocus
        id="firstName"
        label="First Name"
        style={{width: 275}}
        value={signInFields.firstName}
        onChange={handleFirstNameChange}
        error={signInFields.usernameError}
        />)}
        {props.isSignUp && (
        <TextField
        autoFocus
        id="lastName"
        label="Last Name"
        style={{width: 275}}
        value={signInFields.lastName}
        onChange={handleLastNameChange}
        error={signInFields.usernameError}
        />)}
      </Grid>
        <TextField
        autoFocus
        id="username"
        label="Username"
        value={signInFields.username}
        onChange={handleUsernameChange}
        error={signInFields.usernameError}
        />
        <div style={{marginTop: "1%"}} />
        <TextField
        id="password"
        label="Password"
        type="password"
        value={signInFields.password}
        onChange={handlePasswordChange}
        error={signInFields.passwordError}
        />
        {props.isSignUp && (
        <TextField
        autoFocus
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={signInFields.confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={signInFields.passwordError}
        />)}
      </DialogContent>

      <DialogActions disableSpacing style={{display: "flex", flexDirection: "column"}}>
        {props.isSignUp && (
        <FormControl variant="filled" size="small" fullWidth style={{maxWidth: '96%'}}>
          <InputLabel id="group">Select a Group</InputLabel>
          <Select
            variant="filled"
            id="group"
            value={group}
            onChange={handleGroupChange}
          >
            <MenuItem value="Group 1">Group 1</MenuItem>
            <MenuItem value="Group 2">Group 2</MenuItem>
            <MenuItem value="Group 3">Group 3</MenuItem>
            <MenuItem value="Group 4">Group 4</MenuItem>
            <MenuItem value="Group 5">Group 5</MenuItem>
          </Select>
        </FormControl>
        )}
        <div style={{marginTop: "1%"}} />
        <Button
          onClick={async () => {await handleUserSignIn(signInFields.username, signInFields.password, signInFields.firstName, signInFields.lastName, signInFields.confirmPassword);}}
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
  )
}

export default SignInWindow;
