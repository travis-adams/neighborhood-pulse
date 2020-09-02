import axios from 'axios';
import "core-js/stable";
import "regenerator-runtime/runtime";
import { IEvent } from "../domain/Event";

export class EventService {
  // BASE URL
  //
  // If testing on a local machine:
  // baseUrl: string = "https://cors-anywhere.herokuapp.com/" + "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";
  // OR (bottom seems better)
  // baseUrl: string = "https://thingproxy.freeboard.io/fetch/" + "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";
  //
  // For production:
  baseUrl: string = "http://npulsebackendpoc-env.eba-qcadjde2.us-east-2.elasticbeanstalk.com:5000";

  // Prepares fetched events for display on the map
  validateAndFormatEvents = (events: any): IEvent[] => {
    let validEvents = events.data.content.filter((event: any) => (event.latitude && event.longitude));
    let formattedEvents = validEvents.map((event: any) => {
      return ({
        name: event.name,
        desc: event.desc,
        position: {
          lat: event.latitude,
          lng: event.longitude
        }
      } as IEvent);
    });
    return formattedEvents;
  };

  // Backend sends back 10 events by default
  fetchEvents = (): Promise<IEvent[] | void> => {
    try {
      return axios.get(this.baseUrl + "/events").then((events: any) => {
        return this.validateAndFormatEvents(events);
      });
    } catch(error) {
      console.error(error);
    }
  };

  fetchEventsWithLimit = (limit: number): Promise<IEvent[] | void> => {
    try {
      return axios.get(this.baseUrl + "/events?limit=" + limit).then((events: any) => {
        return this.validateAndFormatEvents(events);
      });
    } catch(error) {
      console.error(error);
    }
  };

}
