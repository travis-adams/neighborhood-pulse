package com.neighborhood.npulse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventController {

    @Autowired
    private DirtyEventRepo dirtyEventRepo;
    @GetMapping("/dummy-event")
    public FullEvent event(){
        return new FullEvent();
    }
    @GetMapping("/actual-events")
    public @ResponseBody Iterable<DirtyEvent> getDirtyEvents(){
        return dirtyEventRepo.findAll();
    }
}
