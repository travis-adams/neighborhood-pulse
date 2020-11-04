package com.neighborhood.npulse.web;


import com.neighborhood.npulse.data.entity.Event;
import com.neighborhood.npulse.data.entity.Location;
import com.neighborhood.npulse.data.repository.LocationRepo;
import com.neighborhood.npulse.utils.FilterBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/locations")
public class LocationController {
    @Autowired
    private LocationRepo locationRepo;

    @GetMapping("/filter")
    public @ResponseBody Iterable<Location> getLocations(@RequestParam(value = "name", required = false)String name,
                                    @RequestParam(value = "category", required = false) List<String> category,
                                    @RequestParam(value = "lat")String lat,
                                    @RequestParam(value = "lng")String lng,
                                    @RequestParam(value = "radius", defaultValue = "1")String radius,
                                    @RequestParam(value = "limit", defaultValue = "10")String limit){
        Pageable locationLimit = PageRequest.of(0,Integer.parseInt(limit));
        //Near Location
        Specification<Event> query = FilterBuilder.latLngFilter(lat, lng, radius);
        //Other Filters
        query = FilterBuilder.buildFilters(query,name,null,null,null,category);
        return locationRepo.findAll(query, locationLimit);
    }
}
