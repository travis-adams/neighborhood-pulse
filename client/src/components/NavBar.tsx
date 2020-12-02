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
import TabOption from "../domain/TabOption";
import User from "../domain/User";
import Group from "../domain/Group";
import UserMenu from "./UserMenu";
import UserInfoWindow from "./UserInfoWindow";

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
  user: User;
  setUser: (newUser: User) => void;
  expandEvent: (event: Event) => void;
  closeEvent: () => void;
  tab: TabOption
  setTab: (newTab: TabOption) => void;
  groups: Group[];
}

const NavBar: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  // menu anchors
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  // Sign-in
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isSignInToastOpen, setIsSignInToastOpen] = useState<boolean>(false);
  // User info
  const [isUserInfoOpen, setIsUserInfoOpen] = useState<boolean>(false);
  // Event creation
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);

  const openFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    filterAnchorEl ? closeFilterMenu() : setFilterAnchorEl(event.currentTarget);
  }

  const closeFilterMenu = () => {
    setFilterAnchorEl(null);
    props.setUnsavedFilters(props.filters);
  }

  const openUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    userAnchorEl ? closeUserMenu() : setUserAnchorEl(event.currentTarget);
  }

  const closeUserMenu = () => {
    setUserAnchorEl(null);
  }

  const signOut = () => {
    // Reset sign-in info
    props.setToken("");
    props.setUser(null);
    props.setIsSignedIn(false);
    // Move to the Nearby Events tab
    props.setTab(TabOption.NearbyEvents);
    closeUserMenu();
    // Display confirmation toast
    setIsSignInToastOpen(true);
  }

  // Called when the user clicks the signin/signout button on the navbar
  const handleUserButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.isSignedIn) {
      openUserMenu(event);
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

  const openUserInfo = () => {
    setIsUserInfoOpen(true);
  }

  return (
    <AppBar position="static" className={classes.navBar}>
      <Toolbar>
        <div className={classes.beginDiv}>
          <img src={logo} className={classes.navLogoImg}/>
          {props.tab == TabOption.NearbyEvents &&
              <Button
                className={classes.filterButton}
                color="inherit"
                // variant="contained"
                onClick={openFilterMenu}
                endIcon={filterAnchorEl ? <ExpandLess/> : <ExpandMore/>}
              >
                  Filter Results
              </Button>
          }
          <FilterMenu
            anchorEl={filterAnchorEl}
            setAnchorEl={setFilterAnchorEl}
            filters={props.filters}
            setFilters={props.setFilters}
            unsavedFilters={props.unsavedFilters}
            setUnsavedFilters={props.setUnsavedFilters}
            close={closeFilterMenu}
            categories={props.categories}
            isSignedIn={props.isSignedIn}
          />
        </div>
        <div className={classes.middleDiv}>
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
            open={isCreateOpen}
            setOpen={setIsCreateOpen}
            filters={props.filters}
            categories={props.categories}
            token={props.token}
            username={props.user ? props.user.username : ""}
            setTab={props.setTab}
          />
          <Button
            className={classes.userButton}
            color="inherit"
            onClick={handleUserButton}
            startIcon={<PermIdentity/>}
          >
            {(props.isSignedIn && props.user) ? props.user.username : "Sign In"}
          </Button>
          <SignInWindow
            isSignedIn={props.isSignedIn}
            open={isSignInOpen}
            setOpen={setIsSignInOpen}
            isSignUp={isSignUp}
            setIsSignUp={setIsSignUp}
            setIsSignedIn={props.setIsSignedIn}
            setToken={props.setToken}
            isToastOpen={isSignInToastOpen}
            setIsToastOpen={setIsSignInToastOpen}
            setUser={props.setUser}
            groups={props.groups}
          />
          <UserInfoWindow
            open={isUserInfoOpen}
            setOpen={setIsUserInfoOpen}
            user={props.user}
            setUser={props.setUser}
            groups={props.groups}
            token={props.token}
          />
          <UserMenu
            anchorEl={userAnchorEl}
            setAnchorEl={setUserAnchorEl}
            close={closeUserMenu}
            signOut={signOut}
            openUserInfo={openUserInfo}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
