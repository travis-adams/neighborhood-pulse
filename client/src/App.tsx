import React, {Component} from "react";
import {hot} from "react-hot-loader/root";
import "./App.css";
import MapComponent from "./MapComponent";

class App extends Component {
  render() {
    return (
      <div id="app" className="App">
        <MapComponent/>
      </div>
    );
  }
}

export default hot(App);
