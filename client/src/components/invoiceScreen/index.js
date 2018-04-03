import React, { Component } from "react";
import { Button, ButtonGroup } from "reactstrap";
import formatNumber from "accounting-js/lib/formatNumber.js";
import formatMoney from "accounting-js/lib/formatMoney.js";
import toFixed from "accounting-js/lib/toFixed.js";

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable from "./invoiceItems/InvoiceTable";
import InvoiceFooter2 from "./invoiceFooter/InvoiceFooter2";

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

  changeSubtotal(subtotal) {
    this.setState({ subtotal });
  }

  changeDiscount(discount) {
    this.setState(state => ({ discount }));
  }

  changeTax(tax) {
    this.setState(state => ({ tax }));
  }

  changeShipping(shipping) {
    this.setState(state => ({ shipping }));
  }

  calculateGrandTotal(discountApplied, taxApplied, includesShipping) {
    discountApplied = 
      formatNumber(this.state.subtotal) * (1 - formatNumber(toFixed(this.state.discount / 100, 2)));

    taxApplied =
      formatNumber(discountApplied) * (1 + +formatNumber((toFixed(this.state.tax / 100, 2))));

    includesShipping = formatNumber(taxApplied) + +formatNumber(this.state.shipping);

    this.setState({
      grandTotal: (includesShipping)
    });
  }

  changeDeposit(deposit) {
    this.setState(state => ({ deposit }));
  }

  calculateAmountDue(depositApplied) {
    depositApplied = this.state.grandTotal - this.state.deposit;
    this.setState(state => ({
      amountDue: depositApplied
    }));
    console.log(typeof depositApplied)
  }

  render() {
    return (
      <div className="invoiceForm" >
        {/*these are temporary until state is complete*/}
        {`tax: ${this.state.tax}% type: ${typeof this.state.tax};`}{" "}
        {`discount: ${this.state.discount} type: ${typeof this.state.discount};`}{" "}
        {`deposit: ${(this.state.deposit)} type: ${typeof this.state.deposit};`}{" "}
        {`shipping: ${(this.state.shipping)} type: ${typeof this.state.shipping};`}{" "}
        {`subtotal: ${(localStorage.getItem("tableSubtotal"))} type: ${typeof this.state.subtotal};`}{" "}
        {`grandtotal: ${this.state.grandTotal} type: ${typeof this.state.grandTotal};`}{" "}
        {`amount Due: ${this.state.amountDue} type: ${typeof this.state.amountDue}`}
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
        <InvoiceFooter2
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
          amountDue={this.state.amountDue}
          calculateAmountDue={this.calculateAmountDue.bind(this)}
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
