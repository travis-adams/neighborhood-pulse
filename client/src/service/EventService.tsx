import axios from 'axios';
import "core-js/stable";
import "regenerator-runtime/runtime";
import Event from "../domain/Event";
import Filters from '../domain/Filters';
import Comment from '../domain/Comment';

export default class EventService {
  baseUrl: string = "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";

  // Prepares fetched events for display on the map
  formatEvents = (events: any, isSaved: boolean): Event[] => {
    let formattedEvents = events.map((event: any) => {
      return ({
        name: event.name,
        desc: event?.desc,
        saved: isSaved,
        id: event.id,
        date: new Date(event.date + 'T' + event.time),
        link: event.link,
        location: event?.loc,
        address: event?.addr,
        position: {
          lat: event?.latitude,
          lng: event?.longitude
        }
      } as Event);
    });
    return formattedEvents;
  };

  formatComments = (comments: any): Comment[] => {
    let formattedComments = comments.map((comment: any) => {
      return ({
        eventId: comment.eventID,
        text: comment.text,
        username: comment.username,
        timestamp: new Date(comment.timestamp.replace(" ", "T"))
      } as Comment);
    });
    return formattedComments;
  }

  // only supporting limit and date range right now, everything else to come later
  fetchFilteredEvents = async (filters: Filters, userSaved: boolean, username?: string, token?: string): Promise<Event[]> => {
    try {
      var filterString: string = "lat=" + filters.userPos.lat + "&lng=" + filters.userPos.lng;
      if (filters.limit) {
        filterString += "&limit=" + filters.limit;
      }
      if (filters.firstDate && filters.lastDate) {
        filterString += "&firstDate=" + filters.firstDate + "&lastDate=" + filters.lastDate;
      }
      if (filters.categories) {
        if (filters.categories.length > 0) {
          filterString += "&category=" + filters.categories.join(",")
        }
      }
      var events;
      if (userSaved) {
        events = await axios.get(this.baseUrl + '/user/saved?user=' + username + '&' + filterString, {headers: {'Authorization': token}});
        events = this.formatEvents(events.data, true);
      } else {
        events = await axios.get(this.baseUrl + "/events/filter?" + filterString);
        events = this.formatEvents(events.data.content, false);
      }
      return events;
    } catch(error) {
      console.error(error);
    }
  };

  // Fetches a list of all string categories, for example:
  // ["parties","NULL","networking","galas","festivals","classes","performances","other"]
  fetchCategories = async (): Promise<string[]> => {
    try {
      const response = await axios.get(this.baseUrl + '/events/categories');
      return response.data;
    } catch(error) {
      console.error(error);
    }
  };

  // Logs a user in. Returns the authorizaton token provided by the backend
  userLogIn = async (username_: string, password_: string): Promise<string> => {
    try {
      const response = await axios.post(this.baseUrl + '/login', {username: username_, password: password_});
      return response.headers["authorization"];
    } catch(error) {
      console.error(error);
      throw new Error("Invalid username or password. Please try again.");
    }
  };

  // Creates an account with the provided username and password
  userSignUp = async (username_: string, password_: string): Promise<void> => {
    try {
      await axios.post(this.baseUrl + '/user/sign-up', {username: username_, password: password_});
    } catch(error) {
      console.error(error);
      throw new Error("Internal server error: '" + error.response.statusText + "' Please try again.");
    }
  };

  // Saves an event for a user
  saveEvent = async (eventId: number, username: string, token: string): Promise<void> => {
    try {
      await axios.post(this.baseUrl + '/user/save?event=' + eventId + '&user=' + username, null, {headers: {'Authorization': token}});
    } catch(error) {
      console.error(error);
    }
  };

  // Unsaves an event for a user
  unsaveEvent = async (eventId: number, username: string, token: string): Promise<void> => {
    try {
      await axios.get(this.baseUrl + '/user/unsave?event=' + eventId + '&user=' + username, {headers: {'Authorization': token}});
    } catch(error) {
      console.error(error);
    }
  };

  // Fetches an event's comments
  fetchEventComments = async (eventId: number): Promise<Comment[]> => {
    try {
      const response = await axios.get(this.baseUrl + '/comment?event=' + eventId);
      return this.formatComments(response.data);
    } catch(error) {
      console.error(error);
    }
  };

  // Saves a new comment to an event
  submitEventComment = async (eventId: number, text_: string, username_: string, token: string): Promise<Comment> => {
    try {
      const response = await axios.post(this.baseUrl + '/comment/submit', {eventID: eventId, text: text_, username: username_}, {headers: {'Authorization': token}});
      return this.formatComments([response.data])[0];
    } catch(error) {
      console.error(error);
    }
  };

}
