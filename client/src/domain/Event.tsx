import { IAddress } from "./Address"

// Only required fields are name and position (latitude and longitude)
export interface IEvent {
  name: string;
  desc?: string;
  eType?: string;
  link?: string;
  date?: {
      start: string;
      end: string;
  }
  address?: IAddress
  position: google.maps.LatLngLiteral
};
