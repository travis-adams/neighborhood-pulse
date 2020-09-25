// Only required attribute is the user's position (lat and lng)
export default interface Filters {
    date?: string; // yyyy-mm-dd
    categories?: string[];
    userPos: google.maps.LatLngLiteral;
    radius?: number; // in degress of lat/lng (?)
    limit?: number;
    online?: boolean;
};
