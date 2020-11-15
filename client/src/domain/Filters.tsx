export default interface Filters {
    firstDate?: Date;
    lastDate?: Date;
    categories?: string[];
    userPos?: google.maps.LatLngLiteral;
    radius?: number; // in degress of lat/lng (?)
    limit?: number;
    online?: boolean;
    saved?: boolean;
}
