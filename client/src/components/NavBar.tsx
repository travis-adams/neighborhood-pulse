import 'date-fns';
import React, { FunctionComponent, useState } from 'react';
import { AppBar, Toolbar, Button, OutlinedInput, Menu,
  MenuItem, FormControlLabel, Checkbox, InputLabel, Select } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import SearchIcon from '@material-ui/icons/Search';
import UserIcon from '@material-ui/icons/PermIdentity'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useStyles from '../css';
import Filters from '../domain/Filters';

interface Props {
  filters: Filters;
  setFilters: (filters: Filters) => void;
};

const NavBar: FunctionComponent<Props> = (props: Props) => {
  const logo = "c1-logo-full.png";
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unsavedFilters, setUnsavedFilters] = useState<Filters>(props.filters);

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUnsavedFilters(props.filters);
  };

  const handleApply = () => {
    setAnchorEl(null);
    props.setFilters(unsavedFilters);
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
           onClick={handleClick}
           endIcon={<ExpandMoreIcon/>}
          >
              Filter Results
          </Button>
          <Menu
           anchorEl={anchorEl}
           open={Boolean(anchorEl)}
           onClose={handleClose}
          >
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="firstDate"
                label="Begin Date"
                value={unsavedFilters.firstDate}
                onChange={handleFirstDateChange}
                />
                <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="lastDate"
                label="End Date"
                value={unsavedFilters.lastDate}
                onChange={handleLastDateChange}
                />
              </MuiPickersUtilsProvider>
              <FormControlLabel
                value="start"
                control={<Checkbox
                          checked={unsavedFilters.online}
                          onChange={handleOnlineChange}
                          color="primary"
                          name="online"
                        />}
                label="Online only"
                labelPlacement="start"
              />
              <Button variant="contained" color="primary" onClick={handleApply}>Apply</Button>
            </div>
          </Menu>
          {/* when this^ button actually works, call props.setFilters(...) when saving the new filter selections */}
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
