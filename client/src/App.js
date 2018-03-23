import React, { Component } from 'react';
import './App.css';
import InvoiceHeader from './invoiceScreen/invoiceHeader/invoiceHeader';

class App extends Component {
  render() {
    return (
      <div className="App">
        <InvoiceHeader />
      </div>
    );
  }
}

export default App;
