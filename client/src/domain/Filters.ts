export default interface Filters {
    firstDate?: Date;
    lastDate?: Date;
    categories?: string[];
    searchPos?: google.maps.LatLng;
    radius?: number; // in degress of lat/lng (?)
    limit?: number;
    online?: boolean;
}
