package com.neighborhood.npulse.user;

import com.neighborhood.npulse.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AppUserRepo extends JpaRepository<AppUser, String> {
    AppUser findByUsername(String username);

    @Query("select u.id from AppUser u where u.username=:username")
    Integer findIDByUsername(String username);

}
