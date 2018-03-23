import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import InvoiceItemsTable from "./invoiceItems/InvoiceTable";
import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceFooter from "./invoiceFooter/InvoiceFooter";

export default class InvoiceScreen extends Component {
  render() {
    return (
      <div>
        <InvoiceHeader />
        <InvoiceItemsTable />

        <InvoiceFooter />
      </div>
    );
  }
}
