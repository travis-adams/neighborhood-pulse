package com.neighborhood.npulse;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepo extends JpaRepository<Event, String> {
    List<Event> findEventsByName(String name);
    List<Event> findEventsByDate(String date);
}
