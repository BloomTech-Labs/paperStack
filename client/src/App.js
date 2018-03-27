import React, { Component } from "react";
import "./App.css";

import InvoiceScreen from "./invoiceScreen/InvoiceScreen";
import 'react-datepicker/dist/react-datepicker.css';

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
