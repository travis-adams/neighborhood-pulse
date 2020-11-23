import axios from 'axios';
import "core-js/stable";
import "regenerator-runtime/runtime";
import Event from "../domain/Event";
import Filters from '../domain/Filters';
import Comment from '../domain/Comment';
import PointOfInterest from '../domain/PointOfInterest';
import User from '../domain/User';
import Group from '../domain/Group';

export default class EventService {
  baseUrl = "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";

  // Prepares fetched events for display on the map
  formatEvents = (events: any, isUserSaved: boolean, isGroupSaved: boolean): Event[] => {
    const formattedEvents = events.map((event: any) => {
      return ({
        name: event.name,
        desc: event?.desc,
        userSaved: isUserSaved,
        groupSaved: isGroupSaved,
        id: event.id,
        date: new Date(event.date + 'T' + event.time),
        link: event.link,
        cat: event?.category,
        location: event?.loc,
        address: event?.addr,
        position: (event.latitude && event.longitude) ? new google.maps.LatLng({lat: event.latitude, lng: event.longitude}) : null
      } as Event);
    });
    return formattedEvents;
  }

  formatComments = (comments: any): Comment[] => {
    const formattedComments = comments.map((comment: any) => {
      return ({
        id: comment.id,
        userId: comment.userID,
        eventId: comment.eventID,
        text: comment.text,
        timestamp: new Date(comment.timestamp.replace(" ", "T")),
        username: comment.username
      } as Comment);
    });
    return formattedComments;
  }

  formatPois = (pois: any): PointOfInterest[] => {
    const formattedPois = pois.map((poi: any) => {
      return ({
        name: poi.name,
        address: poi?.addr,
        desc: poi?.desc,
        link: poi.link,
        position: new google.maps.LatLng({lat: poi.latitude, lng: poi.longitude})
      } as PointOfInterest);
    });
    return formattedPois;
  }

  formatUser = (user: any): User => {
    return ({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      groupId: user.groupID
    } as User);
  }

  formatGroups = (groups: any): Group[] => {
    const formattedGroups = groups.map((group: any) => {
      return ({
        id: group.groupID,
        name: group.groupName
      } as Group);
    });
    return formattedGroups;
  }

  // supports: limit, date range, lat/lng, online, categories
  fetchFilteredEvents = async (filters: Filters): Promise<Event[]> => {
    try {
      let filterString = "";
      if (!filters.online) {
        filterString += "&lat=" + filters.searchPos.lat() + "&lng=" + filters.searchPos.lng();
      }
      if (filters.limit) {
        filterString += "&limit=" + filters.limit;
      }
      if (filters.firstDate && filters.lastDate) {
        filterString += "&firstDate=" + filters.firstDate.toISOString().split("T")[0] + "&lastDate=" + filters.lastDate.toISOString().split("T")[0];
      }
      if (filters.categories) {
        if (filters.categories.length > 0) {
          filterString += "&category=" + filters.categories.join(",")
        }
      }
      let events;
      if (filters.online) {
        events = await axios.get(this.baseUrl + "/events/online?" + filterString);
        events = this.formatEvents(events.data.content, false, false);
      } else {
        events = await axios.get(this.baseUrl + "/events/filter?" + filterString);
        events = this.formatEvents(events.data.content, false, false);
      }
      return events;
    } catch (error) {
      console.error(error);
    }
  }

  fetchUserSavedEvents = async (username: string, token: string): Promise<Event[]> => {
    try {
      const events = await axios.get(this.baseUrl + '/user/saved?user=' + username, {headers: {'Authorization': token}});
      return this.formatEvents(events.data, true, false);
    } catch (error) {
      console.error(error);
    }
  }

  fetchGroupSavedEvents = async (groupId: number, token: string): Promise<Event[]> => {
    try {
      const events = await axios.get(this.baseUrl + '/group/events?group=' + groupId, {headers: {'Authorization': token}});
      return this.formatEvents(events.data, false, true);
    } catch (error) {
      console.error(error);
    }
  }

  fetchUserCreatedEvents = async (username: string, token: string): Promise<Event[]> => {
    try {
      const events = await axios.get(this.baseUrl + '/user/created?user=' + username, {headers: {'Authorization': token}});
      return this.formatEvents(events.data, false, false);
    } catch (error) {
      console.error(error);
    }
  }

  fetchUserInfo = async (username: string, token: string): Promise<User> => {
    try {
      const user = await axios.get(this.baseUrl + '/user/info?user=' + username, {headers: {'Authorization': token}});
      return this.formatUser(user.data);
    } catch (error) {
      console.error(error)
    }
  }

  fetchGroups = async (): Promise<Group[]> => {
    try {
      const groups = await axios.get(this.baseUrl + '/group/groups');
      return this.formatGroups(groups.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetches a list of all string categories, for example:
  // ["parties","networking","galas","festivals","classes","performances","other"]
  fetchCategories = async (): Promise<string[]> => {
    try {
      const response = await axios.get(this.baseUrl + '/events/categories');
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  // Logs a user in. Returns the authorizaton token provided by the backend
  userLogIn = async (username_: string, password_: string): Promise<string> => {
    try {
      const response = await axios.post(this.baseUrl + '/login', {username: username_, password: password_});
      return response.headers["authorization"];
    } catch (error) {
      console.error(error);
      throw new Error("Invalid username or password. Please try again.");
    }
  }

  // Creates an account with the provided username and password
  userSignUp = async (username_: string, password_: string, firstName_: string, lastName_: string, groupId_: number): Promise<void> => {
    try {
      await axios.post(this.baseUrl + '/user/sign-up', {username: username_, password: password_, firstName: firstName_, lastName: lastName_, groupID: groupId_});
    } catch (error) {
      console.error(error);
      throw new Error("Username taken. Please try again.");
    }
  }

  // Modifies a user's account
  userModify = async (id_: number, firstName_: string, lastName_: string, groupId_: number, username_: string, token: string): Promise<User> => {
    try {
      const newUser = await axios.put(this.baseUrl + '/user/modify', {id: id_, firstName: firstName_, lastName: lastName_, groupID: groupId_, username: username_, password: ""}, {headers: {'Authorization': token}});
      return this.formatUser(newUser.data);
    } catch (error) {
      console.error(error);
      throw new Error("Internal server error. Please try again.");
    }
  }

  // Saves an event to a user
  userSaveEvent = async (eventId: number, username: string, token: string): Promise<void> => {
    try {
      await axios.post(this.baseUrl + '/user/save?event=' + eventId + '&user=' + username, null, {headers: {'Authorization': token}});
    } catch (error) {
      console.error(error);
    }
  }

  // Unsaves an event from a user
  userUnsaveEvent = async (eventId: number, username: string, token: string): Promise<void> => {
    try {
      await axios.get(this.baseUrl + '/user/unsave?event=' + eventId + '&user=' + username, {headers: {'Authorization': token}});
    } catch (error) {
      console.error(error);
    }
  }

  // Saves an event to a group
  groupSaveEvent = async (eventId: number, groupId: number, token: string): Promise<void> => {
    try {
      await axios.post(this.baseUrl + '/group/save?event=' + eventId + '&group=' + groupId, null, {headers: {'Authorization': token}});
    } catch (error) {
      console.error(error);
    }
  }

  // Unsaves an event from a group
  groupUnsaveEvent = async (eventId: number, groupId: number, token: string): Promise<void> => {
    try {
      await axios.get(this.baseUrl + '/group/unsave?event=' + eventId + '&group=' + groupId, {headers: {'Authorization': token}});
    } catch (error) {
      console.error(error);
    }
  }

  // Fetches comments for a list of events
  fetchEventComments = async (eventIds: number[]): Promise<Comment[]> => {
    try {
      if (!eventIds || eventIds.length == 0) {
        return [];
      }
      let events = "";
      eventIds.forEach((eventId: number) => {
        events += "event=" + eventId + "&";
      });
      const response = await axios.get(this.baseUrl + '/comment/all?' + events);
      return this.formatComments(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  // Saves a new comment to an event
  submitEventComment = async (eventId: number, text_: string, username_: string, token: string): Promise<Comment> => {
    try {
      const response = await axios.post(this.baseUrl + '/comment/submit', {eventID: eventId, text: text_, username: username_}, {headers: {'Authorization': token}});
      return this.formatComments([response.data])[0];
    } catch (error) {
      console.error(error);
    }
  }

  // Fetches points of interest (using a 100 constant limit for now)
  fetchPois = async (searchPos: google.maps.LatLng): Promise<PointOfInterest[]> => {
    try {
      const response = await axios.get(this.baseUrl + "/locations/filter?limit=100&lat=" + searchPos.lat() + "&lng=" + searchPos.lng());
      return this.formatPois(response.data.content);
    } catch (error) {
      console.error(error);
    }
  }

  // Submit a user-created event
  submitEvent = async (event: Event, username: string, token: string): Promise<Event> => {
    try {
      const data = {
        name: event.name,
        desc: event.desc,
        date: event.date.toISOString().split("T")[0], // YYYY-MM-DD
        time: event.date.toISOString().split("T")[1].slice(0, 8), // HH:MM:SS
        loc: event.location,
        addr: event.address,
        cat: event.category,
        link: event.link,
        latitude: event.position ? event.position.lat() : null,
        longitude: event.position ? event.position.lng() : null
      };
      const response = await axios.post(this.baseUrl + "/events/submit?username=" +  username, data, {headers: {'Authorization': token}});
      return this.formatEvents([response.data], true, false)[0];
    } catch (error) {
      if (error.response) {
        throw new Error("Internal server error: '" + error.response.statusText + "' Please try again.");
      } else {
        throw new Error("Unexpected error during event creation. Please try again");
      }
    }
  }

}
