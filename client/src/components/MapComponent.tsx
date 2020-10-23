import React, { FunctionComponent, useState, useEffect, useCallback, Key, memo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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
};

const MapComponent: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [map, setMap] = useState(null);
  const [openPin, setOpenPin] = useState<Key>(null);
  const [allPins, setAllPins] = useState<JSX.Element[]>([]);

  const onLoad = useCallback(function callback(map) {
    // Center map at user location if possible; default position is Atlanta
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          props.setFilters({ ...props.filters, userPos: pos });
          props.setUnsavedFilters({ ...props.filters, userPos: pos });
          map.setCenter(pos);
        },
        () => {
          // Error with geolocation
          map.setCenter(defaultFilters.userPos);
        }
      );
    } else {
      // Browser doesn't support geolocation OR user denied request
      map.setCenter(defaultFilters.userPos);
    }
    setMap(map);
  }, []);
 
  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const createEventPins = () => {
    var eventMarkers: JSX.Element[] = (
      props.events?.map((event: Event, index: number) => {
        if (event.position.lat && event.position.lng) {
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
    var poiMarkers: JSX.Element[] = (
      props.pois?.map((poi: PointOfInterest, index: number) => {
        var poiIndex: string = index.toString() + "poi";
        return (
          <Marker
            icon={{
              url: 'http://maps.google.com/mapfiles/kml/paddle/blu-stars.png',
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
  };

  useEffect(() => {
    createEventPins();
  }, [props.events, props.pois, openPin]);

  return (
    <LoadScript googleMapsApiKey="API_KEY_HERE">
      <GoogleMap
        id={"map"}
        mapContainerClassName={classes.mapContainer}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={() => props.closeEvent()}
        onDragStart={() => props.closeEvent()}
      >
        {allPins}
      </GoogleMap>
    </LoadScript>
  );
};

export default memo(MapComponent);
