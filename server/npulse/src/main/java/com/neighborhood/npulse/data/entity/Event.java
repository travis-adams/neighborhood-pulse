package com.neighborhood.npulse.data.entity;

import org.springframework.lang.Nullable;

import javax.annotation.sql.DataSourceDefinition;
import javax.persistence.*;
import java.util.Date;

/**
 * Represents an entry in the sprint_one table
 * Stores the data for a single event
 */
@Entity
@Table(name = "sprint_two")
public class Event {
    @Id
    @Column(name="id")
    private int id;
    @Column(name="name")
    private String name;
    @Column(name="date")
    //@Convert(converter = DateConverter.class)
    private String date;
    @Column(name="desc")
    private String desc;
    @Column(name="loc")
    private String loc;
    @Column(name="addr")
    private String addr;
    @Column(name="cat")
    private String cat;
    @Column(name="time")
    private String time;
    @Column(name="link")
    private String link;
    @Nullable
    @Column(name="latitude")
    private Double latitude;
    @Nullable
    @Column(name="longitude")
    private Double longitude;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLink() {
        return link;
    }

    public String getTime() {
        return time;
    }

    public String getCat() {
        return cat;
    }

    public String getAddr() {
        return addr;
    }

    public String getLoc() {
        return loc;
    }

    public String getDesc() {
        return desc;
    }

    public String getDate() {
        return date;
    }

    public String getName() {
        return name;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public void setLoc(String loc) {
        this.loc = loc;
    }

    public void setAddr(String addr) {
        this.addr = addr;
    }

    public void setCat(String cat) {
        this.cat = cat;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public void setLatitude(Double latitude) {
        this.latitude = (latitude == null) ? 0.0 : latitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = (longitude == null) ? 0.0 : longitude;
    }
}
