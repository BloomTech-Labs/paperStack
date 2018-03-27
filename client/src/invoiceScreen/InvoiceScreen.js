import React, { Component } from "react";
import { Button } from "reactstrap";

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable from "./invoiceItems/InvoiceTable";
import InvoiceFooter from "./invoiceFooter/InvoiceFooter";

import 'react-datepicker/dist/react-datepicker.css';

export default class InvoiceScreen extends Component {
  render() {
    return (
      <div className="invoiceForm">
        <InvoiceHeader />
        <hr />
        <InvoiceItemsTable />
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
