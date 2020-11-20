import React, { FunctionComponent, useState } from 'react';
import { Button, TextField, Dialog, DialogContent, DialogActions, IconButton, Snackbar,
  Grid, Select, InputLabel, MenuItem, FormControl } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { Close } from '@material-ui/icons';
import EventService from "../service/EventService";
import useStyles from '../css';
import User from '../domain/User';
import Group from '../domain/Group';

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
  groups: Group[]
}

const eventService = new EventService();

const SignInWindow: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  // fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [group, setGroup] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  // validation
  const [firstNameValid, setFirstNameValid] = useState<boolean>(true);
  const [lastNameValid, setLastNameValid] = useState<boolean>(true);
  const [groupValid, setGroupValid] = useState<boolean>(true);
  const [usernameValid, setUsernameValid] = useState<boolean>(true);
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCloseToast = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setIsToastOpen(false);
  }

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
    setFirstNameValid(true);
  }

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
    setLastNameValid(true);
  }

  const handleGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroup(event.target.value);
    setGroupValid(true);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setUsernameValid(true);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordValid(true);
  }

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordValid(true);
  }

  const resetFields = () => {
    // fields
    setFirstName("");
    setLastName("");
    setGroup("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    // validation
    setFirstNameValid(true);
    setLastNameValid(true);
    setGroupValid(true);
    setUsernameValid(true);
    setPasswordValid(true);
    setConfirmPasswordValid(true);
    setErrorMessage("");
 }

 const handleCloseSignIn = () => {
   props.setIsSignInOpen(false);
   resetFields();
 }

  // Handles signing the user in/up
  const handleUserSignIn = async () => {
    try {
      let fieldsMissing = false;
      if (username == null || username == "") {
        fieldsMissing = true;
        setUsernameValid(false);
      }
      if (password == null || password == "") {
        fieldsMissing = true;
        setPasswordValid(false);
      }
      if (props.isSignUp) {
        if (firstName == null || firstName == "") {
          fieldsMissing = true;
          setFirstNameValid(false);
        }
        if (lastName == null || lastName == "") {
          fieldsMissing = true;
          setLastNameValid(false);
        }
        if (group == null || group == "") {
          console.log(group);
          fieldsMissing = true;
          setGroupValid(false);
        }
        if (confirmPassword == null || confirmPassword == "") {
          fieldsMissing = true;
          setConfirmPasswordValid(false);
        }
        if (fieldsMissing) {
          throw new Error("Please complete all fields.");
        }
        if (password != confirmPassword) {
          setPasswordValid(false);
          setConfirmPasswordValid(false);
          throw new Error("Passwords do not match.")
        }
        await eventService.userSignUp(username, password, firstName, lastName, parseInt(group));
      } else if (fieldsMissing) {
        throw new Error("Username and password required.")
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
      setErrorMessage(error.message);
    }
  }

  // Toggles between the sign-in and sign-up screens
  const handleToggleSignUp = () => {
    props.setIsSignUp(!props.isSignUp);
    resetFields();
  }

  return (
    <div>
      <Dialog open={props.isSignInOpen} onClose={handleCloseSignIn}>
        <div style={{display: "flex", alignItems: "flex-start"}}>
          <div className={classes.gap}/>
          <img src={logo} style={{marginTop: "3%"}} className={classes.logoImg}/>
          <div className={classes.endDiv}>
            <IconButton onClick={handleCloseSignIn}>
              <Close/>
            </IconButton>
          </div>
        </div>
        <DialogContent style={{display: "flex", flexDirection: "column"}}>
          {props.isSignUp && (
            <div>
              <Grid
                container
                direction="row"
              >
                <TextField
                  autoFocus
                  id="firstName"
                  label="First Name"
                  style={{width: 275}}
                  value={firstName}
                  onChange={handleFirstNameChange}
                  error={!firstNameValid}
                />
                <TextField
                  id="lastName"
                  label="Last Name"
                  style={{width: 275}}
                  value={lastName}
                  onChange={handleLastNameChange}
                  error={!lastNameValid}
                />
              </Grid>
              <div style={{marginTop: "1%"}} />
              <FormControl fullWidth error={!groupValid} >
                <InputLabel id="group">Group</InputLabel>
                <Select
                  id="group"
                  value={group}
                  onChange={handleGroupChange}
                >
                  {props.groups.map((group: Group, index: number) => <MenuItem key={index} value={group.id.toString()}>{group.name}</MenuItem>)}
                </Select>
              </FormControl>
              <div style={{marginTop: "1%"}} />
            </div>
          )}
          <TextField
            autoFocus={!props.isSignUp}
            id="username"
            label="Username"
            value={username}
            onChange={handleUsernameChange}
            error={!usernameValid}
          />
          <div style={{marginTop: "1%"}} />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            error={!passwordValid}
          />
          {props.isSignUp && <div style={{marginTop: "1%"}} />}
          {props.isSignUp && (
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!confirmPasswordValid}
            />
          )}
        </DialogContent>
        <DialogActions disableSpacing style={{display: "flex", flexDirection: "column"}}>
          <Button
            onClick={handleUserSignIn}
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
