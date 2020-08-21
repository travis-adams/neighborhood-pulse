package com.neighborhood.npulse;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DirtyEventRepo extends CrudRepository<DirtyEvent, Long> {

}
