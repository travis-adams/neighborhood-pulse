package com.neighborhood.npulse.data.repository;

import com.neighborhood.npulse.data.entity.Location;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface LocationRepo extends PagingAndSortingRepository<Location, String>, JpaSpecificationExecutor {

}
