import React, { Component } from "react";
import { Button, ButtonGroup } from "reactstrap";
import currency from "currency.js";

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

  /*this.setState((prevState) => {
  return {count: prevState.count + 1};
})*/
  changeSubtotal(subtotal) {
    this.setState(prevState => {return { subtotal: subtotal }});
  }

  changeDiscount(discount) {
    this.setState(prevState => {return { discount }});
  }

  changeTax(tax) {
    this.setState(state => ({ tax }));
  }

  changeShipping(shipping) {
    this.setState(state => ({ shipping }));
  }

  calculateGrandTotal(discountApplied, taxApplied, includesShipping) {
    discountApplied =
      currency(this.state.subtotal).multiply(1-Number(this.state.discount/100));

      taxApplied =
      currency(discountApplied).multiply(1+Number(this.state.tax/100));

    includesShipping =
      // +formatNumber(taxApplied) + +formatNumber(this.state.shipping);
      currency(taxApplied).add(this.state.shipping);

    this.setState({
      grandTotal: includesShipping.format()
    });
    this.calculateAmountDue();
  }

  changeDeposit(deposit) {
    this.setState({ deposit });
  }

  calculateAmountDue(depositApplied) {
    depositApplied = 
    currency(this.state.grandTotal).subtract(this.state.deposit);
    this.setState(state => ({
      amountDue: depositApplied.format()
    }));
  }

  render() {
    return (
      <div className="invoiceForm">
        {/*these are temporary until state is complete*/}
        {`tax: ${this.state.tax}% type: ${typeof this.state.tax};`}{" "}
        {`discount: ${this.state.discount} type: ${typeof this.state
          .discount};`}{" "}
        {`deposit: ${this.state.deposit} type: ${typeof this.state.deposit};`}{" "}
        {`shipping: ${this.state.shipping} type: ${typeof this.state
          .shipping};`}{" "}
        {`subtotal: ${localStorage.getItem("tableSubtotal")} type: ${typeof this
          .state.subtotal};`}{" "}
        {`grandtotal: ${this.state.grandTotal} type: ${typeof this.state
          .grandTotal};`}{" "}
        {`amount Due: ${this.state.amountDue} type: ${typeof this.state
          .amountDue}`}
        <InvoiceHeader
          amountDue={this.state.amountDue}
          calculateAmountDue={this.calculateAmountDue.bind(this)}
        />
        <hr />
        <InvoiceItemsTable
          subtotal={this.state.subtotal}
          changeSubtotal={this.changeSubtotal.bind(this)}
          amountDue={this.state.amountDue}
          calculateAmountDue={this.calculateAmountDue.bind(this)}
          grandTotal={this.state.grandTotal}
          calculateGrandTotal={this.calculateGrandTotal.bind(this)}
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
