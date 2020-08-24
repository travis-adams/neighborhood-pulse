package com.neighborhood.npulse;

import java.util.HashMap;
import java.util.Map;

public class FullEvent {
    private final String name;
    private final String desc;
    private final String type;
    private final String link;
    private Map<String,String> date;
    private Map<String,String> address;
    private final double latitude;
    private final double longitude;

    public FullEvent(){
        this.name = "Coffee and Banking";
        this.desc = "Get some caffeine AND learn how to manage your money!";
        this.type = "Community Event";
        this.link = "https://www.capitalone.com";
        this.date = new HashMap<>();
        this.date.put("start","2020-08-21T16:30:00");
        this.date.put("end","2020-08-21T18:30:00");
        this.address = new HashMap<>();
        this.address.put("line1","3393 Peachtree Rd NE");
        this.address.put("line2", "#3078A");
        this.address.put("city", "Atlanta");
        this.address.put("state", "GA");
        this.address.put("zipCode", "30326");
        this.latitude = 33.8463;
        this.longitude =  -84.3621;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }

    public String getType() {
        return type;
    }

    public String getLink() {
        return link;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public Map<String, String> getAddress() {
        return address;
    }

    public Map<String, String> getDate() {
        return date;
    }
}
