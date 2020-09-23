import React, { FC, useState, useCallback, memo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { EventService } from "../service/EventService";
import { IEvent } from "../domain/Event";
import useStyles from "../css"

const defaultCenter: google.maps.LatLngLiteral = {
  lat: 33.8463,
  lng: -84.3621
};

const numEvents: number = 50;
const eventService = new EventService();

const MapComponent: FC = () => {
  const classes = useStyles();
  const [map, setMap] = useState(null);
  const [markerInfoOpenMap, setMarkerInfoOpenMap] = useState(new Map<number, boolean>());
  const [events, setEvents] = useState<IEvent[]>([]);

  // Asynchronously load the events
  const loadEvents = async (numEvents: number) => {
    var eventList = await eventService.fetchEventsWithLimit(numEvents).then((fetchedEvents: IEvent[]) => {
      return fetchedEvents;
    });
    setEvents(eventList);
  };

  const toggleMarkerInfoOpen = (markerIndex: number, bool: boolean): void => {
    const newMap: Map<number, boolean> = new Map(markerInfoOpenMap).set(markerIndex, bool);
    setMarkerInfoOpenMap(newMap);
  };

  const onLoad = useCallback(function callback(map) {
    setMap(map);
    loadEvents(numEvents);
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
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {events.map((event, index) => {
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
                  <h3>{event.name}</h3>
                  <p>{event?.desc}</p>
                </div>
              </InfoWindow>}
            </Marker>
          )
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default memo(MapComponent);
