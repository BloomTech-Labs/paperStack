import React, { Component } from "react";
import { Button } from "reactstrap";

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable from "./invoiceItems/InvoiceTable";
import InvoiceFooter from "./invoiceFooter/InvoiceFooter";

import "react-datepicker/dist/react-datepicker.css";

export default class InvoiceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subtotal: 1300,
      tax: 0,
      discount: 0,
      deposit: 0,
      grandTotal: 0,
      amountDue: 1500,
      shipping: 0
    };
  }

  render() {
    let calculateGrandTotal = (((this.state.subtotal - this.state.discount) + this.state.tax) + this.state.shipping);
    let calculateAmountDue = this.state.grandTotal - this.state.deposit;

    return (
      <div className="invoiceForm">
      {this.state.subtotal}
        <InvoiceHeader amountDue={this.state.amountDue} /> {/* {this.state.amountDue} */}
        <hr />
        <InvoiceItemsTable subtotal={this.state.subtotal} />
        <hr />
        <InvoiceFooter />
        <div style={{ width: "90%", margin: "auto" }}>
          <Button type="submit" block>
            Submit
          </Button>
        </div>
      </div>
    );
  }
}
