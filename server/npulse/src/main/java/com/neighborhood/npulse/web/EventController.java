package com.neighborhood.npulse.web;

import com.neighborhood.npulse.data.repository.EventRepo;
import com.neighborhood.npulse.data.entity.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;


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
    @GetMapping("/name")
    //Search for and return events matching name criteria
    public @ResponseBody Iterable<Event> getEventsByName(@RequestParam(value="name", defaultValue = "none")String name,
                                                         @RequestParam(value="limit",defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByName(name, eventLimit);
    }

    @GetMapping("/date")
    //Search for and return events matching Data criteria
    public @ResponseBody Iterable<Event> getEventsByDate(@RequestParam(value="date", defaultValue = "none")String date,
                                                         @RequestParam(value="limit",defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByDate(date, eventLimit);
    }

    @GetMapping("/online")
    //Return only events that are taking place online
    public @ResponseBody Iterable<Event> getEventsOnline(@RequestParam(value="limit", defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByLoc("Online", eventLimit);
    }
}
