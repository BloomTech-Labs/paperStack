import React, { Component } from "react";
import {Route, Redirect} from 'react-router-dom';
import { Button, ButtonGroup } from "reactstrap";
import currency from "currency.js";
import axios from "axios";
import moment from 'moment';

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceItemsTable2 from "./invoiceItems/InvoiceTable2";
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
      invoiceDate: moment().format('MM/DD/YYYY'),
      dueDate: moment().add(1, 'days').format('MM/DD/YYYY'),
      billableItems: [],
      subtotal: sessionStorage.getItem("tableSubtotal"),
      tax: 0,
      discount: 0,
      deposit: 0,
      grandTotal: 0,
      shipping: 0,
      amountDue: 0,
      notes: "",
      terms: "",
      userID: ""
    };
  }

  componentWillMount() {
    sessionStorage.removeItem("lineItem", "modifyMe");
  }

  // componentDidMount() {
  //   // axios calls here to retreive data for pre-existing invoices
  //   axios
  //     .get(`fetch users invoice# and address here`)
  //     .then(res => {
  //       console.log(res)
  //       this.setState({
  //         companyAddress: res.data.companyAddress,
  //         invoiceNumber : res.data.invoice + 1
  //       })
  //     })
  // }

  componentWillUnmount() {
    //   // use this later to save the current state of the invoice when we go change the logo
  }

  /**
   * these functions are for the buttons at the bottom of the page
   */

  // retrieve companyLogo, companyAddress
  // getUserInfo = () => {
  //   return axios
  //     .get(`http://localhost:3001/users/${userID}`)
  //     .then(res => this.setState({
  //       userID: res.data.userID,
  //       companyLogo: res.data.companyLogo,
  //       companyAddress: res.data.companyAddress
  //     }))
  // }


  // http://www.hostingadvice.com/how-to/javascript-object-to-string-tutorial/
  // on how to format the JSON object for billableItems -> need a replacer defined with the keys, or you just get [object Object]
  saveOnly = () => {
    axios({
      method: "post",
      url: `http://localhost:3001/new`,
      data: {
        invCustomerAddress: this.state.customerAddress,
        invNumber: this.state.invoiceNumber,
        invDate: this.state.invoiceDate,
        invDueDate: this.state.dueDate,
        invBillableItems: JSON.stringify(this.state.billableItems, ['id', 'item', 'qty', 'rate', 'amount' ]),
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
        if (res.data) {
          this.context.history.push('/invoices');
        } else {
          return;
        }
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
        console.log(this.state.billableItems)
      });
      sessionStorage.removeItem("deleteMe");
    }
  };

  updateBillableItems = (modifyMe) => {
    if (!modifyMe) {
      return;
    } else {
      let temp = JSON.parse(modifyMe);
      let filteredState2 = this.state.billableItems.filter(
        item => item.id !== temp.id
      );
      filteredState2.push(temp);
      this.setState({ billableItems: filteredState2 }, () => {
        console.log(this.state.billableItems)
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
