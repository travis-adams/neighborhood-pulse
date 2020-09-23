package com.neighborhood.npulse.web;

import com.neighborhood.npulse.data.repository.EventRepo;
import com.neighborhood.npulse.data.entity.Event;
import com.neighborhood.npulse.data.repository.EventSpecifications;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

import javax.persistence.criteria.CriteriaBuilder;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * RESTful controller for serving Events by varying criteria
 * endpoint at /events
 */
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


    /*Will Remove Soon
    @GetMapping("/name")
    //Search for and return events matching name criteria
    public @ResponseBody Iterable<Event> getEventsByName(@RequestParam(value="name", defaultValue = "none")String name,
                                                         @RequestParam(value="limit",defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByName(name, eventLimit);
    }*/


    /*Will remove soon
    @GetMapping("/date")
    //Search for and return events matching Date criteria
    public @ResponseBody Iterable<Event> getEventsByDate(@RequestParam(value="date", defaultValue = "none")String date,
                                                         @RequestParam(value="limit",defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByDate(date, eventLimit);
    }*/

    @GetMapping("/online")
    //Return only events that are taking place online
    public @ResponseBody Iterable<Event> getEventsOnline(@RequestParam(value="limit", defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByLoc("Online", eventLimit);
    }

    /* Will Be Removed Soon
    @GetMapping("/category")
    //Return only events relevant to a certain category(s)

    public @ResponseBody Iterable<Event> getEventsByCategroy(@RequestParam(value = "limit",defaultValue = "10")String limit,
                                                             @RequestParam(value = "category")List<String> category){
        Pageable eventLimit = PageRequest.of(0,Integer.parseInt(limit));
        Set<Event> eventSet = new HashSet<>();
        for(String cat : category) {
            eventSet.addAll(eventRepo.findEventsByCat(cat, eventLimit));
        }
        List<Event> eventList = new ArrayList<>(eventSet);
        Collections.shuffle(eventList);
        return eventList;
    }*/

    @GetMapping("/filter")
    public @ResponseBody Iterable<Event> getEventsTest(@RequestParam(value = "date", required = false)String date,
                                                       @RequestParam(value = "category", required = false)List<String> category,
                                                       @RequestParam(value = "lat", required = false)String lat,
                                                       @RequestParam(value = "lng", required = false)String lng,
                                                       @RequestParam(value = "radius", defaultValue = "1")String radius){
        Pageable eventLimit = PageRequest.of(0,10);
        //Match date
        Specification<Event> query;
        if(date != null){
            query = EventSpecifications.matchDate(date);
        } else {
            String currentDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
            query = EventSpecifications.matchDate(currentDate);
        }
        //Match Location if provided
        if (lat != null && lng != null) {
            Double latitude = Double.parseDouble(lat);
            Double longitude = Double.parseDouble(lng);
            Double rad = Double.parseDouble(radius);
            query = query.and(EventSpecifications.nearLat(latitude, rad));
            query = query.and(EventSpecifications.nearLng(longitude, rad));
        }
        //Match Categories if provided
        if (category != null) {
            Specification<Event> catQuery = EventSpecifications.matchCategory(category.get(0));
            for (String cat : category) {
                catQuery = catQuery.or(EventSpecifications.matchCategory(cat));
            }
            query = query.and(catQuery);
        }

        return eventRepo.findAll(query);
    }
}
