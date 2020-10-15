import React, { FunctionComponent, useState, useCallback, memo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from '@material-ui/core';
import Event from "../domain/Event";
import { defaultFilters } from './MainPage';
import useStyles from "../css"

interface Props {
  events: Event[];
};

const MapComponent: FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();
  const [map, setMap] = useState(null);
  const [markerInfoOpenMap, setMarkerInfoOpenMap] = useState(new Map<number, boolean>());

  const toggleMarkerInfoOpen = (markerIndex: number, bool: boolean): void => {
    const newMap: Map<number, boolean> = new Map(markerInfoOpenMap).set(markerIndex, bool);
    setMarkerInfoOpenMap(newMap);
  };

  const onLoad = useCallback(function callback(map) {
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
        center={defaultFilters.userPos}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {props.events?.map((event: Event, index: number) => {
          if (event.position.lat && event.position.lng) {
            return (
              <Marker
                key={index}
                position={event.position}
                onClick={() => {toggleMarkerInfoOpen(index, true)}}
              >
                {markerInfoOpenMap.get(index) &&
                <InfoWindow
                  key={index}
                  position={event.position}
                  onCloseClick={() => {toggleMarkerInfoOpen(index, false)}}
                >
                  <div className={classes.mapInfoWindow}>
                  <Link target="_blank" rel="noopener noreferrer" href={event.link}>
                    <h3>{event.name}</h3>
                  </Link>
                    <p>{event?.desc}</p>
                  </div>
                </InfoWindow>}
              </Marker>
            )
          }
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default memo(MapComponent);
