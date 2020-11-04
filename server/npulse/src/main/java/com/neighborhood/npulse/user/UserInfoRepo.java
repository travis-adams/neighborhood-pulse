package com.neighborhood.npulse.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserInfoRepo extends JpaRepository<UserInfo, Integer> {

    UserInfo findUserInfoById(Integer id);
    List<UserInfo> findUserInfosByGroupID(Integer groupID);
}
