import Address from "./Address"

// Only required attribute is the event name
export default interface Event {
  id: number;
  name: string;
  desc?: string;
  eType?: string;
  link: string;
  saved: boolean;
  date: Date;
  address?: Address
  position?: google.maps.LatLngLiteral
};
