import axios from 'axios';
import "core-js/stable";
import "regenerator-runtime/runtime";
import Event from "../domain/Event";
import Filters from '../domain/Filters';

export class EventService {
  // BASE URL
  //
  // If testing on a local machine:
  // baseUrl: string = "https://cors-anywhere.herokuapp.com/" + "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";
  // OR (bottom seems better)
  baseUrl: string = "https://thingproxy.freeboard.io/fetch/" + "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";
  //
  // For production:
  // baseUrl: string = "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";

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

  // only supporting limit right now, everything else to come later
  fetchFilteredEvents = (filters: Filters): Promise<Event[] | void> => {
    try {
      var filterString: string = "";
      if (filters.limit) {
        filterString += "?limit=" + filters.limit;
      }
      return axios.get(this.baseUrl + "/events" + filterString).then((events: any) => {
        return this.formatEvents(events);
      });
    } catch(error) {
      console.error(error);
    }
  };

  // Fetches a list of all string categories, for example:
  // ["parties","NULL","networking","galas","festivals","classes","performances","other"]
  fetchCategories = (): Promise<string[]> => {
    try {
      return axios.get(this.baseUrl + '/categories');
    } catch(error) {
      console.error(error);
    }
  };

}
