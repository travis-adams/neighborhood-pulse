import React, { FunctionComponent, useState, useEffect } from 'react';
import EventService from "../service/EventService";
import { Divider, Box } from "@material-ui/core";
import Event from "../domain/Event";
import Filters from '../domain/Filters';
import EventGrid from "./EventGrid";
import MapComponent from "./MapComponent";
import NavBar from "./NavBar";
import EventExpansion from "./EventExpansion";
import useStyles from "../css";
import Comment from "../domain/Comment";
import PointOfInterest from "../domain/PointOfInterest";

export const defaultFilters: Filters = {
  searchPos: new google.maps.LatLng({lat: 33.8463, lng: -84.3621}),
  limit: 75,
  firstDate: new Date('2020-01-02'),
  lastDate: new Date('2021-01-01'),
  categories: [],
  online: false,
  saved: false
}

const eventService = new EventService();

const MainPage: FunctionComponent = () => {
  const classes = useStyles();
  // Events & points of interest
  const [events, setEvents] = useState<Event[]>([]);
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  // Filtering
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [unsavedFilters, setUnsavedFilters] = useState<Filters>(defaultFilters);
  const [categories, setCategories] = useState<string[]>([]);
  // User sign-in info
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  // Event details
  const [expandedEvent, setExpandedEvent] = useState<Event>(null);
  const [isEventExpanded, setIsEventExpanded] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const expandEvent = (event: Event) => {
    setExpandedEvent(event);
    setIsEventExpanded(true);
  }

  const closeEvent = () => {
    setIsEventExpanded(false);
  }

  const submitEvent = async (event: Event) => {
    const newEvent = await eventService.submitEvent(event, username, token).then((fetchedEvent: Event) => {
      return fetchedEvent;
    });
    expandEvent(newEvent);
  }

  const addComment = async (text: string) => {
    const newComment = await eventService.submitEventComment(expandedEvent.id, text, username, token).then((fetchedComment: Comment) => {
      return fetchedComment;
    });
    setComments([ ...comments, newComment]);
  }

  const loadComments = async () => {
    if (expandedEvent) {
      const commentList = await eventService.fetchEventComments(expandedEvent.id).then((fetchedComments: Comment[]) => {
        return fetchedComments;
      });
      setComments(commentList);
    }
  }

  // Asynchronously load the events
  const loadEvents = async () => {
    let eventList;
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
      if (isSignedIn) {
        const savedEvents = await eventService.fetchFilteredEvents(filters, true, username, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });

        eventList.forEach((event: Event) => {
          savedEvents.forEach((savedEvent: Event) => {
            if (event.id === savedEvent.id) {
              event.saved = true;
            }
          });
        });
      }
    }
    // finally, update the displayed events
    setEvents(eventList);
  }

  // Load event categories
  const loadCategories = async () => {
    const categoryList = await eventService.fetchCategories().then((fetchedCategories: string[]) => {
      return fetchedCategories;
    });
    // slicing out the null category
    setCategories(categoryList.slice(1, 18));
  }

  // Load points of interest
  const loadPois = async () => {
    const poiList = await eventService.fetchPois(filters.searchPos).then((fetchedPois: PointOfInterest[]) => {
      return fetchedPois;
    });
    setPois(poiList)
  }

  // When the page loads for the first time, load categories and points of interest
  useEffect(() => {
    loadCategories();
    loadPois();
  }, [])

  // When the filters change, close the expanded event and reload events
  useEffect(() => {
    closeEvent();
    loadEvents();
  }, [filters]);

  // When an event is clicked, load its comments (this is very inefficient)
  useEffect(() => {
    loadComments();
  }, [expandedEvent]);

  return (
    <div className={classes.flexColumn}>
      <NavBar
        filters={filters}
        setFilters={setFilters}
        unsavedFilters={unsavedFilters}
        setUnsavedFilters={setUnsavedFilters}
        categories={categories}
        isSignedIn={isSignedIn}
        setIsSignedIn={setIsSignedIn}
        setToken={setToken}
        setUsername={setUsername}
        expandEvent={expandEvent}
        closeEvent={closeEvent}
        submitEvent={submitEvent}
      />
      <Divider/>
      <Box className={classes.mainBox}>
        <EventGrid
          events={events}
          setEvents={setEvents}
          isSignedIn={isSignedIn}
          token={token}
          username={username}
          onlineOnly={filters.online}
          savedOnly={filters.saved}
          expandedEvent={expandedEvent}
          expandEvent={expandEvent}
          closeEvent={closeEvent}
          isEventExpanded={isEventExpanded}
        />
        <EventExpansion
          filters={filters}
          event={expandedEvent}
          isEventExpanded={isEventExpanded}
          closeEvent={closeEvent}
          comments={comments}
          addComment={addComment}
          isSignedIn={isSignedIn}
        />
        <MapComponent
          events={events}
          filters={filters}
          setFilters={setFilters}
          unsavedFilters={unsavedFilters}
          setUnsavedFilters={setUnsavedFilters}
          expandEvent={expandEvent}
          closeEvent={closeEvent}
          pois={pois}
        />
      </Box>
    </div>
  );
}

export default MainPage;
