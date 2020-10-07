package com.neighborhood.npulse.data.entity;


import javax.persistence.*;

/**
 * Represents a saved Event
 * User id | Event id
 */

@Entity
@Table(name = "user_events")
public class SavedEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;
    @Column(name = "user_id")
    private int userID;
    @Column(name = "event_id")
    private int eventID;

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getUserID() {
        return userID;
    }
    public void setUserID(int userID) {
        this.userID = userID;
    }
    public int getEventID() {
        return eventID;
    }
    public void setEventID(int eventID) {
        this.eventID = eventID;
    }
}
