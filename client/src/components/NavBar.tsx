import 'date-fns';
import React, { FunctionComponent, useState } from 'react';
import { AppBar, Toolbar, Button, OutlinedInput, Menu, MenuItem, FormControl,
  FormControlLabel, FormGroup, Checkbox, InputLabel, Select} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import SearchIcon from '@material-ui/icons/Search';
import UserIcon from '@material-ui/icons/PermIdentity'
import { ExpandMore, ExpandLess } from '@material-ui/icons';
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
