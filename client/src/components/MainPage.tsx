import React, { FC } from 'react';
import { Divider, Box } from "@material-ui/core";
import EventGrid from "./EventGrid";
import MapComponent from "./MapComponent";
import NavBar from "./NavBar";
import useStyles from "../css";

const MainPage: FC = () => {
    const classes = useStyles();
    return (
      <div className={classes.flexColumn}>
        <NavBar/>
        <Divider/>
        <Box className={classes.mainBox}>
          <EventGrid/>
          <MapComponent/>
        </Box>
      </div>
    );
};

export default MainPage;
