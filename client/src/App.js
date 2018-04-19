import React, { Component } from "react";
import { HashRouter } from "react-router-dom";
import { Route, Switch } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import Authorisation from "./components/Authorisation";
import RequireAuth from "./components/RequireAuthHOC";
import InvoiceList from "./components/InvoiceList";
import Billing from "./components/Billing";
import Settings from "./components/Settings";
import NotFound from "./components/NotFound";
import InvoiceScreen from "./components/invoiceScreen";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/authorisation" component={Authorisation} />
          <Route path="/invoices" component={RequireAuth(InvoiceList)} />
          <Route path="/new" component={InvoiceScreen} />
          <Route path="/billing" component={Billing} />
          <Route path="/settings" component={RequireAuth(Settings)} />
          <Route component={NotFound} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
