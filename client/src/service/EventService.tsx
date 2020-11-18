import axios from 'axios';
import "core-js/stable";
import "regenerator-runtime/runtime";
import Event from "../domain/Event";
import Filters from '../domain/Filters';
import Comment from '../domain/Comment';
import PointOfInterest from '../domain/PointOfInterest';

export default class EventService {
  baseUrl = "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";

  // Prepares fetched events for display on the map
  formatEvents = (events: any, isSaved: boolean): Event[] => {
    const formattedEvents = events.map((event: any) => {
      return ({
        name: event.name,
        desc: event?.desc,
        saved: isSaved,
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

  // supports: limit, date range, lat/lng, online, user saved, categories
  fetchFilteredEvents = async (filters: Filters, userSaved: boolean, username?: string, token?: string): Promise<Event[]> => {
    try {
      let filterString = "";
      if (userSaved) {
        filterString += "user=" + username;
      }
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
      if (userSaved) {
        events = await axios.get(this.baseUrl + '/user/saved?' + filterString, {headers: {'Authorization': token}});
        events = this.formatEvents(events.data, true);
      } else if (filters.online) {
        events = await axios.get(this.baseUrl + "/events/online?" + filterString);
        events = this.formatEvents(events.data.content, false);
      } else {
        events = await axios.get(this.baseUrl + "/events/filter?" + filterString);
        events = this.formatEvents(events.data.content, false);
      }
      return events;
    } catch(error) {
      console.error(error);
    }
  }

  // Fetches a list of all string categories, for example:
  // ["parties","networking","galas","festivals","classes","performances","other"]
  fetchCategories = async (): Promise<string[]> => {
    try {
      const response = await axios.get(this.baseUrl + '/events/categories');
      return response.data;
    } catch(error) {
      console.error(error);
    }
  }

  // Logs a user in. Returns the authorizaton token provided by the backend
  userLogIn = async (username_: string, password_: string): Promise<string> => {
    try {
      const response = await axios.post(this.baseUrl + '/login', {username: username_, password: password_});
      return response.headers["authorization"];
    } catch(error) {
      console.error(error);
      throw new Error("Invalid username or password. Please try again.");
    }
  }

  // Creates an account with the provided username and password
  userSignUp = async (username_: string, password_: string): Promise<void> => {
    try {
      await axios.post(this.baseUrl + '/user/sign-up', {username: username_, password: password_});
    } catch(error) {
      console.error(error);
      throw new Error("Internal server error: '" + error.response.statusText + "' Please try again.");
    }
  }

  // Saves an event for a user
  saveEvent = async (eventId: number, username: string, token: string): Promise<void> => {
    try {
      await axios.post(this.baseUrl + '/user/save?event=' + eventId + '&user=' + username, null, {headers: {'Authorization': token}});
    } catch(error) {
      console.error(error);
    }
  }

  // Unsaves an event for a user
  unsaveEvent = async (eventId: number, username: string, token: string): Promise<void> => {
    try {
      await axios.get(this.baseUrl + '/user/unsave?event=' + eventId + '&user=' + username, {headers: {'Authorization': token}});
    } catch(error) {
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
    } catch(error) {
      console.error(error);
    }
  }

  // Saves a new comment to an event
  submitEventComment = async (eventId: number, text_: string, username_: string, token: string): Promise<Comment> => {
    try {
      const response = await axios.post(this.baseUrl + '/comment/submit', {eventID: eventId, text: text_, username: username_}, {headers: {'Authorization': token}});
      return this.formatComments([response.data])[0];
    } catch(error) {
      console.error(error);
    }
  }

  // Fetches points of interest (using a 100 constant limit for now)
  fetchPois = async (searchPos: google.maps.LatLng): Promise<PointOfInterest[]> => {
    try {
      // there's a 'name' filter as well... maybe use that somehow?
      const response = await axios.get(this.baseUrl + "/locations/filter?limit=100&lat=" + searchPos.lat() + "&lng=" + searchPos.lng());
      return this.formatPois(response.data.content);
    } catch(error) {
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
        latitude: event.position.lat(),
        longitude: event.position.lng()
      };
      const response = await axios.post(this.baseUrl + "/events/submit?username=" +  username, data, {headers: {'Authorization': token}});
      return this.formatEvents([response.data], true)[0];
    } catch(error) {
      throw new Error("Internal server error: '" + error.response.statusText + "' Please try again.");
    }
  }

}
