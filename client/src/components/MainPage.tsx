import React, { FunctionComponent, useState, useEffect } from 'react';
import { EventService } from "../service/EventService";
import { Divider, Box } from "@material-ui/core";
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
      <NavBar filters={filters} setFilters={setFilters}/>
      <Divider/>
      <Box className={classes.mainBox}>
        <EventGrid events={events} />
        <MapComponent events={events}/>
      </Box>
    </div>
  );
};

export default MainPage;
