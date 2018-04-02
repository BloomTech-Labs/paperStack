import React, { Component } from "react";
import { Button, ButtonGroup } from "reactstrap";
import formatNumber from "accounting-js/lib/formatNumber.js";
import formatMoney from "accounting-js/lib/formatMoney.js";
import toFixed from "accounting-js/lib/toFixed.js";

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable from "./invoiceItems/InvoiceTable";
import InvoiceFooter from "./invoiceFooter/InvoiceFooter";

import "react-datepicker/dist/react-datepicker.css";

export default class InvoiceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subtotal: localStorage.getItem("tableSubtotal"),
      tax: 0,
      discount: 0,
      deposit: 0,
      grandTotal: 0,
      amountDue: 0,
      shipping: 0
    };
  }

  // this function just toggles the button selection for the double button at the bottom of the page -> may become a triple button
  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }

  saveAndClose() {}

  generatePDF() {}

  changeTax(tax) {
    this.setState(state => ({ tax }));
  }

  changeDiscount(discount) {
    this.setState(state => ({ discount }));
  }

  changeDeposit(deposit) {
    this.setState(state => ({ deposit }));
  }

  changeShipping(shipping) {
    this.setState(state => ({ shipping }));
  }

  changeSubtotal(subtotal) {
    this.setState({ subtotal });
  }

  calculateGrandTotal(discountApplied, taxApplied) {
    discountApplied = 
      this.state.subtotal * (1 - toFixed(this.state.discount / 100, 2));

    // taxApplied =
    //   formatNumber(discountApplied) * (1 + toFixed(this.state.tax / 100, 2));

    taxApplied =
      formatNumber(discountApplied) * (1 + (toFixed(this.state.tax / 100, 2)));

    // this.setState({
    //   grandTotal:  this.totalWithTax + formatNumber(this.state.shipping)
    // });
    this.setState({
      grandTotal: formatNumber(1 + formatNumber(toFixed(this.state.tax/100, 2)))
    });
  }

  calculateAmountDue() {
    this.setState({
      amountDue: this.state.grandTotal - formatNumber(this.state.deposit)
    });
  }

  render() {
    return (
      <div className="invoiceForm">
        {/*these are temporary until state is complete*/}
        {`tax: ${this.state.tax}%`} {`discount: ${this.state.discount}`}{" "}
        {`deposit: ${formatMoney(this.state.deposit)}`}{" "}
        {`shipping: ${formatMoney(this.state.shipping)}`}{" "}
        {`subtotal: ${formatMoney(localStorage.getItem("tableSubtotal"))}`}{" "}
        {`grandtotal: ${this.state.grandTotal}`}{" "}
        <InvoiceHeader
          amountDue={this.state.amountDue}
          calculateAmountDue={this.calculateAmountDue.bind(this)}
        />
        <hr />
        <InvoiceItemsTable
          subtotal={this.state.subtotal}
          changeSubtotal={this.changeSubtotal.bind(this)}
        />
        <hr />
        <InvoiceFooter
          tax={this.state.tax}
          changeTax={this.changeTax.bind(this)}
          discount={this.state.discount}
          changeDiscount={this.changeDiscount.bind(this)}
          deposit={this.state.deposit}
          changeDeposit={this.changeDeposit.bind(this)}
          grandTotal={this.state.grandTotal}
          calculateGrandTotal={this.calculateGrandTotal.bind(this)}
          shipping={this.state.shipping}
          changeShipping={this.changeShipping.bind(this)}
          subtotal={this.state.subtotal}
          changeSubtotal={this.changeSubtotal.bind(this)}
        />
        <div style={{ width: "90%", margin: "auto" }}>
          {/*} <Col xs={{ size: 12 }}>
            <Button type="submit" block>
              Save and Close
            </Button>
          </Col>
          <Col xs={{ size: 12 }}>
            <Button type="submit" block>
              Generate PDF
            </Button>
    </Col>*/}

          <ButtonGroup size="lg">
            <Button
              color="secondary"
              onClick={() => this.onRadioBtnClick("Save and close")}
              active={this.state.rSelected === "Save and close"}
              // onClick={this.saveAndClose.bind(this)}
              // can pass react-router Link here
            >
              Save and Close
            </Button>
            <Button
              color="secondary"
              onClick={() => this.onRadioBtnClick("generate pdf")}
              active={this.state.rSelected === "Generate PDF"}
              // onClick={this.generatePDF.bind(this)}
            >
              Generate PDF
            </Button>
          </ButtonGroup>
          <p>Selected: {this.state.rSelected}</p>
        </div>
      </div>
    );
  }
}
