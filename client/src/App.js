import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from './components/pages/commons/Navbar'

// import Home from "./components/pages/Home";
import RegisterProperty from "./components/pages/RegisterProperty";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <BrowserRouter>
        <Switch>
          {/* <Route path="/" component={Home} /> */}
          {/* <Route path="/createownership" component={RegisterProperty} />
           */}
          <Route path="/" component={RegisterProperty} />

        </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
