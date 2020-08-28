package com.neighborhood.npulse.web;

import com.neighborhood.npulse.data.repository.EventRepo;
import com.neighborhood.npulse.data.entity.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    private EventRepo eventRepo;

    @GetMapping("")
    public @ResponseBody Iterable<Event> getEvents(@RequestParam(value="limit", defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0,Integer.parseInt(limit));
        return eventRepo.findAll(eventLimit);
    }
    @GetMapping("/name")
    public @ResponseBody Iterable<Event> getEventsByName(@RequestParam(value="name", defaultValue = "none")String name,
                                                         @RequestParam(value="limit",defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByName(name, eventLimit);
    }

    @GetMapping("/date")
    public @ResponseBody Iterable<Event> getEventsByDate(@RequestParam(value="date", defaultValue = "none")String date,
                                                         @RequestParam(value="limit",defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByDate(date, eventLimit);
    }

    @GetMapping("/online")
    public @ResponseBody Iterable<Event> getEventsOnline(@RequestParam(value="limit", defaultValue = "10")String limit){
        Pageable eventLimit = PageRequest.of(0, Integer.parseInt(limit));
        return eventRepo.findEventsByLoc("Online", eventLimit);
    }
}
