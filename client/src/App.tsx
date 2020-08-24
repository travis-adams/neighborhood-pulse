import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import { MapComponent } from "./components/MapComponent";

class App extends Component {
  render() {
    return (
      <div>
        <MapComponent/>
      </div>
    );
  }
};

export default hot(App);
