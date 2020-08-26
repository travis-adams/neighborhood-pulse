package com.neighborhood.npulse;

import javax.persistence.*;


//Deprecated
@Entity
@Table(name = "new_table")
public class DirtyEvent {
    @Id
    private String name;
    private String date;
    private String desc;
    private String location;

    public DirtyEvent(){

    }

    public DirtyEvent(String name, String Date, String Desc, String Location){
        this.date = Date;
        this.desc = Desc;
        this.name = name;
        this.location = Location;
    }

    public String getName() {
        return name;
    }

    public String getDate() {
        return date;
    }

    public String getDesc() {
        return desc;
    }

    public String getLocation() {
        return location;
    }

    public void setDate(String date) {
        date = date;
    }

    public void setDesc(String desc) {
        desc = desc;
    }

    public void setLocation(String location) {
        location = location;
    }

    public void setName(String name) {
        name = name;
    }
}
