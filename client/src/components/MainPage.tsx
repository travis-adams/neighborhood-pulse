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
  const [comments, setComments] = useState<Map<number, Comment[]>>(new Map());

  const expandEvent = (event: Event) => {
    setExpandedEvent(event);
    setIsEventExpanded(true);
  }

  const closeEvent = () => {
    setIsEventExpanded(false);
  }

  // helper function; adds a Comment to a number->Comment[] map
  const addCommentToMap = (comment: Comment, map: Map<number, Comment[]>) => {
    if (map.has(comment.eventId)) {
      map.set(comment.eventId, [...map.get(comment.eventId), comment]);
    } else {
      map.set(comment.eventId, [comment]);
    }
  }

  const addCommentToEvent = async (eventId: number, text: string) => {
    const newComment = await eventService.submitEventComment(eventId, text, username, token).then((fetchedComment: Comment) => {
      return fetchedComment;
    });
    let newComments = new Map(comments);
    addCommentToMap(newComment, newComments);
    setComments(newComments);
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
    // update the displayed events
    setEvents(eventList);

    // get comments for all events
    let commentList = await eventService.fetchEventComments(eventList.map((event: Event) => event.id));
    // generate the mapping between events and their comments
    let commentMap = new Map<number, Comment[]>();
    commentList.forEach((comment: Comment) => {
      addCommentToMap(comment, commentMap);
    });
    // update the global comments map
    setComments(commentMap);
  }

  // Load event categories
  const loadCategories = async () => {
    const categoryList = await eventService.fetchCategories().then((fetchedCategories: string[]) => {
      return fetchedCategories;
    });
    // filter out the null category
    setCategories(categoryList.filter(category => category != null));
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
        token={token}
        setToken={setToken}
        username={username}
        setUsername={setUsername}
        expandEvent={expandEvent}
        closeEvent={closeEvent}
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
          comments={(expandedEvent && comments.has(expandedEvent.id)) ? comments.get(expandedEvent.id) : []}
          addComment={addCommentToEvent}
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
