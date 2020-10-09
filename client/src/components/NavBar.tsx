import 'date-fns';
import React, { FunctionComponent, useState } from 'react';
import { AppBar, Toolbar, Button, OutlinedInput, TextField, Menu, MenuItem, 
  FormControl, FormControlLabel, FormGroup, Checkbox, InputLabel, Select,
  Dialog, DialogContent, DialogActions, IconButton } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import SearchIcon from '@material-ui/icons/Search';
import UserIcon from '@material-ui/icons/PermIdentity'
import { ExpandMore, ExpandLess, Close } from '@material-ui/icons';
import useStyles from '../css';
import Filters from '../domain/Filters';
import EventService from "../service/EventService";
import Alert from '@material-ui/lab/Alert';

interface Props {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  signedIn: boolean;
  setSignedIn: (bool: boolean) => void;
  setToken: (token: string) => void;
  setToastOpen: (bool: boolean) => void;
  setUsername: (username: string) => void;
};

interface LogInFields {
  username: string;
  password: string;
  usernameError: boolean;
  passwordError: boolean;
}

const eventService = new EventService();

const NavBar: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unsavedFilters, setUnsavedFilters] = useState<Filters>(props.filters);
  const [signInOpen, setSignInOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [logInFields, setLogInFields] = useState<LogInFields>({username: "", password: "", usernameError: false, passwordError: false});

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnsavedFilters({ ...unsavedFilters, limit: Number(event.target.value) });
  };

  const handleFirstDateChange = (date: any) => {
    var strDate: string = date.toISOString().split('T')[0];
    setUnsavedFilters({ ...unsavedFilters, firstDate: strDate });
  }

  const handleLastDateChange = (date: any) => {
    var strDate: string = date.toISOString().split('T')[0];
    setUnsavedFilters({ ...unsavedFilters, lastDate: strDate });
  }

  const handleOnlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnsavedFilters({ ...unsavedFilters, online: event.target.checked });
  };

  const handleSavedEventsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnsavedFilters({ ...unsavedFilters, saved: event.target.checked });
  };

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    anchorEl ? handleCloseFilters() : setAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setAnchorEl(null);
    setUnsavedFilters(props.filters);
  };

  const handleApply = () => {
    setAnchorEl(null);
    props.setFilters(unsavedFilters);
  };

  const resetSignInFields = () => {
    setLogInFields({ username: "", password: "", usernameError: false, passwordError: false });
  }

  // Called when the user clicks the signin/signout button on the navbar
  const handleSignInButton = () => {
    if (props.signedIn) {
      // Sign out
      props.setToken("");
      props.setUsername("");
      props.setSignedIn(false);
      // Display confirmation toast
      props.setToastOpen(true);
    } else {
      // Open sign-in popup
      setIsSignUp(false);
      setSignInOpen(true);
    }
  };

  const handleCloseSignIn = () => {
    setSignInOpen(false);
    resetSignInFields();
  };

  const handleSwapToSignUp = () => {
    setIsSignUp(true);
    setErrorMessage("");
    resetSignInFields();
  };

  // Handles signing the user in
  const handleUserSignIn = async (username: string, password: string) => {
    try {
      if (username.length == 0 || password.length == 0) {
        throw new Error("Username and password required.")
      }
      if (isSignUp) {
        await eventService.userSignUp(username, password);
      }
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

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogInFields({ ...logInFields, username: event.target.value, usernameError: false});
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogInFields({ ...logInFields, password: event.target.value, passwordError: false});
  };

  return (
    <AppBar position="static" className={classes.navBar}>
      <Toolbar>
        <div className={classes.logoDiv}>
          <img src={logo} className={classes.logoImg}/>
        </div>
        <div className={classes.filterAndSearch}>
          <Button
           className={classes.filterButton}
           color="inherit"
           onClick={handleOpenFilters}
           endIcon={anchorEl ? <ExpandLess/> : <ExpandMore/>}
          >
              Filter Results
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseFilters}
            anchorReference="anchorPosition"
            // anchorPosition and transformOrigin handle the position of the filter menu dropdown
            anchorPosition={{
              top: anchorEl?.getBoundingClientRect().bottom,
              left: (anchorEl?.getBoundingClientRect().left + anchorEl?.getBoundingClientRect().right)/2
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <div>
              <FormGroup>
                <FormControl className={classes.filterElement}>
                  <InputLabel id="limit">Number of Results</InputLabel>
                  <Select
                  labelId="limit"
                  name="limit"
                  value={unsavedFilters.limit}
                  onChange={handleLimitChange}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={75}>75</MenuItem>
                  </Select>
                </FormControl>
                <FormControl className={classes.filterElement}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy-MM-dd"
                    id="firstDate"
                    label="Begin Date"
                    value={unsavedFilters.firstDate}
                    onChange={handleFirstDateChange}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl className={classes.filterElement}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="yyyy-MM-dd"
                    id="lastDate"
                    label="End Date"
                    value={unsavedFilters.lastDate}
                    onChange={handleLastDateChange}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl className={classes.filterElement}>
                  <FormControlLabel
                    control={<Checkbox
                              checked={unsavedFilters.online}
                              onChange={handleOnlineChange}
                              color="primary"
                              name="online"
                            />}
                    label="Online only"
                    labelPlacement="end"
                  />
                </FormControl>
                <FormControl className={classes.filterElement}>
                  <FormControlLabel
                    control={<Checkbox
                              checked={unsavedFilters.saved}
                              onChange={handleSavedEventsChange}
                              disabled={!(props.signedIn)}
                              color="primary"
                              name="saved"
                            />}
                    label="Saved Events"
                    labelPlacement="end"
                  />
                </FormControl>
                <FormControl className={classes.filterElement}>
                  <Button variant="contained" color="primary" onClick={handleApply}>Apply</Button>
                </FormControl>
              </FormGroup>
            </div>
          </Menu>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon/>
            </div>
            <OutlinedInput
              placeholder="Search for a location or an event..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
            />
          </div>
        </div>
        <div className={classes.endDiv}>
          <Button
          className={classes.userButton}
          color="inherit"
          onClick={handleSignInButton}
          endIcon={<UserIcon/>}
          >
            {props.signedIn ? "Sign Out" : "Sign In"}
          </Button>
          <Dialog open={signInOpen} onClose={handleCloseSignIn}>
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
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
              <div style={{marginTop: 8}}/>
              {!isSignUp &&
                <Button onClick={handleSwapToSignUp} color="primary" size="small">
                  Create an account
                </Button>
              }
            </DialogActions>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          </Dialog>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
