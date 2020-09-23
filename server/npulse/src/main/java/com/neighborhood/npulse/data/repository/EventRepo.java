package com.neighborhood.npulse.data.repository;

import com.neighborhood.npulse.data.entity.Event;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;


/**
 * Provides lists of events by executing SQL queries against our database
 */
public interface EventRepo extends PagingAndSortingRepository<Event, String>, JpaSpecificationExecutor {
    //Search for and return events matching a name parameter
    List<Event> findEventsByName(String name, Pageable pageable);
    //Search for and return events matching a Date parameter
    List<Event> findEventsByDate(String date, Pageable pageable);
    //Search for and return events matching a location parameter
    List<Event> findEventsByLoc(String loc, Pageable pageable);
    //Search for and return events matching a certain category
    @Query("select e from Event e where lower(e.cat) like lower(CONCAT('%',:category,'%'))")
    List<Event> findEventsByCat(@Param("category")String category, Pageable pageable);
}
