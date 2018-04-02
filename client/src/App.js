import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import Authorisation from './components/Authorisation';
import RequireAuth from './components/RequireAuthHOC';
import InvoiceList from './components/InvoiceList';
import NotFound from './components/NotFound';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/authorisation" component={Authorisation} />
          <Route path="/preview" component={RequireAuth(InvoiceList)} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
