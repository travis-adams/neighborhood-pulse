import React, { FunctionComponent, useState } from 'react';
import { AppBar, Toolbar, Button, OutlinedInput, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@material-ui/core';
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
  signedIn: boolean;
  setSignedIn: (bool: boolean) => void;
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
  const [signInOpen, setSignInOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  // Event creation
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

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
    props.setSignedIn(false);
    // Uncheck "Saved Events"
    props.setUnsavedFilters({ ...props.filters, saved: false });
    props.setFilters({ ...props.filters, saved: false });
    // Display confirmation toast
    setIsToastOpen(true);
  }

  // Called when the user clicks the signin/signout button on the navbar
  const handleSignInOutButton = () => {
    if (props.signedIn) {
     signOut();
    } else {
      // Open sign-in popup
      setIsSignUp(false);
      setSignInOpen(true);
    }
  }

  const openCreate = () => {
    props.closeEvent();
    setIsCreateOpen(true);
  }

  const closeCreate = () => {
    // dirty-ness is broken right now
    // if (dirty) {
    //   setUnsavedDialogOpen(true);
    // } else {
    //   setIsCreateOpen(false);
    // }
    setIsCreateOpen(false);
  }

  const handleDiscard = () => {
    setUnsavedDialogOpen(false);
    setIsCreateOpen(false);
  }

  const handleCancel = () => {
    setUnsavedDialogOpen(false);
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
            signedIn={props.signedIn}
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
          {props.signedIn &&
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
            closeCreate={closeCreate}
            filters={props.filters}
            dirty={dirty}
            setDirty={setDirty}
            categories={props.categories}
            submitEvent={props.submitEvent}
          />
          <Button
            className={classes.userButton}
            color="inherit"
            onClick={handleSignInOutButton}
            startIcon={<UserIcon/>}
          >
            {props.signedIn ? "Sign Out" : "Sign In"}
          </Button>
          <SignInWindow
            signInOpen={signInOpen}
            setSignInOpen={setSignInOpen}
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            setSignedIn={props.setSignedIn}
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
          {props.signedIn ? "Signed in" : "Signed out"}
        </Alert>
      </Snackbar>
      <Dialog
        open={unsavedDialogOpen}
        onClose={handleCancel}
      >
        <DialogTitle>{"Unsaved changes"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes. Do you want to discard them?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDiscard} color="primary" autoFocus>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default NavBar;
