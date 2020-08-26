package com.neighborhood.npulse;

import org.springframework.lang.Nullable;

import javax.persistence.Table;
import javax.persistence.Entity;
import javax.persistence.Id;
@Entity
@Table(name = "sprint_one")
public class Event {
    @Id
    private String name;
    private String date;
    private String desc;
    private String loc;
    private String addr;
    private String cat;
    private String time;
    private String link;
    @Nullable
    private Double latitude;
    @Nullable
    private Double longitude;

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
