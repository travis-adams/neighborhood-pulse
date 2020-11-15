import React, { FunctionComponent, useState } from 'react';
import { AppBar, Toolbar, Button, OutlinedInput, Snackbar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import UserIcon from '@material-ui/icons/PermIdentity'
import Alert from '@material-ui/lab/Alert';
import { ExpandMore, ExpandLess, Add } from '@material-ui/icons';
import useStyles from '../css';
import Filters from '../domain/Filters';
import FilterMenu from './FilterMenu';
import SignInWindow from './SignInWindow';
import Event from '../domain/Event';
import CreateEventWindow from './CreateEventWindow';

interface Props {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  unsavedFilters: Filters;
  setUnsavedFilters: (filters: Filters) => void;
  categories: string[];
  isSignedIn: boolean;
  setIsSignedIn: (bool: boolean) => void;
  setToken: (token: string) => void;
  setUsername: (username: string) => void;
  expandEvent: (event: Event) => void;
  closeEvent: () => void;
  submitEvent: (event: Event) => void;
}

const NavBar: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Sign-in
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  // Event creation
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const handleCloseToast = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsToastOpen(false);
  }

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    anchorEl ? handleCloseFilters() : setAnchorEl(event.currentTarget);
  }

  const handleCloseFilters = () => {
    setAnchorEl(null);
    props.setUnsavedFilters(props.filters);
  }

  const signOut = () => {
    // Reset sign-in info
    props.setToken("");
    props.setUsername("");
    props.setIsSignedIn(false);
    // Uncheck "Saved Events"
    props.setUnsavedFilters({ ...props.filters, saved: false });
    props.setFilters({ ...props.filters, saved: false });
    // Display confirmation toast
    setIsToastOpen(true);
  }

  // Called when the user clicks the signin/signout button on the navbar
  const handleSignInOutButton = () => {
    if (props.isSignedIn) {
     signOut();
    } else {
      // Open sign-in popup
      setIsSignUp(false);
      setIsSignInOpen(true);
    }
  }

  const openCreate = () => {
    props.closeEvent();
    setIsCreateOpen(true);
  }

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
          <FilterMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            filters={props.filters}
            setFilters={props.setFilters}
            unsavedFilters={props.unsavedFilters}
            setUnsavedFilters={props.setUnsavedFilters}
            handleCloseFilters={handleCloseFilters}
            categories={props.categories}
            isSignedIn={props.isSignedIn}
          />
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
          {props.isSignedIn &&
            <Button
              variant="contained"
              className={classes.createNavButton}
              onClick={openCreate}
              startIcon={<Add />}
            >
              Create Event
            </Button>
          }
          <CreateEventWindow
            expandEvent={props.expandEvent}
            isCreateOpen={isCreateOpen}
            setIsCreateOpen={setIsCreateOpen}
            filters={props.filters}
            categories={props.categories}
            submitEvent={props.submitEvent}
          />
          <Button
            className={classes.userButton}
            color="inherit"
            onClick={handleSignInOutButton}
            startIcon={<UserIcon/>}
          >
            {props.isSignedIn ? "Sign Out" : "Sign In"}
          </Button>
          <SignInWindow
            isSignInOpen={isSignInOpen}
            setIsSignInOpen={setIsSignInOpen}
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            setIsSignedIn={props.setIsSignedIn}
            setToken={props.setToken}
            setIsToastOpen={setIsToastOpen}
            setUsername={props.setUsername}
          />
        </div>
      </Toolbar>
      <Snackbar
        open={isToastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert onClose={handleCloseToast} severity="success">
          {props.isSignedIn ? "Signed in" : "Signed out"}
        </Alert>
      </Snackbar>
    </AppBar>
  );
}

export default NavBar;
