package com.neighborhood.npulse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventController {
    @Autowired
    private EventRepo eventRepo;

    @GetMapping("/events")
    public @ResponseBody Iterable<Event> getEvents(@RequestParam(value="limit", defaultValue = "10")String limit){
        Pageable recordLimit = PageRequest.of(0,Integer.parseInt(limit));
        return eventRepo.findAll(recordLimit);
    }
    @GetMapping("/event-by-name")
    public @ResponseBody Iterable<Event> getEventsByName(@RequestParam(value="name", defaultValue = "none")String name){
        return eventRepo.findEventsByName(name);
    }

    @GetMapping("/event-by-date")
    public @ResponseBody Iterable<Event> getEventsByDate(@RequestParam(value="date", defaultValue = "none")String date){
        return eventRepo.findEventsByDate(date);
    }
}
