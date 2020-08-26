package com.neighborhood.npulse;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface EventRepo extends PagingAndSortingRepository<Event, String> {
    List<Event> findEventsByName(String name, Pageable pageable);
    List<Event> findEventsByDate(String date, Pageable pageable);
    List<Event> findEventsByLoc(String loc, Pageable pageable);
}
