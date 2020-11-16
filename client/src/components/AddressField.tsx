import React, { FunctionComponent, useEffect, useState, useMemo } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import useStyles from '../css';

const autocompleteService = new google.maps.places.AutocompleteService();
const placesService = new google.maps.places.PlacesService(document.createElement('div'));

interface Props {
  online: boolean;
  variant: 'filled' | 'outlined' | 'standard';
  label?: string;
  placeholder?: string;
  value: google.maps.places.AutocompletePrediction | null;
  setValue: (value: google.maps.places.AutocompletePrediction | null) => void;
  setAddressLatLng: (valuePos: google.maps.LatLng | null) => void;
  setAddressString?: (address: string) => void;
}

const AddressField: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  // Get google's predictions for the address input value
  const fetchPredictions = useMemo(
    () =>
      throttle((request: { input: string }, callback: (result: google.maps.places.AutocompletePrediction[]) => void) => {
        autocompleteService.getPlacePredictions(request, callback);
      }, 200),
    [],
  );

  // Get the lat & long and full address of an address result
  const fetchValuePos = useMemo(
    () =>
      throttle((place_id: string, callback: (result: google.maps.places.PlaceResult) => void) => {
        placesService.getDetails({placeId: place_id, fields: ["geometry.location", "formatted_address"]}, callback);
      }, 200),
    [],
  );

  useEffect(() => {
    let active = true;
    if (!autocompleteService || !placesService) {
      return undefined;
    }
    if (inputValue === '') {
      setOptions(props.value ? [props.value] : []);
      return undefined;
    }
    if (props.value) {
      fetchValuePos(props.value.place_id, (result?: google.maps.places.PlaceResult) => {
        if (active && result) {
          props.setAddressLatLng(result.geometry.location);
          if (props.setAddressString) {
            props.setAddressString(result.formatted_address);
          }
        }
      });
    }
    fetchPredictions({ input: inputValue }, (results?: google.maps.places.AutocompletePrediction[]) => {
      if (active) {
        let newOptions = [] as google.maps.places.AutocompletePrediction[];
        if (props.value) {
          newOptions = [props.value];
        }
        if (results) {
          newOptions = [...newOptions, ...results];
        }
        setOptions(newOptions);
      }
    });
    return () => {
      active = false;
    };
  }, [props.value, inputValue, fetchPredictions]);

  useEffect(() => {
    if (props.online) {
      props.setValue(null);
      props.setAddressLatLng(null);
      if (props.setAddressString) {
        props.setAddressString(null);
      }
      setInputValue('');
      setOptions([]);
    }
  }, [props.online]);

  return (
    <Autocomplete
      fullWidth
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      noOptionsText={"No results"}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={props.value}
      disabled={props.online}
      onChange={(event: React.ChangeEvent<{}>, newValue: google.maps.places.AutocompletePrediction | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        props.setValue(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          required={!props.online}
          label={props.online ? "Online" : props.label}
          variant={props.variant}
          placeholder={props.placeholder}
          fullWidth />
      )}
      renderOption={(option) => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: google.maps.places.PredictionSubstring) => [match.offset, match.offset + match.length]),
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOnIcon className={classes.addressPinIcon} />
            </Grid>
            <Grid item xs>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default AddressField;
