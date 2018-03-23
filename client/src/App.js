import React, { Component } from "react";
import "./App.css";

import InvoiceScreen from "./invoiceScreen/InvoiceScreen";

class App extends Component {
  render() {
    return (
      <div className="App">
        <InvoiceScreen />
      </div>
    );
  }
}

export default App;
