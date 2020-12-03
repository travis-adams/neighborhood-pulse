package com.neighborhood.npulse.web;


import com.neighborhood.npulse.data.entity.Event;
import com.neighborhood.npulse.data.entity.Team;
import com.neighborhood.npulse.data.entity.GroupEvent;
import com.neighborhood.npulse.data.repository.EventRepo;
import com.neighborhood.npulse.data.repository.EventSpecifications;
import com.neighborhood.npulse.data.repository.GroupEventRepo;
import com.neighborhood.npulse.data.repository.TeamRepo;
import com.neighborhood.npulse.user.AppUser;
import com.neighborhood.npulse.user.AppUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private GroupEventRepo groupEventRepo;
    @Autowired
    private AppUserRepo appUserRepo;
    @Autowired
    private TeamRepo groupRepo;
    @Autowired
    private EventRepo eventRepo;

    @GetMapping("/groups")
    public @ResponseBody Iterable<Team> getGroups(){
        return groupRepo.findAll();
    }

    @PostMapping("/create")
    public @ResponseBody Team createGroup(@RequestParam(value = "name")String name){
        Team newGroup = new Team();
        newGroup.setGroupName(name);
        groupRepo.save(newGroup);
        return newGroup;
    }

    @GetMapping("/members")
    public @ResponseBody Iterable<AppUser> getMemberInfo(@RequestParam(value = "group")String group) {
        Integer groupID = Integer.parseInt(group);
        List<AppUser> users =  appUserRepo.findAppUsersByGroupID(groupID);
        for (AppUser user : users){
            user.setPassword("No");
        }
        return users;
    }

    @PostMapping("/save")
    public void saveEvent(@RequestParam(value = "event")String event,
                          @RequestParam(value = "group")String group){
        int eventID = Integer.parseInt(event);
        int groupID = Integer.parseInt(group);
        GroupEvent newSave = new GroupEvent();
        newSave.setEventID(eventID);
        newSave.setGroupID(groupID);
        groupEventRepo.save(newSave);
    }
    @GetMapping("/unsave")
    public void deleteEvent(@RequestParam(value = "event")String event,
                            @RequestParam(value = "group")String group){
        int eventID = Integer.parseInt(event);
        int groupID =Integer.parseInt(group);
        groupEventRepo.deleteGroupEventByEventIDAndGroupID(eventID, groupID);
    }

    @GetMapping("/events")
    public @ResponseBody Iterable<Event> getGroupSavedEvents(@RequestParam(value = "group") String group){
        int groupID = Integer.parseInt(group);
        List<Integer> eventIDs = groupEventRepo.findEventIDsByGroupID(groupID);
        Specification<Event> query = EventSpecifications.idIn(eventIDs);
        return eventRepo.findAll(query);
    }

}
