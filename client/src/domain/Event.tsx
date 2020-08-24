import { Address } from "./Address"

// Only required fields are name and position (latitude and longitude)
export interface Event {
  name: string;
  desc?: string;
  eType?: string;
  link?: string;
  date?: {
      start: Date;
      end: Date;
  }
  address?: Address
  position: google.maps.LatLngLiteral
};
