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
import TabOption from "../domain/TabOption";
import User from "../domain/User";
import Group from "../domain/Group";
import TabBar from "./TabBar";

export const defaultFilters: Filters = {
  searchPos: new google.maps.LatLng({lat: 33.8463, lng: -84.3621}),
  limit: 75,
  firstDate: new Date(),
  lastDate: new Date('2021-01-01'),
  categories: [],
  online: false,
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
  // User info
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<User>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  // Event details
  const [expandedEvent, setExpandedEvent] = useState<Event>(null);
  const [isEventExpanded, setIsEventExpanded] = useState<boolean>(false);
  const [comments, setComments] = useState<Map<number, Comment[]>>(new Map());
  // Tabs
  const [tab, setTab] = useState<TabOption>(TabOption.NearbyEvents);

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
    const newComment = await eventService.submitEventComment(eventId, text, user.username, token).then((fetchedComment: Comment) => {
      return fetchedComment;
    });
    let newComments = new Map(comments);
    addCommentToMap(newComment, newComments);
    setComments(newComments);
  }

  // Asynchronously load the events
  const loadEvents = async () => {
    let eventList: Event[];
    let userSavedEvents: Event[];
    let groupSavedEvents: Event[];
    switch (tab) {

      case TabOption.NearbyEvents:
        eventList = await eventService.fetchFilteredEvents(filters).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });
        // if signed in, set the userSaved and groupSaved attributes of each event as necessary
        if (isSignedIn) {
          userSavedEvents = await eventService.fetchUserSavedEvents(user.username, token).then((fetchedEvents: Event[]) => {
            return fetchedEvents;
          });
          groupSavedEvents = await eventService.fetchGroupSavedEvents(user.groupId, token).then((fetchedEvents: Event[]) => {
            return fetchedEvents;
          });
          eventList.forEach((event: Event) => {
            userSavedEvents.concat(groupSavedEvents).forEach((savedEvent: Event) => {
              if (event.id === savedEvent.id) {
                if (savedEvent.userSaved) {
                  event.userSaved = true;
                } else if (savedEvent.groupSaved) {
                  event.groupSaved = true;
                }
              }
            });
          });
        }
        break;

      case TabOption.MySavedEvents:
        eventList = await eventService.fetchUserSavedEvents(user.username, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });
        groupSavedEvents = await eventService.fetchGroupSavedEvents(user.groupId, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });
        eventList.forEach((event: Event) => {
          groupSavedEvents.forEach((savedEvent: Event) => {
            if (event.id === savedEvent.id) {
              event.groupSaved = true;
            }
          });
        });
        break;

      case TabOption.MyGroupSavedEvents:
        eventList = await eventService.fetchGroupSavedEvents(user.groupId, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });
        userSavedEvents = await eventService.fetchUserSavedEvents(user.username, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });
        eventList.forEach((event: Event) => {
          userSavedEvents.forEach((savedEvent: Event) => {
            if (event.id === savedEvent.id) {
              event.userSaved = true;
            }
          });
        });
        break;

      case TabOption.MyCreatedEvents:
        eventList = await eventService.fetchUserCreatedEvents(user.username, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });
        userSavedEvents = await eventService.fetchUserSavedEvents(user.username, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });
        groupSavedEvents = await eventService.fetchGroupSavedEvents(user.groupId, token).then((fetchedEvents: Event[]) => {
          return fetchedEvents;
        });
        eventList.forEach((event: Event) => {
          userSavedEvents.concat(groupSavedEvents).forEach((savedEvent: Event) => {
            if (event.id === savedEvent.id) {
              if (savedEvent.userSaved) {
                event.userSaved = true;
              } else if (savedEvent.groupSaved) {
                event.groupSaved = true;
              }
            }
          });
        });
        break;

      default:
        // This should never be reached; return to be safe
        return;
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

  // Load user groups
  const loadGroups = async () => {
    const groupList = await eventService.fetchGroups().then((fetchedGroups: Group[]) => {
      return fetchedGroups;
    });
    setGroups(groupList);
  }

  // When the page loads for the first time, load categories, points of interest, and user groups
  useEffect(() => {
    loadCategories();
    loadPois();
    loadGroups();
  }, [])

  // When the filters or tab changes, close the expanded event and load the applicable events
  useEffect(() => {
    closeEvent();
    loadEvents();
  }, [filters, tab]);

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
        user={user}
        setUser={setUser}
        expandEvent={expandEvent}
        closeEvent={closeEvent}
        tab={tab}
        setTab={setTab}
        groups={groups}
      />
      <Divider/>
      <Box className={classes.mainBox}>
        <EventGrid
          events={events}
          setEvents={setEvents}
          isSignedIn={isSignedIn}
          token={token}
          user={user}
          onlineOnly={filters.online}
          tab={tab}
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
      <TabBar
        isSignedIn={isSignedIn}
        tab={tab}
        setTab={setTab}
      />
    </div>
  );
}

export default MainPage;
