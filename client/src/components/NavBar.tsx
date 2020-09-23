import React, { FC } from 'react';
import { AppBar, Toolbar, Button, IconButton, OutlinedInput } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import UserIcon from '@material-ui/icons/PermIdentity'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useStyles from '../css';

const NavBar: FC = () => {
  const classes = useStyles();
  const logo = "c1-logo-full.png";

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
           onClick={null} // to-do
           endIcon={<ExpandMoreIcon/>}
          >
              Filter Results
          </Button>
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
        <div className={classes.userDiv}>
          <Button
          className={classes.userButton}
          color="inherit"
          onClick={null} // to-do
          endIcon={<UserIcon/>}
          >
            Sign In
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
