// Only required attribute is the event name
export default interface Event {
  id?: number;
  name: string;
  desc?: string;
  link: string;
  saved?: boolean;
  date: Date;
  category?: string;
  location: string;
  address?: string;
  position?: google.maps.LatLng;
}
