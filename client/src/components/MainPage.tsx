import React, { FunctionComponent, useState, useEffect } from 'react';
import EventService from "../service/EventService";
import { Divider, Box, Snackbar } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import Event from "../domain/Event";
import Filters from '../domain/Filters';
import EventGrid from "./EventGrid";
import MapComponent from "./MapComponent";
import NavBar from "./NavBar";
import useStyles from "../css";

export const defaultFilters: Filters = {
  userPos: {
    lat: 33.8463,
    lng: -84.3621
  },
  limit: 75,
  firstDate: '2020-01-02',
  lastDate: '2021-01-01',
  online: false,
  saved: false
};

const eventService = new EventService();

const MainPage: FunctionComponent = () => {
  const classes = useStyles();
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  const handleCloseToast = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  // Asynchronously load the events
  const loadEvents = async () => {
    var eventList;
    // If the "Saved Events" checkbox is checked, only load the user's saved events. Otherwise, load all events.
    if (filters.saved) {
      eventList = await eventService.fetchFilteredEvents(filters, true, username, token).then((fetchedEvents: Event[]) => {
        return fetchedEvents;
      });
    } else {
      eventList = await eventService.fetchFilteredEvents(filters, false).then((fetchedEvents: Event[]) => {
        return fetchedEvents;
      });
      // if signed in, set the "saved" attribute of each event to true if the user has saved it
      if (signedIn) {
        var savedEvents = await eventService.fetchFilteredEvents(filters, true, username, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });

        eventList.forEach((event: Event) => {
          savedEvents.forEach((savedEvent: Event) => {
            if (event.id == savedEvent.id) {
              event.saved = true;
            }
          });
        });
      }
    }
    // finally, update the displayed events
    setEvents(eventList);
  };

  // Triggered by handleApply in NavBar.tsx
  useEffect(() => {
    loadEvents();
  }, [filters, signedIn]);

  return (
    <div className={classes.flexColumn}>
      <NavBar
        filters={filters}
        setFilters={setFilters}
        signedIn={signedIn}
        setSignedIn={setSignedIn}
        setToken={setToken}
        setToastOpen={setToastOpen}
        setUsername={setUsername}
      />
      <Divider/>
      <Box className={classes.mainBox}>
        <EventGrid
          events={events}
          setEvents={setEvents}
          signedIn={signedIn}
          token={token}
          username={username}
          onlineOnly={filters.online}
          savedOnly={filters.saved}
        />
        <MapComponent events={events} />
      </Box>
      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity="success">
          {signedIn ? "Signed in" : "Signed out"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MainPage;
