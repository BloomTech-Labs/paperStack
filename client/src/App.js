import React, { Component } from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Authorisation from './components/Authorisation';
import RequireAuth from './components/RequireAuthHOC';
import InvoiceList from './components/InvoiceList';
import NotFound from './components/NotFound';
=======
import LandingPage from './components/LandingPage';
import CreateAccount from './components/CreateAccount';
import './App.css';
>>>>>>> 7ed120e862bafcd4593f71684a6491e56b596720

class App extends Component {
  render() {
    return (
<<<<<<< HEAD
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/authorisation" component={Authorisation} />
          <Route path="/preview" component={RequireAuth(InvoiceList)} />
          <Route component={NotFound} />
        </Switch>
      </Router>
=======
      <div className="App">
        {/* <LandingPage /> */}
        <CreateAccount />
      </div>
>>>>>>> 7ed120e862bafcd4593f71684a6491e56b596720
    );
  }
}

export default App;
