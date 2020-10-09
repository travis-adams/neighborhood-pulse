import Event from "../domain/Event"
import Address from "../domain/Address"

export const DummyEvents: Event[] = [
  {
    name: "Coffee and Banking",
    desc: "Get some caffeine AND learn how to manage your money!",
    eType:  "Community Event",
    link: "https://www.capitalone.com",
    saved: false,
    id: 1111,
    date: {
      start: "8-28-2020",
      end: "8-9-2020"
    },
    address: {
      line1: "3393 Peachtree Rd NE",
      line2: "#3078A",
      city: "Atlanta",
      state: "GA",
      zipCode: "30326"
    } as Address,
    position: {
      lat: 33.8463,
      lng: -84.3621
    } as google.maps.LatLngLiteral
  },
  {
    name: "Student Banking Seminar",
    desc: "Scared of student loans? So are we!",
    saved: false,
    id: 1234,
    position: {
      lat: 33.7739,
      lng: -84.3988
    } as google.maps.LatLngLiteral
  }
];
