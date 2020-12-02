import React, { FunctionComponent, useState, useEffect } from "react";
import EventService from "../service/EventService";
import { Divider, Box } from "@material-ui/core";
import Event from "../domain/Event";
import Filters from "../domain/Filters";
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
import "datejs";

export const defaultFilters: Filters = {
  searchPos: new google.maps.LatLng({lat: 33.8463, lng: -84.3621}),
  limit: 75,
  firstDate: Date.today(),
  lastDate: Date.today().addMonths(1),
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
  // Expanded event details
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
    const newComment = await eventService.submitEventComment(eventId, text, user.username, token);
    let newComments = new Map(comments);
    addCommentToMap(newComment, newComments);
    setComments(newComments);
  }

  // Asynchronously load the events
  const loadEvents = async (newFilters: Filters, newTab: TabOption) => {
    let eventList: Event[];
    let userSavedEvents: Event[];
    let groupSavedEvents: Event[];
    switch (newTab) {

      case TabOption.NearbyEvents:
        eventList = await eventService.fetchFilteredEvents(newFilters);
        // if signed in, set the userSaved and groupSaved attributes of each event as necessary
        if (isSignedIn) {
          userSavedEvents = await eventService.fetchUserSavedEvents(user.username, token);
          groupSavedEvents = await eventService.fetchGroupSavedEvents(user.groupId, token);
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
        eventList = await eventService.fetchUserSavedEvents(user.username, token);
        groupSavedEvents = await eventService.fetchGroupSavedEvents(user.groupId, token);
        eventList.forEach((event: Event) => {
          groupSavedEvents.forEach((savedEvent: Event) => {
            if (event.id === savedEvent.id) {
              event.groupSaved = true;
            }
          });
        });
        break;

      case TabOption.MyGroupSavedEvents:
        eventList = await eventService.fetchGroupSavedEvents(user.groupId, token);
        userSavedEvents = await eventService.fetchUserSavedEvents(user.username, token);
        eventList.forEach((event: Event) => {
          userSavedEvents.forEach((savedEvent: Event) => {
            if (event.id === savedEvent.id) {
              event.userSaved = true;
            }
          });
        });
        break;

      case TabOption.MyCreatedEvents:
        eventList = await eventService.fetchUserCreatedEvents(user.username, token);
        userSavedEvents = await eventService.fetchUserSavedEvents(user.username, token);
        groupSavedEvents = await eventService.fetchGroupSavedEvents(user.groupId, token);
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
    const categoryList = await eventService.fetchCategories();
    // filter out the null and empty string categories
    setCategories(categoryList.filter(category => category != null && category != ""));
  }

  // Load points of interest
  const loadPois = async () => {
    const poiList = await eventService.fetchPois(filters.searchPos);
    setPois(poiList)
  }

  // Load user groups
  const loadGroups = async () => {
    const groupList = await eventService.fetchGroups();
    setGroups(groupList);
  }

  // Changes the selected filters. This requires a reload of the displayed events
  const changeFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    closeEvent();
    loadEvents(newFilters, tab);
  }

  // Changes the selected tab. This requires a reload of the displayed events
  const changeTab = (newTab: TabOption) => {
    setTab(newTab);
    closeEvent();
    // If moving to a tab that isn't "Nearby Events", remove the online filter to enable the map & pins
    if (newTab != TabOption.NearbyEvents) {
      setFilters({ ...filters, online: false });
      setUnsavedFilters({ ...filters, online: false });
      loadEvents({ ...filters, online: false }, newTab);
    } else {
      loadEvents(filters, newTab);
    }
  }

  // When the page loads for the first time, load categories, points of interest, and user groups
  useEffect(() => {
    loadCategories();
    loadPois();
    loadGroups();
  }, [])

  return (
    <div className={classes.mainFlexColumn}>
      <NavBar
        filters={filters}
        changeFilters={changeFilters}
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
        changeTab={changeTab}
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
          changeFilters={changeFilters}
          unsavedFilters={unsavedFilters}
          setUnsavedFilters={setUnsavedFilters}
          expandEvent={expandEvent}
          closeEvent={closeEvent}
          pois={pois}
          tab={tab}
        />
      </Box>
      <TabBar
        isSignedIn={isSignedIn}
        tab={tab}
        changeTab={changeTab}
      />
    </div>
  );
}

export default MainPage;
