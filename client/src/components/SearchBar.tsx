import React, { FunctionComponent, useState } from 'react';
import useStyles from '../css';
import AddressField from './AddressField';
import { Search } from '@material-ui/icons';
import Filters from '../domain/Filters';

interface Props {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  setUnsavedFilters: (filters: Filters) => void;
}

const SearchBar: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState<google.maps.places.AutocompletePrediction | null>(null);

  // Changes the app's search position (the change to 'filters' is detected in MapComponent.tsx and MainPage.tsx to update the map and events, respectively)
  const setNewSearchPosition = (pos: google.maps.LatLng) => {
    if (pos) {
      props.setUnsavedFilters({...props.filters, searchPos: pos});
      props.setFilters({...props.filters, searchPos: pos});
    }
  }

  return (
    <div className={classes.search}>
      <Search className={classes.searchIcon} />
      <div className={classes.searchInput}>
        <AddressField
          online={props.filters.online}
          variant="outlined"
          placeholder="Search for a location"
          value={searchValue}
          setValue={setSearchValue}
          setAddressLatLng={setNewSearchPosition}
        />
      </div>
    </div>
  );
}

export default SearchBar;