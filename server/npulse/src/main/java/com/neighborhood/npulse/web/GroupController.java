package com.neighborhood.npulse.web;


import com.neighborhood.npulse.data.entity.GroupEvent;
import com.neighborhood.npulse.data.entity.SavedEvent;
import com.neighborhood.npulse.data.repository.GroupEventRepo;
import com.neighborhood.npulse.user.AppUserRepo;
import com.neighborhood.npulse.user.UserInfo;
import com.neighborhood.npulse.user.UserInfoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/group")
public class GroupController {

    @Autowired
    private GroupEventRepo groupEventRepo;
    @Autowired
    private AppUserRepo appUserRepo;
    @Autowired
    private UserInfoRepo userInfoRepo;

    @GetMapping("/members")
    public @ResponseBody Iterable<UserInfo> getMemberInfo(@RequestParam(value = "group")String group) {
        Integer groupID = Integer.parseInt(group);
        return userInfoRepo.findUserInfosByGroupID(groupID);
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
}
