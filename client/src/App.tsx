import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import { CssBaseline } from "@material-ui/core";
import MainPage from "./components/MainPage";

class App extends Component {
  render() {
    return (
      <div id="root">
        <CssBaseline/>
        <MainPage/>
      </div>
    );
  }
}

export default hot(App);
