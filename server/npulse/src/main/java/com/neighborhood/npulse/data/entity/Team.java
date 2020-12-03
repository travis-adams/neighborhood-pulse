package com.neighborhood.npulse.data.entity;

import javax.persistence.*;

@Entity
@Table(name = "teams")
public class Team {
    @Id
    @Column(name = "group_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer groupID;
    @Column(name = "group_name")
    private String groupName;

    public Integer getGroupID() {
        return groupID;
    }

    public void setGroupID(Integer groupID) {
        this.groupID = groupID;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }
}
