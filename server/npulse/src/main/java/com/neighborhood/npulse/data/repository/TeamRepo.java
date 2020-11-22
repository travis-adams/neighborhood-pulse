package com.neighborhood.npulse.data.repository;

import com.neighborhood.npulse.data.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeamRepo extends JpaRepository<Team, Integer> {

    @Query("select g.groupName from Team g where g.groupID=:id")
    String getGroupName(Integer id);
}
