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
    //Return all the categories that can be filtered on
    @Query("select DISTINCT e.cat from Event e")
    List<String> findCats();
}
