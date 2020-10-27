export default interface PointOfInterest {
  name: string;
  address?: string;
  desc?: string;
  link: string;
  position: google.maps.LatLngLiteral;
}
