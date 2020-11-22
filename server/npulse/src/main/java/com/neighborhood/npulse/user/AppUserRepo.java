package com.neighborhood.npulse.user;

import com.neighborhood.npulse.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AppUserRepo extends JpaRepository<AppUser, String> {
    AppUser findByUsername(String username);
    AppUser findById(int id);
    @Query("select u.id from AppUser u where u.username=:username")
    Integer findIDByUsername(String username);
    List<AppUser> findAppUsersByGroupID(Integer groupID);


}
