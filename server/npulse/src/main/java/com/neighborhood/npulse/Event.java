package com.neighborhood.npulse;

public class Event {
    private final String eventName;
    private final String eventDate;
    private final String eventDescription;
    private final String eventLocation;

    public Event(String eventName, String eventDate, String eventDescription, String eventLocation){
        this.eventDate = eventDate;
        this.eventDescription = eventDescription;
        this.eventLocation = eventLocation;
        this.eventName = eventName;
    }

    public String getEventLocation() {
        return eventLocation;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public String getEventDate() {
        return eventDate;
    }

    public String getEventName() {
        return eventName;
    }
}
