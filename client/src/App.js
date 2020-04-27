import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NavBar from './components/pages/commons/Navbar'

// import Home from "./components/pages/Home";
import RegisterProperty from "./components/pages/RegisterProperty";
import PropertyMarket from "./components/pages/PropertyMarket";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <BrowserRouter>
        <Switch>
          <Route path="/" component={RegisterProperty} />
          <Route path="/propertymarket" component={PropertyMarket} />
        </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
