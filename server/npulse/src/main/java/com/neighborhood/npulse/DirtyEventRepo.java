package com.neighborhood.npulse;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DirtyEventRepo extends JpaRepository<DirtyEvent, String> {

}
