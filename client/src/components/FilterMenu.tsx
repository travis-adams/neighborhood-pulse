import 'date-fns';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { Button, Menu, MenuItem, FormControl, FormControlLabel, FormGroup, Checkbox, InputLabel, Select, Chip, Grid, Typography, Input } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import useStyles from '../css';
import Filters from '../domain/Filters';
import EventService from "../service/EventService";

interface Props {
  anchorEl: HTMLElement;
  setAnchorEl: (element: HTMLElement) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  unsavedFilters: Filters;
  setUnsavedFilters: (filters: Filters) => void;
  handleCloseFilters: () => void;
  signedIn: boolean;
};

const FilterMenu: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, limit: Number(event.target.value) });
  };

  const handleFirstDateChange = (date: any) => {
    var strDate: string = date.toISOString().split('T')[0];
    props.setUnsavedFilters({ ...props.unsavedFilters, firstDate: strDate });
  }

  const handleLastDateChange = (date: any) => {
    var strDate: string = date.toISOString().split('T')[0];
    props.setUnsavedFilters({ ...props.unsavedFilters, lastDate: strDate });
  }

  const handleOnlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, online: event.target.checked });
  };

  const handleSavedEventsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, saved: event.target.checked });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategories(event.target.value);
    props.setUnsavedFilters({ ...props.unsavedFilters, categories: cats});
    console.log(cats)
  };

  const eventService = new EventService();

  const [stored_cats, storeCategories] = useState<string[]>([]);
  const [cats, setCategories] = useState<string[]>([]);

  const loadCategories = async () => {
    var categoryList = await eventService.fetchCategories().then((fetchedCategories: string[]) => {
      return fetchedCategories;
    });
    storeCategories(categoryList.slice(1, 18));
  }

  loadCategories();

  const handleApply = () => {
    props.setAnchorEl(null);
    props.setFilters(props.unsavedFilters);
  };

  return (
    <Menu
      anchorEl={props.anchorEl}
      open={Boolean(props.anchorEl)}
      onClose={props.handleCloseFilters}
      anchorReference="anchorPosition"
      // anchorPosition and transformOrigin handle the position of the filter menu dropdown
      anchorPosition={{
        top: (props.anchorEl?.getBoundingClientRect().bottom === undefined) ? 0 : props.anchorEl?.getBoundingClientRect().bottom,
        left: (props.anchorEl?.getBoundingClientRect().left + props.anchorEl?.getBoundingClientRect().right)/2
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
            value={props.unsavedFilters.limit.toString()}
            onChange={handleLimitChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={75}>75</MenuItem>
              <MenuItem value={100}>100</MenuItem>
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
              value={props.unsavedFilters.firstDate}
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
              value={props.unsavedFilters.lastDate}
              onChange={handleLastDateChange}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
          <FormControl className={classes.filterElement}>
            <FormControlLabel
              control={<Checkbox
                        checked={props.unsavedFilters.online}
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
                        checked={props.unsavedFilters.saved}
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
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              onChange={handleChange}
              value={cats}
              renderValue={(selected) => (
                <div className={classes.categoryFilter}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} className={classes.categories} />
                  ))}
                </div>
              )}
            >
              {stored_cats.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.filterElement}>
            <Button variant="contained" color="primary" onClick={handleApply}>Apply</Button>
          </FormControl>
        </FormGroup>
      </div>
    </Menu>
  );
};

export default FilterMenu;
