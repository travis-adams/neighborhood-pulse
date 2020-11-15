import 'date-fns';
import React, { FunctionComponent } from 'react';
import { Button, Menu, MenuItem, FormControl, FormControlLabel, FormGroup, Checkbox, InputLabel, Select, TextField } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useStyles from '../css';
import Filters from '../domain/Filters';

interface Props {
  anchorEl: HTMLElement;
  setAnchorEl: (element: HTMLElement) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  unsavedFilters: Filters;
  setUnsavedFilters: (filters: Filters) => void;
  handleCloseFilters: () => void;
  categories: string[];
  isSignedIn: boolean;
}

const FilterMenu: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, limit: Number(event.target.value) });
  }

  const handleFirstDateChange = (date: Date) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, firstDate: date });
  }

  const handleLastDateChange = (date: Date) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, lastDate: date });
  }

  const handleOnlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, online: event.target.checked });
  }

  const handleSavedEventsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, saved: event.target.checked });
  }

  const handleCategoriesChange = (event: React.ChangeEvent<HTMLInputElement>, value: string[]) => {
    props.setUnsavedFilters({ ...props.unsavedFilters, categories: value});
  }

  const handleApply = () => {
    props.setAnchorEl(null);
    props.setFilters(props.unsavedFilters);
  }

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
      <FormGroup className={classes.filterMenu}>
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
            <DatePicker
            clearable
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
            <DatePicker
            clearable
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
                      disabled={!(props.isSignedIn)}
                      color="primary"
                      name="saved"
                    />}
            label="Saved events only"
            labelPlacement="end"
          />
        </FormControl>
        <FormControl className={classes.filterElement}>
          <Autocomplete
            multiple
            options={props.categories}
            defaultValue={props.filters.categories}
            onChange={handleCategoriesChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Categories"
              />
            )}
          />
        </FormControl>
        <FormControl className={classes.filterElement}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
            disabled={props.unsavedFilters === props.filters}
          >
            Apply
          </Button>
        </FormControl>
      </FormGroup>
    </Menu>
  );
}

export default FilterMenu;
