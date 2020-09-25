import Address from "./Address"

// Only required attribute is the event name
export default interface Event {
  name: string;
  desc?: string;
  eType?: string;
  link?: string;
  date?: {
      start: string;
      end: string;
  }
  address?: Address
  position?: google.maps.LatLngLiteral
};