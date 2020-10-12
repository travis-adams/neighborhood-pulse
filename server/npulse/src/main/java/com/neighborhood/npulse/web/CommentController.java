package com.neighborhood.npulse.web;

import com.neighborhood.npulse.data.entity.Comment;
import com.neighborhood.npulse.data.repository.CommentRepo;
import com.neighborhood.npulse.user.AppUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;

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

    @PostMapping("submit")
    @ResponseStatus(HttpStatus.OK)
    public Comment submitComment(@RequestBody Comment comment) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        comment.setTimestamp(formatter.format(new Date()));
        comment.setUserID(userRepo.findIDByUsername(comment.getUsername()));
        commentRepo.save(comment);
        return comment;
    }

}
