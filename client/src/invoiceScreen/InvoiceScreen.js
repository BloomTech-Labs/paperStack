import React, { Component } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import InvoiceItemsTable from "./invoiceItems/InvoiceTable";
import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceFooter from "./invoiceFooter/InvoiceFooter";

export default class InvoiceScreen extends Component {
  render() {
    return (
      <div>
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
