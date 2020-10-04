package com.neighborhood.npulse.utils;

import com.neighborhood.npulse.data.entity.Event;
import com.neighborhood.npulse.data.repository.EventSpecifications;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class FilterBuilder {
    public static Specification<Event> buildFilters(Specification<Event> query,
                                                    String date,
                                                    String firstDate,
                                                    String lastDate,
                                                    List<String> category){
        //Match date
        if(date != null){
            query = query.and(EventSpecifications.matchDate(date));
        }
        //Date Range
        if (firstDate != null && lastDate != null){
            query = query.and(EventSpecifications.dateInRange(firstDate, lastDate));
        }
        //Match Categories if provided
        if (category != null) {
            Specification<Event> catQuery = EventSpecifications.matchCategory(category.get(0));
            for (String cat : category) {
                catQuery = catQuery.or(EventSpecifications.matchCategory(cat));
            }
            query = query.and(catQuery);
        }
        return query;
    }
}
