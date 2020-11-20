-- Capital One Neighborhood Pulse Application

DROP DATABASE IF EXISTS pulse;
CREATE DATABASE IF NOT EXISTS pulse;
USE pulse;

-- User Table
DROP TABLE IF EXISTS User;
CREATE TABLE User(
    id VARCHAR(40) NOT NULL,
    username VARCHAR(40) NOT NULL,
    password VARCHAR(40) NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    team_id VARCHAR(40) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (team_id) REFERENCES Team(id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Team Table
DROP TABLE IF EXISTS Team;
CREATE TABLE Team(
    id VARCHAR(40) NOT NULL,
	name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Event Table
DROP TABLE IF EXISTS Event;
CREATE TABLE Event(
     VARCHAR(40) NOT NULL,
	name VARCHAR(40) NOT NULL,
    PRIMARY KEY (id),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Comment Table
DROP TABLE IF EXISTS Comment;
CREATE TABLE Comment(
    comment_id VARCHAR(40) NOT NULL,
    user_id VARCHAR(40) NOT NULL,
    event_id VARCHAR(40) NOT NULL,
    text VARCHAR(40) NOT NULL,
    timestamp VARCHAR(40) NOT NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (user_id) REFERENCES Event(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;