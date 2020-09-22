import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import { CssBaseline, Box } from '@material-ui/core';
import EventGrid from "./components/EventGrid";
import MapComponent from "./components/MapComponent";

class App extends Component {
  render() {
    return (
      <div id="root">
        <CssBaseline/>
        <Box
         height="100vh"
         display="flex"
         flexDirection="row"
         flexWrap="nowrap"
         overflow="hidden"
        >
          <EventGrid/>
          <MapComponent/>
        </Box>
      </div>
    );
  }
};

export default hot(App);
