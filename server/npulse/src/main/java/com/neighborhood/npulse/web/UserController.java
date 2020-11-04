package com.neighborhood.npulse.web;

import com.neighborhood.npulse.data.entity.Event;
import com.neighborhood.npulse.data.entity.SavedEvent;
import com.neighborhood.npulse.data.repository.EventRepo;
import com.neighborhood.npulse.data.repository.EventSpecifications;
import com.neighborhood.npulse.data.repository.SavedEventRepo;
import com.neighborhood.npulse.user.AppUser;
import com.neighborhood.npulse.user.AppUserRepo;
import com.neighborhood.npulse.utils.FilterBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin
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

    @PostMapping("/save")
    public void saveEvent(@RequestParam(value = "event")String event,
                          @RequestParam(value = "user")String user){
        int eventID = Integer.parseInt(event);
        int userID = appUserRepo.findIDByUsername(user);
        SavedEvent newSave = new SavedEvent();
        newSave.setEventID(eventID);
        newSave.setUserID(userID);
        savedEventRepo.save(newSave);
    }

    /**
     * Should be a DeleteMapping
     * But I couldn't get the CORS configuration to allow the options request yet
     * So for now it is a @GetMapping, since AXIOS is dumb
     */
    @GetMapping("/unsave")
    public void deleteEvent(@RequestParam(value = "event")String event,
                            @RequestParam(value = "user")String user){
        int eventID = Integer.parseInt(event);
        int userID = appUserRepo.findIDByUsername(user);
        savedEventRepo.deleteSavedEventByUserIDAndEventID(userID, eventID);
    }

    /**
     * Returns events saved by a user and based opn filters provided
     * @param user Required
     * @param date Not required
     * @param name Not Required
     * @param firstDate Not Required
     * @param lastDate Not Required
     * @param category Not Required
     * @param lat Not Required
     * @param lng Not Required
     * @param radius Not Required
     * @param limit Not Required
     * @return
     */
    @GetMapping("/saved")
    public @ResponseBody Iterable<Event> getSavedEvents(@RequestParam(value = "user")String user,
                                                        @RequestParam(value = "date", required = false)String date,
                                                        @RequestParam(value = "name", required = false)String name,
                                                        @RequestParam(value = "firstDate", required = false)String firstDate,
                                                        @RequestParam(value = "lastDate", required = false)String lastDate,
                                                        @RequestParam(value = "category", required = false)List<String> category,
                                                        @RequestParam(value = "lat", required = false)String lat,
                                                        @RequestParam(value = "lng", required = false)String lng,
                                                        @RequestParam(value = "radius", defaultValue = "1")String radius,
                                                        @RequestParam(value = "limit", defaultValue = "10")String limit,
                                                        @RequestParam(value = "online", defaultValue = "0")String online) {
        int userID = appUserRepo.findIDByUsername(user);//Get the User's ID from the user table
        ArrayList<Integer> eventIDs = savedEventRepo.findSavedEventsIDByUserID(userID);//Get the Event IDS from the join table by user ID
        Specification<Event> query = EventSpecifications.idIn(eventIDs);//By id contained in list
        if(lat != null && lng != null) {
            query = query.and(FilterBuilder.latLngFilter(lat, lng, radius));
        }
        if(online.equals("1")) {
            query = query.and(FilterBuilder.onlineFilter());
        }
        query = FilterBuilder.buildFilters(query,name,date,firstDate,lastDate,category);
        List<Event> eventList = eventRepo.findAll(query);//Get all th events by Event ID
        return eventList;
    }


}
