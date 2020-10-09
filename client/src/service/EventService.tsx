import axios from 'axios';
import "core-js/stable";
import "regenerator-runtime/runtime";
import Event from "../domain/Event";
import Filters from '../domain/Filters';

export class EventService {
  baseUrl: string = "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";

  // Prepares fetched events for display on the map
  formatEvents = (events: any): Event[] => {
    let formattedEvents = events.data.content.map((event: any) => {
      return ({
        name: event.name,
        desc: event?.desc,
        position: {
          lat: event?.latitude,
          lng: event?.longitude
        }
      } as Event);
    });
    return formattedEvents;
  };

  // only supporting limit and date range right now, everything else to come later
  fetchFilteredEvents = async (filters: Filters): Promise<Event[] | void> => {
    try {
      var filterString: string = "lat=" + filters.userPos.lat + "&lng=" + filters.userPos.lng;
      if (filters.limit) {
        filterString += "&limit=" + filters.limit;
      }
      if (filters.firstDate && filters.lastDate) {
        filterString += "&firstDate=" + filters.firstDate + "&lastDate=" + filters.lastDate;
      }
      const events = await axios.get(this.baseUrl + "/events/filter?" + filterString);
      return this.formatEvents(events);
    } catch(error) {
      console.error(error);
    }
  };

  // Fetches a list of all string categories, for example:
  // ["parties","NULL","networking","galas","festivals","classes","performances","other"]
  fetchCategories = async (): Promise<string[]> => {
    try {
      const response = await axios.get(this.baseUrl + '/categories');
      return response.data.content;
    } catch(error) {
      console.error(error);
    }
  };

  // Logs a user in. Returns the authorizaton token provided by the backend.
  userLogIn = async (username_: string, password_: string): Promise<string> => {
    try {
      const response = await axios.post(this.baseUrl + '/login', {username: username_, password: password_});
      return response.headers["authorization"];
    } catch(error) {
      console.error(error);
      throw new Error("Invalid username or password. Please try again.");
    }
  };

  // Creates an account with the provided username and pw
  userSignUp = async (username_: string, password_: string): Promise<any> => {
    try {
      await axios.post(this.baseUrl + '/user/sign-up', {username: username_, password: password_});
    } catch(error) {
      console.error(error);
      throw new Error("Internal server error: '" + error.response.statusText + "' Please try again.");
    }
  };
}
