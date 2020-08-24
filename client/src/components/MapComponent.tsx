import React, { CSSProperties } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { DummyEvents } from "../data/DummyEvents"
 
const containerStyle: CSSProperties = {
  width: '99vw',
  height: '98vh'
};

const infoStyle: CSSProperties = {
  textAlign: 'center',
  padding: 10
};

const defaultCenter: google.maps.LatLngLiteral = {
  lat: 33.8463,
  lng: -84.3621
};

export const MapComponent: React.FC = () => {
  const [map, setMap] = React.useState(null);
  // Replace DummyEvents with a list of retrieved events
  const [events,] = React.useState(DummyEvents);
  const [markerInfoOpenMap, setMarkerInfoOpenMap] = React.useState(new Map<number, boolean>());

  const toggleMarkerInfoOpen = (markerIndex: number, bool: boolean): void => {
    const newMap: Map<number, boolean> = new Map(markerInfoOpenMap).set(markerIndex, bool);
    setMarkerInfoOpenMap(newMap);
  };

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);
 
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <LoadScript
      googleMapsApiKey="API_KEY_HERE"
    >
      <GoogleMap
        id={"map"}
        mapContainerStyle={containerStyle}
        center={events[0].position || defaultCenter}
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
                <div style={infoStyle}>
                  <h3>{event.name}</h3>
                  <p>{event?.desc}</p>
                </div>
              </InfoWindow>}
            </Marker>
          )
        })}
      </GoogleMap>
    </LoadScript>
  )
};

export default React.memo(MapComponent);
