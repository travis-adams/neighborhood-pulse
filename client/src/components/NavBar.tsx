import React, { FunctionComponent, useState } from 'react';
import { AppBar, Toolbar, Button, OutlinedInput } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import UserIcon from '@material-ui/icons/PermIdentity'
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import useStyles from '../css';
import Filters from '../domain/Filters';
import FilterMenu from './FilterMenu';
import SignInWindow from './SignInWindow';

interface Props {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  signedIn: boolean;
  setSignedIn: (bool: boolean) => void;
  setToken: (token: string) => void;
  setToastOpen: (bool: boolean) => void;
  setUsername: (username: string) => void;
};

const NavBar: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [signInOpen, setSignInOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [unsavedFilters, setUnsavedFilters] = useState<Filters>(props.filters);

  const handleOpenFilters = (event: React.MouseEvent<HTMLButtonElement>) => {
    anchorEl ? handleCloseFilters() : setAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setAnchorEl(null);
    setUnsavedFilters(props.filters);
  };

  const signOut = () => {
    // Reset sign-in info
    props.setToken("");
    props.setUsername("");
    props.setSignedIn(false);
    // Uncheck "Saved Events"
    setUnsavedFilters({ ...unsavedFilters, saved: false });
    props.setFilters({ ...unsavedFilters, saved: false });
    // Display confirmation toast
    props.setToastOpen(true);
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
          <FilterMenu
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            filters={props.filters}
            setFilters={props.setFilters}
            unsavedFilters={unsavedFilters}
            setUnsavedFilters={setUnsavedFilters}
            handleCloseFilters={handleCloseFilters}
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
          <Button
          className={classes.userButton}
          color="inherit"
          onClick={handleSignInOutButton}
          endIcon={<UserIcon/>}
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
            setToastOpen={props.setToastOpen}
            setUsername={props.setUsername}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
