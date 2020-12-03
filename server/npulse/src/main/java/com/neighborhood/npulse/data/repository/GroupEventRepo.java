package com.neighborhood.npulse.data.repository;

import com.neighborhood.npulse.data.entity.GroupEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface GroupEventRepo extends JpaRepository<GroupEvent, Integer> {
    @Transactional
    void deleteGroupEventByEventIDAndGroupID(int eventID, int groupID);

    List<GroupEvent> findGroupEventsByGroupID(int groupID);
    @Query("select e.eventID from GroupEvent e where e.groupID=:groupID")
    List<Integer> findEventIDsByGroupID(int groupID);

}
