package com.neighborhood.npulse.web;

import com.neighborhood.npulse.data.entity.Comment;
import com.neighborhood.npulse.data.repository.CommentRepo;
import com.neighborhood.npulse.user.AppUser;
import com.neighborhood.npulse.user.AppUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/comment")
public class CommentController {

    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private AppUserRepo userRepo;

    @GetMapping("")
    public @ResponseBody Iterable<Comment> getCommentByEvent(@RequestParam(value = "event")String event) {
        int eventID = Integer.parseInt(event);
        return commentRepo.findCommentByEventID(eventID);
    }

    @GetMapping("all")
    public @ResponseBody Iterable<Comment> getCommentsByEvents(@RequestParam(value = "event") List<String> ids) {
        List<Integer> eventIDs= new ArrayList<>();
        for (String id : ids) {
            eventIDs.add(Integer.parseInt(id));
        }

        return commentRepo.findCommentsByEventIDIn(eventIDs);
    }

    @PostMapping("submit")
    @ResponseStatus(HttpStatus.OK)
    public Comment submitComment(@RequestBody Comment comment) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        comment.setTimestamp(formatter.format(new Date()));
        AppUser user = userRepo.findByUsername(comment.getUsername());
        comment.setUserID(user.getId());
        if(!user.getLastName().isEmpty() && !user.getFirstName().isEmpty()) {
            comment.setUsername(user.getFirstName() + " " + user.getLastName());
        }
        commentRepo.save(comment);
        return comment;
    }

}
