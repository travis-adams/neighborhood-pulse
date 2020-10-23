import React, { FunctionComponent, useState, useEffect } from 'react';
import EventService from "../service/EventService";
import { Divider, Box, Snackbar } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import Event from "../domain/Event";
import Filters from '../domain/Filters';
import EventGrid from "./EventGrid";
import MapComponent from "./MapComponent";
import NavBar from "./NavBar";
import ExpandedEvent from "./ExpandedEvent";
import useStyles from "../css";
import Comment from "../domain/Comment";
import PointOfInterest from "../domain/PointOfInterest";

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
  const [unsavedFilters, setUnsavedFilters] = useState<Filters>(defaultFilters);
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  // User sign-in info
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  // Event details
  const [expandedEvent, setExpandedEvent] = useState<Event>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleCloseToast = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const expandEvent = (event: Event) => {
    setExpandedEvent(event);
    setIsExpanded(true);
  };

  const closeEvent = () => {
    setIsExpanded(false);
    setComments([]);
  };

  const addComment = async (text: string) => {
    var newComment = await eventService.submitEventComment(expandedEvent.id, text, username, token).then((fetchedComment: Comment) => {
      return fetchedComment;
    });
    setComments([ ...comments, newComment]);
  };

  const loadComments = async () => {
    if (expandedEvent) {
      var commentList = await eventService.fetchEventComments(expandedEvent.id).then((fetchedComments: Comment[]) => {
        return fetchedComments;
      });
      setComments(commentList);
    }
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
            if (event.id === savedEvent.id) {
              event.saved = true;
            }
          });
        });
      }
    }
    // finally, update the displayed events
    setEvents(eventList);
  };

  // Load points of interest
  const loadPois = async () => {
    var poiList = await eventService.fetchPois(filters.userPos).then((fetchedPois: PointOfInterest[]) => {
      return fetchedPois;
    });
    setPois(poiList)
  };

  useEffect(() => {
    closeEvent();
    loadEvents();
    loadPois();
  }, [filters, signedIn]);

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
          expandedEvent={expandedEvent}
          expandEvent={expandEvent}
          closeEvent={closeEvent}
          isExpanded={isExpanded}
        />
        <ExpandedEvent
          event={expandedEvent}
          isExpanded={isExpanded}
          expandEvent={expandEvent}
          closeEvent={closeEvent}
          comments={comments}
          addComment={addComment}
          signedIn={signedIn}
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
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert onClose={handleCloseToast} severity="success">
          {signedIn ? "Signed in" : "Signed out"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MainPage;
