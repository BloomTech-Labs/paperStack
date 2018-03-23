import React, { Component } from 'react';
import './App.css';
import InvoiceHeader from './invoiceScreen/invoiceHeader/invoiceHeader';
import InvoiceFooter from './invoiceScreen/invoiceItems/InvoiceFooter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <InvoiceHeader />
        <InvoiceFooter />
      </div>
    );
  }
}

export default App;
