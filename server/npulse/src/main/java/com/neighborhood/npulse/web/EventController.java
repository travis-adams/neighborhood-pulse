package com.neighborhood.npulse.web;

import com.neighborhood.npulse.data.repository.EventRepo;
import com.neighborhood.npulse.data.entity.Event;
import com.neighborhood.npulse.data.repository.EventSpecifications;
import com.neighborhood.npulse.utils.FilterBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;
import java.util.*;


/**
 * RESTful controller for serving Events by varying criteria
 * endpoint at /events
 */
@CrossOrigin
@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    private EventRepo eventRepo;//Repository Responsible for providing us events

    @GetMapping("")
    //Return events with no filtering
    public @ResponseBody Iterable<Event> getEvents(@RequestParam(value="limit", defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0,Integer.parseInt(limit));
        return eventRepo.findAll(eventLimit);
    }

    @GetMapping("/online")
    //Return only events that are taking place online
    public @ResponseBody Iterable<Event> getEventsOnline(@RequestParam(value="limit", defaultValue = "10")String limit,
                                                         @RequestParam(value="name", required = false)String name,
                                                         @RequestParam(value = "date", required = false)String date,
                                                         @RequestParam(value = "firstDate", required = false)String firstDate,
                                                         @RequestParam(value = "lastDate", required = false)String lastDate,
                                                         @RequestParam(value = "category", required = false)List<String> category){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        Specification<Event> query =  EventSpecifications.matchLoc("nline");
        query = query.or(EventSpecifications.matchLoc("web"));
        query = query.or(EventSpecifications.matchLoc("Web"));
        query = FilterBuilder.buildFilters(query,name, date,firstDate,lastDate,category);
        return eventRepo.findAll(query,eventLimit);
    }


    @GetMapping("/categories")
    public @ResponseBody Iterable<String> getCategories(){
        return eventRepo.findCats();
    }

    @GetMapping("/filter")
    public @ResponseBody Iterable<Event> getEventsFiltered(@RequestParam(value = "date", required = false)String date,
                                                       @RequestParam(value = "name", required = false)String name,
                                                       @RequestParam(value = "firstDate", required = false)String firstDate,
                                                       @RequestParam(value = "lastDate", required = false)String lastDate,
                                                       @RequestParam(value = "category", required = false)List<String> category,
                                                       @RequestParam(value = "lat")String lat,
                                                       @RequestParam(value = "lng")String lng,
                                                       @RequestParam(value = "radius", defaultValue = "1")String radius,
                                                       @RequestParam(value = "limit", defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0,Integer.parseInt(limit));

        Specification<Event> query;
        //Match Location
        Double latitude = Double.parseDouble(lat);
        Double longitude = Double.parseDouble(lng);
        Double rad = Double.parseDouble(radius);
        query = EventSpecifications.nearLat(latitude, rad);
        query = query.and(EventSpecifications.nearLng(longitude, rad));

        query = FilterBuilder.buildFilters(query,name,date,firstDate,lastDate,category);

        return eventRepo.findAll(query, eventLimit);
    }

}
