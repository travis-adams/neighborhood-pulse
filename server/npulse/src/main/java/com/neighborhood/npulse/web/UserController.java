package com.neighborhood.npulse.web;

import com.neighborhood.npulse.data.entity.Event;
import com.neighborhood.npulse.data.entity.SavedEvent;
import com.neighborhood.npulse.data.repository.EventRepo;
import com.neighborhood.npulse.data.repository.SavedEventRepo;
import com.neighborhood.npulse.user.AppUser;
import com.neighborhood.npulse.user.AppUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private AppUserRepo appUserRepo;
    @Autowired
    private SavedEventRepo savedEventRepo;
    @Autowired
    private EventRepo eventRepo;

    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(AppUserRepo appUserRepo, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.appUserRepo = appUserRepo;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @PostMapping("/sign-up")
    public void signUp(@RequestBody AppUser user){
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        appUserRepo.save(user);
    }

    @PostMapping("/save-event")
    public void saveEvent(@RequestParam(value = "event")String event,
                          @RequestParam(value = "user")String user){
        int eventID = Integer.parseInt(event);
        int userID = appUserRepo.findIDByUsername(user);
        SavedEvent newSave = new SavedEvent();
        newSave.setEventID(eventID);
        newSave.setUserID(userID);
        savedEventRepo.save(newSave);
    }

    @GetMapping("/saved")
    public @ResponseBody Iterable<Event> getSavedEvents(@RequestParam(value = "user")String user) {
        int userID = appUserRepo.findIDByUsername(user);//Get the User's ID from the user table
        ArrayList<Integer> eventIDs = savedEventRepo.findSavedEventsIDByUserID(userID);//Get the Event IDS from the join table by user ID
        List<Event> eventList = eventRepo.findEventsByIdIn(eventIDs);//Get all th events by Event ID
        return eventList;
    }
}
