package com.neighborhood.npulse.user;

import com.neighborhood.npulse.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepo extends JpaRepository<AppUser, String> {
    AppUser findByUsername(String username);
}
