package com.neighborhood.npulse;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
//Deprecated
public interface DirtyEventRepo extends JpaRepository<DirtyEvent, String> {
    List<DirtyEvent> findDirtyEventsByName(String name);
}
