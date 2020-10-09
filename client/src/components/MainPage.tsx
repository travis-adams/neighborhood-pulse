import React, { FunctionComponent, useState, useEffect } from 'react';
import { EventService } from "../service/EventService";
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
  online: false
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
  const loadEvents = async (eventFilters: Filters) => {
    var eventList = await eventService.fetchFilteredEvents(eventFilters).then((fetchedEvents: Event[]) => {
      return fetchedEvents;
    });
    setEvents(eventList);
  };

  useEffect(() => {
    loadEvents(filters);
  }, [filters]);

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
        <EventGrid events={events} signedIn={signedIn} token={token} username={username}/>
        <MapComponent events={events}/>
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
