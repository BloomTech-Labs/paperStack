import React, { Component } from "react";
import { Button, ButtonGroup } from "reactstrap";
import currency from "currency.js";
import axios from "axios";
import moment from "moment";
import { withRouter } from "react-router-dom";

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable2 from "./invoiceItems/InvoiceTable2";
import InvoiceFooter2 from "./invoiceFooter/InvoiceFooter2";
import Navigation from "../Navigation";

import "react-datepicker/dist/react-datepicker.css";

const serverURL = "https://lspaperstack.herokuapp.com";

const enableUpdateButton = localStorage.getItem("invoiceId");

class InvoiceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyLogo: "",
      companyName: "start name",
      companyAddress: "start addy",
      customerAddress: "",
      invoiceNumber: "",
      invoiceDate: moment().format("MM/DD/YYYY"),
      dueDate: moment()
        .add(1, "days")
        .format("MM/DD/YYYY"),
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
    sessionStorage.removeItem("lineItem", "modifyMe");
    if (localStorage.getItem("invoiceId")) {
      this.getExistingInvoice();
    }
  }

  componentDidMount() {
    this.getUserInfo();
  }

  componentWillUnmount() {
    //   // use this later to save the current state of the invoice when we go change the logo
  }

  /**
   * these functions are for the buttons at the bottom of the page
   */

  // retrieve companyLogo, companyAddress
  getUserInfo = () => {
    axios
      .get(`${serverURL}logo`, {
        params: { userId: localStorage.getItem("userId") },
        headers: {
          Authorization: localStorage.getItem("tkn")
        }
      })
      .then(res => {
        this.setState(
          {
            companyAddress: res.data.companyAddress,
            companyName: res.data.companyName,
            companyLogo: `data:${res.data.userLogo.contentType};base64,${
              res.data.userLogo.binaryData
            }`
          },
          () => {
            console.log("");
          }
        );
      });
  };

  // http://www.hostingadvice.com/how-to/javascript-object-to-string-tutorial/
  // on how to format the JSON object for billableItems -> need a replacer defined with the keys, or you just get [object Object]
  saveOnly = () => {
    axios({
      method: "post",
      url: `${serverURL}new`,
      params: { userId: localStorage.getItem("userId") },
      data: {
        invCustomerAddress: this.state.customerAddress,
        invNumber: this.state.invoiceNumber,
        invDate: this.state.invoiceDate,
        invDueDate: this.state.dueDate,
        invBillableItems: JSON.stringify(this.state.billableItems, [
          "id",
          "item",
          "qty",
          "rate",
          "amount"
        ]),
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

  saveChangesToExistingInvoice = () => {
    if (!localStorage.getItem("invoiceNumber")) {
      return;
    } else {
      axios({
        method: "put",
        url: `${serverURL}invoices/`,
        params: {
          invoiceId: localStorage.getItem("invoiceId")
        },
        data: {
          invCustomerAddress: this.state.customerAddress,
          invNumber: this.state.invoiceNumber,
          invDate: this.state.invoiceDate,
          invDueDate: this.state.dueDate,
          invBillableItems: JSON.stringify(this.state.billableItems, [
            "id",
            "item",
            "qty",
            "rate",
            "amount"
          ]),
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
    }
  };

  getExistingInvoice = () => {
    if (!localStorage.getItem("invoiceNumber")) {
      return;
    } else {
      axios({
        method: "get",
        url: `${serverURL}invoices/`,
        params: {
          id: localStorage.getItem("invoiceId")
        },
        headers: { Authorization: localStorage.getItem("tkn") }
      })
        .then(res => {
          this.setState(
            {
              invCustomerAddress: res.data.customerAddress,
              invNumber: res.data.invoiceNumber,
              invDate: res.data.invoiceDate,
              invDueDate: res.data.dueDate,
              invBillableItems: JSON.parse(res.data.billableItems, [
                "id",
                "item",
                "qty",
                "rate",
                "amount"
              ]),
              invDiscount: res.data.discount,
              invTax: res.data.tax,
              invDeposit: res.data.deposit,
              invShipping: res.data.shipping,
              invComment: res.data.notes,
              invTerms: res.data.terms
            },
            () => {
              console.log("");
            }
          );
        })
        .catch(err => {
          const message = err.response.data.error;
          console.log(message);
        });
    }
  };

  saveAndClose = () => {
    if (!this.state.invoiceNumber) {
      alert("Invoices must have at least an Invoice Number to save.");
    } else {
      this.saveOnly();
      this.props.history.push("/invoices");
    }
  };

  // Dan's button code goes here
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
      this.setState(
        prevState => ({
          billableItems: [...prevState.billableItems, JSON.parse(lineItem)]
        }),
        () => {
          console.log(this.state.billableItems);
        }
      );
      sessionStorage.removeItem("lineItem");
    }
  };

  deleteBillableItems = deleteMe => {
    if (!deleteMe) {
      return;
    } else {
      let filteredState = this.state.billableItems.filter(
        item => item.id !== deleteMe
      );
      this.setState({ billableItems: filteredState }, () => {
        console.log(this.state.billableItems);
      });
      sessionStorage.removeItem("deleteMe");
    }
  };

  updateBillableItems = modifyMe => {
    if (!modifyMe) {
      return;
    } else {
      let temp = JSON.parse(modifyMe);
      let filteredState2 = this.state.billableItems.filter(
        item => item.id !== temp.id
      );
      filteredState2.push(temp);
      this.setState({ billableItems: filteredState2 }, () => {
        console.log(this.state.billableItems);
      });

      sessionStorage.removeItem("modifyMe");
    }
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
          {...this.state}
          saveOnly={this.saveOnly}
          changeCompanyLogo={this.changeCompanyLogo}
          changeCompanyAddress={this.changeCompanyAddress}
          changeCustomerAddress={this.changeCustomerAddress}
          changeInvoiceNumber={this.changeInvoiceNumber}
          changeInvoiceDate={this.changeInvoiceDate}
          changeDueDate={this.changeDueDate}
          calculateAmountDue={this.calculateAmountDue}
        />
        <hr />
        <InvoiceItemsTable2
          {...this.state}
          addBillableItems={this.addBillableItems}
          deleteBillableItems={this.deleteBillableItems}
          updateBillableItems={this.updateBillableItems}
          changeSubtotal={this.changeSubtotal}
          calculateAmountDue={this.calculateAmountDue}
          calculateGrandTotal={this.calculateGrandTotal}
        />
        <hr />
        <InvoiceFooter2
          {...this.state}
          changeDiscount={this.changeDiscount}
          changeTax={this.changeTax}
          changeShipping={this.changeShipping}
          calculateGrandTotal={this.calculateGrandTotal}
          changeDeposit={this.changeDeposit}
          changeSubtotal={this.changeSubtotal}
          calculateAmountDue={this.calculateAmountDue}
          changeNotes={this.changeNotes}
          changeTerms={this.changeTerms}
        />
        <div style={{ width: "90%", margin: "auto" }}>
          <ButtonGroup size="lg">
            <Button
              color="secondary"
              disabled={!enableUpdateButton}
              // onClick={this.saveChangesToExistingInvoice()}
            >
              Update Invoice
            </Button>
            <Button color="secondary" onClick={() => this.saveAndClose()}>
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
export default withRouter(InvoiceScreen);
