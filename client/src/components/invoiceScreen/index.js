import React, { Component } from "react";
import { Button, ButtonGroup } from "reactstrap";
import currency from "currency.js";
import axios from "axios";

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable2 from "./invoiceItems/InvoiceTable2";
import InvoiceFooter2 from "./invoiceFooter/InvoiceFooter2";
import Navigation from "../Navigation";

import "react-datepicker/dist/react-datepicker.css";

export default class InvoiceScreen extends Component {
  constructor(props) {
    super(props);

    // let holdLineItems = [];

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

  componentWillMount() {
    sessionStorage.removeItem("lineItem");
  }

  componentDidMount() {
    // axios calls here to retreive data for pre-existing invoices
  }

  componentWillUnmount() {
    //   // use this later to save the current state of the invoice when we go change the logo
  }

  // // this function just toggles the button selection for the triple button at the bottom of the page -> NECESSARY to handle which function should be called -> NEEDS TO BE WRITTEN AS OF 4.9.18
  // onRadioBtnClick(rSelected) {
  //   this.setState({ rSelected });
  // }

  /**
   * these functions are for the buttons at the bottom of the page
   */
  saveOnly = () => {
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

  saveAndClose = () => {
    alert("Save and Close was pressed");
  };

  generatePDF = () => {
    alert("Generate PDF was pressed");
  };

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

  addBillableItems = lineItem => {
    if (!lineItem) {
      return;
    } else {
      this.setState(prevState => ({
        billableItems: [...prevState.billableItems, JSON.parse(lineItem)]
      }),
      () => {
        console.log(this.state.billableItems);
      });
      sessionStorage.removeItem("lineItem");
    }
  };

  deleteBillableItems = () => {
    let itemToDelete = sessionStorage.getItem("deleteMe");
    // alert(itemToDelete);
    let filteredState = this.state.billableItems.filter(
      item => item !== itemToDelete
    );
    // sessionStorage.removeItem("lineItem");
    this.setState({ billableItems: filteredState });
    sessionStorage.removeItem("deleteMe");
    alert(filteredState);
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
        <InvoiceItemsTable2
          {...this.state}
          // billableItems={this.state.billableItems}
          addBillableItems={this.addBillableItems}
          deleteBillableItems={this.deleteBillableItems}
          // subtotal={this.state.subtotal}
          changeSubtotal={this.changeSubtotal}
          // amountDue={this.state.amountDue}
          calculateAmountDue={this.calculateAmountDue}
          // grandTotal={this.state.grandTotal}
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
            {/*<Button color="secondary" onClick={() => this.recalculate()}>
              Recalculate
    </Button>*/}
            <Button color="secondary" onClick={this.saveOnly}>
              Save Changes
            </Button>
            <Button
              color="secondary"
              onClick={() => this.saveAndClose()}
              // can pass react-router Link here
            >
              Save and Close
            </Button>
            <Button color="secondary" onClick={() => this.generatePDF()}>
              Generate PDF
            </Button>
          </ButtonGroup>
        </div>
        <br />
      </div>
    );
  }
}
