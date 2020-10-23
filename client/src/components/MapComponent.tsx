import React, { FunctionComponent, useState, useCallback, memo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Button, Typography } from '@material-ui/core';
import Event from "../domain/Event";
import { defaultFilters } from './MainPage';
import useStyles from "../css"
import Filters from "../domain/Filters";

interface Props {
  events: Event[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  expandEvent: (event: Event) => void;
  closeEvent: () => void;
};

const MapComponent: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [map, setMap] = useState(null);
  const [openPin, setOpenPin] = useState<number>(null);

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

  return (
    <LoadScript
      googleMapsApiKey="API_KEY_HERE"
    >
      <GoogleMap
        id={"map"}
        mapContainerClassName={classes.mapContainer}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={() => props.closeEvent()}
        onDragStart={() => props.closeEvent()}
      >
        {props.events?.map((event: Event, index: number) => {
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
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default memo(MapComponent);
