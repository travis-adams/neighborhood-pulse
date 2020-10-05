package com.neighborhood.npulse.data.repository;

import com.neighborhood.npulse.data.entity.SavedEvent;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.ArrayList;

public interface SavedEventRepo extends CrudRepository<SavedEvent, Integer> {

    @Query("select e.eventID from SavedEvent e where e.userID=:user")
    ArrayList<Integer> findSavedEventsIDByUserID(int user);
}
