import React, { FunctionComponent, useState } from 'react';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { ExpandMore, ExpandLess, Add, PermIdentity } from '@material-ui/icons';
import useStyles from '../css';
import Filters from '../domain/Filters';
import FilterMenu from './FilterMenu';
import SignInWindow from './SignInWindow';
import Event from '../domain/Event';
import CreateEventWindow from './CreateEventWindow';
import SearchBar from './SearchBar';

interface Props {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  unsavedFilters: Filters;
  setUnsavedFilters: (filters: Filters) => void;
  categories: string[];
  isSignedIn: boolean;
  setIsSignedIn: (bool: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  username: string;
  setUsername: (username: string) => void;
  expandEvent: (event: Event) => void;
  closeEvent: () => void;
}

const NavBar: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Sign-in
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isSignInToastOpen, setIsSignInToastOpen] = useState<boolean>(false);
  // Event creation
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

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
    setIsSignInToastOpen(true);
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
          <SearchBar
            filters={props.filters}
            setFilters={props.setFilters}
            setUnsavedFilters={props.setUnsavedFilters}
          />
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
            token={props.token}
            username={props.username}
          />
          <Button
            className={classes.userButton}
            color="inherit"
            onClick={handleSignInOutButton}
            startIcon={<PermIdentity/>}
          >
            {props.isSignedIn ? "Sign Out" : "Sign In"}
          </Button>
          <SignInWindow
            isSignedIn={props.isSignedIn}
            isSignInOpen={isSignInOpen}
            setIsSignInOpen={setIsSignInOpen}
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            setIsSignedIn={props.setIsSignedIn}
            setToken={props.setToken}
            isToastOpen={isSignInToastOpen}
            setIsToastOpen={setIsSignInToastOpen}
            setUsername={props.setUsername}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
