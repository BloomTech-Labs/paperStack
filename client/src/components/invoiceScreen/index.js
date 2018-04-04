import React, { Component } from "react";
import { Button, ButtonGroup } from "reactstrap";
import currency from "currency.js";
import axios from 'axios';

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable from "./invoiceItems/InvoiceTable";
import InvoiceFooter2 from "./invoiceFooter/InvoiceFooter2";
import Navigation from "../Navigation";

import "react-datepicker/dist/react-datepicker.css";

export default class InvoiceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyAddress:"",
      customerAddress:'',
      invoiceNumber: "",
      invoiceDate:'',
      dueDate:'',
      billableItems:[],
      subtotal: sessionStorage.getItem("tableSubtotal"),
      tax: 0,
      discount: 0,
      deposit: 0,
      grandTotal: 0,
      amountDue: 0,
      shipping: 0,
      notes: '',
      terms: ''
    };
  }

  // this function just toggles the button selection for the double button at the bottom of the page -> may become a triple button
  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }



  saveOnly = () => {
    // alert(`invoiceNumber state: ${this.state.invoiceNumber}`);
    axios({
      method: 'post',
      url: `http://localhost:3001/invoices`,
      params: { invNumber: this.state.invoiceNumber },
      headers: { Authorization: localStorage.getItem('tkn') }
    }).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      const message = err.response.data.error;
      console.log(message);
    });
  }

  changeFieldWithCalculations = (e) => {
    this.setState({[e.target.name]:e.target.value}, () => {this.recalculate();}, () => {this.calculateGrandTotal();})
  }

  changeInvoiceNumber = (invoiceNumber) => {
    this.setState({invoiceNumber});
  }

  saveAndClose() {}

  generatePDF() {}

  // pass function as callback to mimic synchronous setState: https://vasanthk.gitbooks.io/react-bits/patterns/19.async-nature-of-setState.html
  changeSubtotal(subtotal) {
    this.setState(
      { subtotal },
      () => {
        this.recalculate();
      },
      () => {
        this.calculateGrandTotal();
      }
    );
  }

  changeDiscount(discount) {
    this.setState(
      { discount },
      () => {
        this.recalculate();
      },
      () => {
        this.calculateGrandTotal();
      }
    );
  }

  changeTax(tax) {
    this.setState(
      { tax },
      () => {
        this.recalculate();
      },
      () => {
        this.calculateGrandTotal();
      }
    );
  }

  changeShipping(shipping) {
    this.setState(
      { shipping },
      () => {
        this.recalculate();
      },
      () => {
        this.calculateGrandTotal();
      }
    );
  }

  calculateGrandTotal(discountApplied, taxApplied, includesShipping) {
    discountApplied = currency(this.state.subtotal).multiply(
      1 - Number(this.state.discount / 100)
    );

    taxApplied = currency(discountApplied).multiply(
      1 + Number(this.state.tax / 100)
    );

    includesShipping = currency(taxApplied).add(this.state.shipping);

    this.setState(
      {
        grandTotal: includesShipping
      },
      () => {
        this.calculateAmountDue();
      }
    );
  }

  changeDeposit(deposit) {
    this.setState({ deposit }, () => {
      this.calculateAmountDue();
    });
  }

  calculateAmountDue(depositApplied) {
    depositApplied = currency(this.state.grandTotal).subtract(
      this.state.deposit
    );
    this.setState(state => ({
      amountDue: depositApplied.format()
    }));
  }

  recalculate() {
    this.calculateGrandTotal();
    this.calculateAmountDue();
    this.calculateGrandTotal();
    this.calculateAmountDue();
  }

  render() {
    return (
      <div className="invoiceForm">
        <Navigation />
        <InvoiceHeader
        invoiceNumber={this.state.invoiceNumber}
        changeInvoiceNumber={this.changeInvoiceNumber}
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
          changeField={this.changeFieldWithCalculations}
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
            <Button color="secondary" onClick={() => this.recalculate()}>
              Recalculate
            </Button>
            <Button
            color="secondary"
            onClick={this.saveOnly}
            // active={this.state.rSelected === "Save changes"}
            // onClick={this.saveAndClose.bind(this)}
            // can pass react-router Link here
          >
            Save Changes
          </Button>
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
