package com.neighborhood.npulse.data.repository;

import com.neighborhood.npulse.data.entity.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CommentRepo extends CrudRepository<Comment, Integer> {

    List<Comment> findCommentByEventID(int eventID);
    List<Comment> findCommentsByEventIDIn(List<Integer> eventIDs);
}
