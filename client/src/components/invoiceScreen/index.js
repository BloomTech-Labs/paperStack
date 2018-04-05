import React, { Component } from "react";
import { Button, ButtonGroup } from "reactstrap";
import currency from "currency.js";
import axios from "axios";

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable from "./invoiceItems/InvoiceTable";
import InvoiceFooter2 from "./invoiceFooter/InvoiceFooter2";
import Navigation from "../Navigation";

import "react-datepicker/dist/react-datepicker.css";

export default class InvoiceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyLogo: "",
      companyAddress: "",
      customerAddress: "",
      invoiceNumber: "",
      invoiceDate: "",
      dueDate: "",
      billableItems: [],
      subtotal: sessionStorage.getItem("tableSubtotal"),
      tax: 0,
      discount: 0,
      deposit: 0,
      grandTotal: 0,
      shipping: 0,
      amountDue: 0,
      notes: "",
      terms: ""
    };
  }

  componentDidMount() {
    // axios calls here to retreive data
  }

  componentWillUnmount() {
  //   // use this later to save the current state of the invoice when we go change the logo
  }

  // this function just toggles the button selection for the quad button at the bottom of the page
  // may also not be necessary
  onRadioBtnClick(rSelected) {
    this.setState({ rSelected });
  }

  /**
   * these functions are for the buttons at the bottom of the page
   */
  saveOnly = () => {
    // alert(`invoiceNumber state: ${this.state.invoiceNumber}`);
    axios({
      method: "post",
      url: `http://localhost:3001/invoices`,
      params: { 
        customerAddress: this.state.customerAddress,
        invNumber: this.state.invoiceNumber,
        invDate: this.state.invoiceDate,
        invDueDate: this.state.dueDate,
        billableItems: this.state.billableItems,
        invDiscount: this.state.discount,
        invTax: this.state.tax,
        invDeposit: this.state.deposit,
        invShipping: this.state.shipping,
        invComment: this.state.notes,
        invTerms: this.state.terms
      },
      headers: { Authorization: localStorage.getItem("tkn") }
    })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        const message = err.response.data.error;
        console.log(message);
      });
  };

  saveAndClose = () => {};

  generatePDF = () => {};

  /**
   * these functions pass the form values into state
   */
  changeCompanyLogo = companyLogo => {
    this.setState({ companyLogo });
  };

  changeCompanyAddress = companyAddress => {
    this.setState({ companyAddress });
  };

  changeCustomerAddress = customerAddress => {
    this.setState({ customerAddress });
  };

  changeInvoiceNumber = invoiceNumber => {
    this.setState({ invoiceNumber });
  };

  changeInvoiceDate = invoiceDate => {
    this.setState({ invoiceDate });
  };

  changeDueDate = dueDate => {
    this.setState({ dueDate });
  };

  changeBillableItems = billableItems => {
    this.setState({ billableItems });
  };

  // pass function as callback to mimic synchronous setState: https://vasanthk.gitbooks.io/react-bits/patterns/19.async-nature-of-setState.html
  changeSubtotal = subtotal => {
    this.setState(
      { subtotal },
      () => {
        this.recalculate();
      },
      () => {
        this.calculateGrandTotal();
      }
    );
  };

  changeDiscount = discount => {
    this.setState(
      { discount },
      () => {
        this.recalculate();
      },
      () => {
        this.calculateGrandTotal();
      }
    );
  };

  changeTax = tax => {
    this.setState(
      { tax },
      () => {
        this.recalculate();
      },
      () => {
        this.calculateGrandTotal();
      }
    );
  };

  changeShipping = shipping => {
    this.setState(
      { shipping },
      () => {
        this.recalculate();
      },
      () => {
        this.calculateGrandTotal();
      }
    );
  };

  calculateGrandTotal = grandTotal => {
    let discountApplied = currency(this.state.subtotal).multiply(
      1 - Number(this.state.discount / 100)
    );

    let taxApplied = currency(discountApplied).multiply(
      1 + Number(this.state.tax / 100)
    );

    let includesShipping = currency(taxApplied).add(this.state.shipping);

    this.setState(
      {
        grandTotal: includesShipping.format()
      },
      () => {
        this.calculateAmountDue();
      }
    );
  };

  changeDeposit = deposit => {
    this.setState({ deposit }, () => {
      this.calculateAmountDue();
    });
  };

  calculateAmountDue = amountDue => {
    let depositApplied = currency(this.state.grandTotal).subtract(
      this.state.deposit
    );
    this.setState(state => ({
      amountDue: depositApplied.format()
    }));
  };

  recalculate() {
    this.calculateGrandTotal();
    this.calculateAmountDue();
  }

  changeNotes = notes => {
    this.setState({ notes });
  };

  changeTerms = terms => {
    this.setState({ terms });
  };

  render() {
    return (
      <div className="invoiceForm">
        <Navigation />
        <br />
        <hr />
        <InvoiceHeader
          companyLogo={this.state.companyLogo}
          changeCompanyLogo={this.changeCompanyLogo}
          companyAddress={this.state.companyAddress}
          changeCompanyAddress={this.changeCompanyAddress}
          customerAddress={this.state.customerAddress}
          changeCustomerAddress={this.changeCustomerAddress}
          invoiceNumber={this.state.invoiceNumber}
          changeInvoiceNumber={this.changeInvoiceNumber}
          invoiceDate={this.state.invoiceDate}
          changeInvoiceDate={this.changeInvoiceDate}
          dueDate={this.state.dueDate}
          changeDueDate={this.changeDueDate}
          amountDue={this.state.amountDue}
          calculateAmountDue={this.calculateAmountDue}
        />
        <hr />
        <InvoiceItemsTable
          billableItems={this.state.billableItems}
          changeBillableItems={this.changeBillableItems}
          subtotal={this.state.subtotal}
          changeSubtotal={this.changeSubtotal}
          amountDue={this.state.amountDue}
          calculateAmountDue={this.calculateAmountDue}
          grandTotal={this.state.grandTotal}
          calculateGrandTotal={this.calculateGrandTotal}
        />
        <hr />
        <InvoiceFooter2
          discount={this.state.discount}
          changeDiscount={this.changeDiscount}
          tax={this.state.tax}
          changeTax={this.changeTax}
          shipping={this.state.shipping}
          changeShipping={this.changeShipping}
          grandTotal={this.state.grandTotal}
          calculateGrandTotal={this.calculateGrandTotal}
          deposit={this.state.deposit}
          changeDeposit={this.changeDeposit}
          subtotal={this.state.subtotal}
          changeSubtotal={this.changeSubtotal}
          amountDue={this.state.amountDue}
          calculateAmountDue={this.calculateAmountDue}
          notes={this.state.notes}
          changeNotes={this.changeNotes}
          terms={this.state.terms}
          changeTerms={this.changeTerms}
        />
        <div style={{ width: "90%", margin: "auto" }}>
          <ButtonGroup size="lg">
            <Button color="secondary" onClick={() => this.recalculate()}>
              Recalculate
            </Button>
            <Button
              color="secondary"
              onClick={this.saveOnly}
              // onClick={this.saveAndClose.bind(this)}
            >
              Save Changes
            </Button>
            <Button
              color="secondary"
              onClick={() => this.onRadioBtnClick("Save and close")}
              // can pass react-router Link here
            >
              Save and Close
            </Button>
            <Button
              color="secondary"
              onClick={() => this.onRadioBtnClick("generate pdf")}
              // onClick={this.generatePDF.bind(this)}
            >
              Generate PDF
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}
