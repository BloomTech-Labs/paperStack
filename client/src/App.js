import React, { Component } from "react";
import "./App.css";

import InvoiceScreen from "./components/invoiceScreen/";
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
