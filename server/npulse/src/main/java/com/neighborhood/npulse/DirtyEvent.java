package com.neighborhood.npulse;

import javax.persistence.*;

@Entity
@Table(name = "new_table")
public class DirtyEvent {
    @Id
    private String Name;
    private String Date;
    private String Desc;
    private String Location;

    public DirtyEvent(){

    }

    public DirtyEvent(String Name, String Date, String Desc, String Location){
        this.Date = Date;
        this.Desc = Desc;
        this.Name = Name;
        this.Location = Location;
    }

    public String getName() {
        return Name;
    }

    public String getDate() {
        return Date;
    }

    public String getDesc() {
        return Desc;
    }

    public String getLocation() {
        return Location;
    }

    public void setDate(String date) {
        Date = date;
    }

    public void setDesc(String desc) {
        Desc = desc;
    }

    public void setLocation(String location) {
        Location = location;
    }

    public void setName(String name) {
        Name = name;
    }
}
