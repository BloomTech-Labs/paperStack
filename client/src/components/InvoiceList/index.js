import React, { Component } from 'react';
import Navigation from '../Navigation';

class InvoiceList extends Component {
  render() {
    return (
      <div><Navigation />
        <div>Invoice Cards Display a preview of the Invoice, the Invoice Number, and a Timestamp</div>
      </div>
    );
  }
}

export default InvoiceList;
