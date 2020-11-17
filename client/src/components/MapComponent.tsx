import React, { FunctionComponent, useState, useEffect, useCallback, Key, memo } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Button, Typography, Link } from '@material-ui/core';
import Event from "../domain/Event";
import { defaultFilters } from './MainPage';
import useStyles from "../css"
import Filters from "../domain/Filters";
import PointOfInterest from "../domain/PointOfInterest";

interface Props {
  events: Event[];
  filters: Filters;
  unsavedFilters: Filters;
  setUnsavedFilters: (filters: Filters) => void;
  setFilters: (filters: Filters) => void;
  expandEvent: (event: Event) => void;
  closeEvent: () => void;
  pois: PointOfInterest[];
}

const MapComponent: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [map, setMap] = useState<google.maps.Map>(null);
  const [openPin, setOpenPin] = useState<Key>(null);
  const [allPins, setAllPins] = useState<JSX.Element[]>([]);

  const onLoad = useCallback(function callback(map) {
    // Center map at user location if possible; default position is Atlanta
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const pos = new google.maps.LatLng({lat: position.coords.latitude, lng: position.coords.longitude});
          props.setFilters({ ...props.filters, searchPos: pos });
          props.setUnsavedFilters({ ...props.filters, searchPos: pos });
          map.setCenter(pos);
        },
        () => {
          // Error with geolocation
          map.setCenter(defaultFilters.searchPos);
        }
      );
    } else {
      // Browser doesn't support geolocation OR user denied request
      map.setCenter(defaultFilters.searchPos);
    }
    setMap(map);
  }, []);
 
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const createEventPins = () => {
    const eventMarkers: JSX.Element[] = (
      props.events?.map((event: Event, index: number) => {
        if (event.position) {
          return (
            <Marker
              key={index}
              position={event.position}
              onClick={() => {setOpenPin(index); props.closeEvent();}}
            >
              {openPin === index &&
                <InfoWindow
                  key={index}
                  position={event.position}
                  onCloseClick={() => {setOpenPin(null); props.closeEvent();}}
                >
                  <div style={{marginTop: 5}}>
                    <Typography variant="subtitle2" component="p">
                      {event.name}
                    </Typography>
                    <div style={{marginTop: 5}}/>
                    <Typography variant="caption" component="p">
                      {event?.desc}
                    </Typography>
                    <Button
                      style={{marginLeft: -4}}
                      color="primary"
                      size="small"
                      onClick={() => {props.expandEvent(event);}}
                    >
                      More details
                    </Button>
                  </div>
                </InfoWindow>
              }
            </Marker>
          )
        }
      })
    );
    const poiMarkers: JSX.Element[] = (
      props.pois?.map((poi: PointOfInterest, index: number) => {
        const poiIndex: string = index.toString() + "poi";
        return (
          <Marker
            icon={{
              url: 'http://maps.google.com/mapfiles/kml/paddle/grn-stars.png',
              scaledSize: new google.maps.Size(40, 40)
            }}
            key={poiIndex}
            position={poi.position}
            onClick={() => {setOpenPin(poiIndex); props.closeEvent();}}
          >
            {openPin === poiIndex &&
              <InfoWindow
                key={poiIndex}
                position={poi.position}
                onCloseClick={() => {setOpenPin(null); props.closeEvent();}}
              >
                <div style={{marginTop: 5}}>
                  <Typography variant="subtitle2" component="p">
                    {poi.name}
                  </Typography>
                  <div style={{marginTop: 5}}/>
                  <Typography variant="caption" component="p">
                    {poi?.desc}
                  </Typography>
                  <Typography variant="caption" component="p">
                    <Link target="_blank" rel="noopener noreferrer" href={poi.link}>
                      {poi.link}
                    </Link>
                  </Typography>
                </div>
              </InfoWindow>
            }
          </Marker>
        )
      })
    );
    if (props.events && props.pois) {
      setAllPins(eventMarkers.concat(poiMarkers));
    } else if (props.events) {
      setAllPins(eventMarkers);
    } else if (props.pois) {
      setAllPins(poiMarkers);
    } else {
      setAllPins([]);
    }
  }

  // If the events, points of interest, or opened pin changes, rerender the pins
  useEffect(() => {
    createEventPins();
  }, [props.events, props.pois, openPin]);

  // If the search position changes, move the map's center
  useEffect(() => {
    if (map) {
      map.panTo(props.filters.searchPos);
    }
  }, [props.filters.searchPos]);

  return (
    <div>
      {props.filters.online && <div className={classes.mapGrayCover} />}
      <GoogleMap
        id={"map"}
        mapContainerClassName={props.filters.online ? classes.mapContainerOnline : classes.mapContainer}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={() => props.closeEvent()}
      >
        {!props.filters.online && allPins}
      </GoogleMap>
    </div>
  );
}

export default memo(MapComponent);
