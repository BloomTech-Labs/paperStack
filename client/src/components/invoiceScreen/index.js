import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import currency from "currency.js";
import axios from "axios";
import moment from "moment";
import { withRouter } from "react-router-dom";
import * as jsPDF from "jspdf";
import MediaQuery from "react-responsive";

import InvoiceHeader from "./invoiceHeader/invoiceHeader";
import InvoiceHeaderMobile from "./invoiceHeader/invoiceHeaderMobile";
import InvoiceItemsTable2 from "./invoiceItems/InvoiceTable2";
import InvoiceItemsTable2Mobile from "./invoiceItems/InvoiceTable2Mobile";
import InvoiceFooter2 from "./invoiceFooter/InvoiceFooter2";
import InvoiceFooter2Mobile from "./invoiceFooter/InvoiceFooter2Mobile";
import Navigation from "../Navigation";
import logoNotFound from "./logoNotFound.svg";

import "react-datepicker/dist/react-datepicker.css";

const serverURL = "https://www.paperstack.pro";

class InvoiceScreen extends Component {
  constructor(props) {
    super(props);

    this.shouldRedirect = false;

    this.state = {
      companyLogo: "",
      companyName: "start name",
      companyAddress: "start addy",
      customerAddress: "",
      invoiceNumber: "",
      invoiceNumberExtension: "",
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
      terms: "",
      subscription: false,
      oneTimePaid: false,
      paidInvoice: false,
      buttonEnabled: false,
      modal: false,
      modalHeader: "",
      modalBody: ""
    };
  }

  componentWillMount() {
    sessionStorage.removeItem("lineItem", "modifyMe");
  }

  componentDidMount() {
    this.getUserInfo();
    if (localStorage.getItem("invoiceId")) {
      this.getExistingInvoice(localStorage.getItem("invoiceId"));
      this.setState({ buttonEnabled: true });
    }
  }

  componentWillUnmount() {
    localStorage.removeItem("invoiceId");
  }

  /**
   * these functions are for the buttons at the bottom of the page
   */
  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };
  openSavedInvoiceModal = (id, i) => {
    this.setState({
      modalHeader: `Invoice has been saved`,
      modalBody: `You can find your saved invoices on the "Invoices" tab`,
      modal: true
    });
  };
  openEditedInvoiceModal = (id, i) => {
    this.setState({
      modalHeader: `Invoice changes have been saved`,
      modalBody: `You can find your saved invoices on the "Invoices" tab`,
      modal: true
    });
  };
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
        if (!res.data.companyAddress) {
          this.setState(
            {
              companyAddress: "company address missing"
            },
            () => {
              console.log("company address missing");
            }
          );
        }
        if (!res.data.companyName) {
          this.setState(
            {
              companyName: "company name missing"
            },
            () => {
              console.log("company name missing");
            }
          );
        }
        if (!res.data.userLogo) {
          this.setState(
            {
              companyLogo: logoNotFound
            },
            () => {
              console.log("company logo missing");
            }
          );
        } else {
          this.setState(
            {
              companyAddress: res.data.companyAddress,
              companyName: res.data.companyName,
              companyLogo: `data:${res.data.userLogo.contentType};base64,${
                res.data.userLogo.binaryData
              }`,
              invoiceNumber: res.data.currentInvoiceNumber + 1,
              subscription: res.data.subscription,
              oneTimePaid: res.data.oneTimePaid
            },
            () => {
              console.log("from the getUserInfo to force synchronicity");
            }
          );
        }
      })
      .catch(error => {
        console.log(error.res);
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
        invNumberExtension: this.state.invoiceNumberExtension,
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
        invTerms: this.state.terms,
        invPaidFor: this.state.paidInvoice
      },
      headers: { Authorization: localStorage.getItem("tkn") }
    })
      .then(res => {
        this.toggleModal();
        this.openSavedInvoiceModal();
        // this.openSavedInvoiceModal();
        if (this.shouldRedirect) {
          this.props.history.push("/list");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  saveChangesToExistingInvoice = () => {
    const invCustomerAddress = this.state.customerAddress;
    const invNumber = this.state.invoiceNumber;
    const invNumberExtension = this.state.invoiceNumberExtension;
    const invDate = this.state.invoiceDate;
    const invDueDate = this.state.dueDate;
    const invBillableItems = JSON.stringify(this.state.billableItems, [
      "id",
      "item",
      "qty",
      "rate",
      "amount"
    ]);
    const invDiscount = this.state.discount;
    const invTax = this.state.tax;
    const invDeposit = this.state.deposit;
    const invShipping = this.state.shipping;
    const invComment = this.state.notes;
    const invTerms = this.state.terms;
    const invPaidFor = this.state.paidInvoice;
    axios
      .put(
        `${serverURL}updated-invoice`,
        {
          invCustomerAddress,
          invNumber,
          invNumberExtension,
          invDate,
          invDueDate,
          invBillableItems,
          invDiscount,
          invTax,
          invDeposit,
          invShipping,
          invComment,
          invTerms,
          invPaidFor
        },
        {
          params: {
            invoiceId: localStorage.getItem("invoiceId")
          },
          headers: { Authorization: localStorage.getItem("tkn") }
        }
      )
      .then(res => {
        this.toggleModal();
        this.openEditedInvoiceModal();
        if (this.shouldRedirect) {
          this.props.history.push("/list");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  getExistingInvoice = invoiceId => {
    axios
      .get(`${serverURL}invoice`, {
        params: { invoiceId: localStorage.getItem("invoiceId") },
        headers: { Authorization: localStorage.getItem("tkn") }
      })
      .then(res => {
        console.log("from the parent Get res.data: ", res.data);
        this.setState(
          {
            customerAddress: res.data.invCustomerAddress,
            invoiceNumber: res.data.invNumber,
            invoiceNumberExtension: res.data.invNumberExtension,
            invoiceDate: res.data.invDate,
            dueDate: res.data.invDueDate,
            billableItems: JSON.parse(res.data.invBillableItems, [
              "id",
              "item",
              "qty",
              "rate",
              "amount"
            ]),
            discount: res.data.invDiscount,
            tax: res.data.invTax,
            deposit: res.data.invDeposit,
            shipping: res.data.invShipping,
            notes: res.data.invComment,
            terms: res.data.invTerms,
            paidInvoice: res.data.invPaidFor
          },
          () => {
            console.log(
              "from the parent Get setState: ",
              this.state.billableItems
            );
          }
        );
      })
      .catch(err => {
        // const message = err.response.data.error;
        console.log(err);
      });
  };

  saveAndClose = () => {
    if (!this.state.invoiceNumber) {
      alert("Invoices must have at least an Invoice Number to save.");
    } else if (localStorage.getItem("invoiceId")) {
      this.shouldRedirect = true;
      this.saveChangesToExistingInvoice();
    } else {
      this.shouldRedirect = true;
      this.saveOnly();
    }
  };

  generatePDF = () => {
    if (
      this.state.companyLogo === logoNotFound ||
      this.state.companyName === "company name missing" ||
      this.state.companyAddress === "company address missing"
    ) {
      alert(
        "Please update your user settings, missing either your company logo, company name, or company address."
      );
    } else if (!this.state.invoiceNumber) {
      alert(
        "Invoices must have at least an Invoice Number to save or create PDF."
      );
    } else if (
      this.state.subscription === false &&
      this.state.oneTimePaid === false &&
      this.state.paidInvoice === false
    ) {
      this.saveOnly();
      alert("Paid feature only");
      this.props.history.push("/billing");
    } else {
      this.setState({ paidInvoice: true }, () => {
        if (localStorage.getItem("invoiceId")) {
          this.saveChangesToExistingInvoice();
        } else {
          this.saveOnly();
        }
      });
      this.pdfToHTML();
      axios
        .put(
          `${serverURL}paidFlag`,
          {
            oneTimePaid: false
          },
          {
            params: {
              userId: localStorage.getItem("userId")
            },
            headers: {
              Authorization: localStorage.getItem("tkn")
            }
          }
        )
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  // the function that creates PDF's -> passed to the generatePDF function above
  // the commented out sections are for a future time where we extrapolate the PDF function out into it's own component
  pdfToHTML = () => {
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      lineHeight: 1.4
    });
    // axios
    //   .get("http://localhost:3001/logo", {
    //     params: { userId: localStorage.getItem("userId") },
    //     headers: {
    //       Authorization: localStorage.getItem("tkn")
    //     }
    //   })
    //   .then(res => {
    //     this.setState(
    //       {
    //         logo: `data:${res.data.userLogo.contentType};base64,${
    //           res.data.userLogo.binaryData
    //         }`
    //       },
    //       () => {
    const img = new Image();
    img.onload = () => {
      // image  has been loaded
      let typeOfImage;
      // switch (res.data.userLogo.contentType) {
      switch (this.state.companyLogo.contentType) {
        case "image/png":
          typeOfImage = "PNG";
          break;
        case "image/jpeg":
          typeOfImage = "JPEG";
          break;
        default:
          typeOfImage = "JPEG";
      }

      let width = img.width,
        height = img.height,
        imgMarginTop = 0;
      const setWidthToThreeFifty = (w, h) => {
        let ratio = w / 350;
        width = 350;
        height = Math.floor(h / ratio);
      };
      const setHeightToFifty = (w, h) => {
        let ratio = h / 50;
        height = 50;
        width = Math.floor(w / ratio);
      };
      if (height >= 50) {
        setHeightToFifty(width, height);
        if (width > 350) {
          setWidthToThreeFifty(width, height);
        }
      } else {
        setWidthToThreeFifty(width, height);
        // vertically align center
        imgMarginTop = Math.floor((50 - height) / 2);
      }

      pdf.addImage(
        // this.state.logo,
        this.state.companyLogo,
        typeOfImage,
        30,
        10 + imgMarginTop,
        width,
        height
      );

      pdf
        .setFontSize(30)
        .setTextColor(60)
        .text(435, 40, "INVOICE");
      pdf
        .setFontSize(15)
        .setTextColor(120)
        .text(
          560,
          60,
          "Invoice # " +
            this.state.invoiceNumber +
            this.state.invoiceNumberExtension,
          null,
          null,
          "right"
        );
      pdf
        .setFontSize(10)
        .setFontStyle("bold")
        .setTextColor(30)
        .text(40, 80, this.state.companyName);
      pdf
        .setFontSize(10)
        .setFontStyle("normal")
        .setTextColor(60)
        .text(40, 95, this.state.companyAddress.split(", ").join("\n"));
      // pdf
      //   .setFontSize(10)
      //   .setTextColor(60)
      //   .text(40, 110, "LambdaVille, CA 12345");

      // Bill To:
      pdf
        .setFontSize(10)
        .setTextColor(140)
        .text(40, 140, "Bill To:");
      pdf
        .setFontStyle("bold")
        .setTextColor(30)
        .text(40, 155, this.state.customerAddress);
      // pdf
      //   .setFontStyle("normal")
      //   .setTextColor(60)
      //   .text(40, 170, "551 Tesla Lane");
      // pdf.text(40, 185, "San Francisco, CA 54321");

      // Date:
      pdf
        .setFontSize(10)
        .setTextColor(100)
        .text(450, 120, "Date:", null, null, "right");
      pdf
        .setTextColor(30)
        .text(
          555,
          120,
          moment(this.state.invoiceDate).format("MM/DD/YYYY"),
          null,
          null,
          "right"
        );

      // Due Date:
      pdf.setTextColor(100).text(450, 140, "Due Date:", null, null, "right");
      pdf
        .setTextColor(30)
        .text(
          555,
          140,
          moment(this.state.dueDate).format("MM/DD/YYYY"),
          null,
          null,
          "right"
        );

      // Balance Due:
      pdf
        .setDrawColor(0)
        .setFillColor(245)
        .roundedRect(305, 150, 270, 27, 3, 3, "F");
      pdf
        .setFontSize(12)
        .setFontStyle("bold")
        .setTextColor(60)
        .text(450, 167, "Balance Due:", null, null, "right");
      pdf.text(
        555,
        166,
        currency(this.state.amountDue, { formatWithSymbol: true }).format(),
        null,
        null,
        "right"
      );

      // Billable Items Setup
      pdf
        .setDrawColor(0)
        .setFillColor(60)
        .roundedRect(20, 220, 550, 21, 3, 3, "F");
      pdf
        .setFontSize(10)
        .setFontStyle("normal")
        .setTextColor(255)
        .text(37, 234, "Item");
      pdf
        .setFontSize(10)
        .setTextColor(255)
        .text(360, 234, "Quantity");
      pdf
        .setFontSize(10)
        .setTextColor(255)
        .text(460, 234, "Rate");
      pdf
        .setFontSize(10)
        .setTextColor(255)
        .text(520, 234, "Amount");

      // const itemsArr = dummy;
      const itemsArr = this.state.billableItems;

      let marginTop = 260;

      itemsArr.forEach(item => {
        pdf
          .setTextColor(30)
          .setFontStyle("bold")
          .text(37, marginTop, item.item);
        pdf.setFontStyle("normal").text(360, marginTop, item.qty);
        pdf.text(480, marginTop, item.rate, null, null, "right");
        pdf.text(
          555,
          marginTop,
          currency(item.qty)
            .multiply(item.rate)
            .toString(),
          null,
          null,
          "right"
        );
        marginTop += 17;
        if (marginTop >= 820) {
          pdf.addPage("a4");
          // Billable Items Setup
          pdf
            .setDrawColor(0)
            .setFillColor(60)
            .roundedRect(20, 14, 550, 21, 3, 3, "F");
          pdf
            .setFontSize(10)
            .setFontStyle("normal")
            .setTextColor(255)
            .text(37, 28, "Item");
          pdf
            .setFontSize(10)
            .setTextColor(255)
            .text(360, 28, "Quantity");
          pdf
            .setFontSize(10)
            .setTextColor(255)
            .text(460, 28, "Rate");
          pdf
            .setFontSize(10)
            .setTextColor(255)
            .text(520, 28, "Amount");
          marginTop = 54;
        }
      });

      // helper function to split long notes
      const notesLineDivision = str => {
        if (str.length < 100) return str;
        let newLineIndex;
        let indexNotFound = true;
        for (let i = 100; i > 85; i--) {
          if (str[i] === " " || str[i] === ",") {
            newLineIndex = i + 1;
            indexNotFound = false;
            break;
          }
        }
        if (indexNotFound) {
          for (let i = 100; i <= 115; i++) {
            if (str[i] === " " || str[i] === ",") {
              newLineIndex = i + 1;
              indexNotFound = false;
              break;
            }
          }
        }
        if (indexNotFound) {
          return str.substr(0, 100) + "\n" + str.slice(100);
        }
        return str.substr(0, newLineIndex) + "\n" + str.substr(newLineIndex);
      };

      if (marginTop > 583) {
        pdf.addPage("a4");
        marginTop = 0;
        // Subtotal
        pdf
          .setTextColor(140)
          .text(450, marginTop + 50, "Subtotal:", null, null, "right");
        pdf
          .setTextColor(30)
          .text(
            555,
            marginTop + 50,
            currency(this.state.subtotal, { formatWithSymbol: true }).format(),
            null,
            null,
            "right"
          );

        // Discounts
        pdf
          .setTextColor(140)
          .text(
            450,
            marginTop + 72,
            `Discount (${this.state.discount}%):`,
            null,
            null,
            "right"
          );
        pdf.setTextColor(30).text(
          555,
          marginTop + 72,
          "-" +
            "$" +
            currency(this.state.subtotal)
              .multiply(this.state.discount)
              .format(),
          null,
          null,
          "right"
        );

        // Tax
        pdf
          .setTextColor(140)
          .text(
            450,
            marginTop + 94,
            `Tax (${this.state.tax}%):`,
            null,
            null,
            "right"
          );
        pdf.setTextColor(30).text(
          555,
          marginTop + 94,
          "$" +
            currency(this.state.subtotal)
              .multiply(1 - this.state.discount)
              .multiply(this.state.tax)
              .format(),
          null,
          null,
          "right"
        );

        // Total
        pdf
          .setTextColor(140)
          .text(450, marginTop + 116, "Total:", null, null, "right");
        pdf
          .setTextColor(30)
          .text(
            555,
            marginTop + 116,
            currency(this.state.amountDue, { formatWithSymbol: true }).format(),
            null,
            null,
            "right"
          );

        // test remove
        pdf
          .setDrawColor(0)
          .setFillColor(60)
          .roundedRect(20, 820, 550, 3, 1, 1, "F");

        // Notes and terms
        pdf.setTextColor(140).text(37, marginTop + 170, "Notes:");

        // const temp =
        //   "Type, write, or even record audio notes from any meeting. Annotate photos and PDFs for quick communication with teams working remotely in field offices or building sites. Photos of anything that might";
        pdf
          .setTextColor(60)
          .text(37, marginTop + 187, notesLineDivision(this.state.notes));

        pdf.setTextColor(140).text(37, marginTop + 225, "Terms:");
        pdf.setTextColor(60).text(37, marginTop + 242, this.state.terms);
      } else {
        // Subtotal
        pdf
          .setTextColor(140)
          .text(450, marginTop + 50, "Subtotal:", null, null, "right");
        pdf
          .setTextColor(30)
          .text(
            555,
            marginTop + 50,
            currency(this.state.subtotal, { formatWithSymbol: true }).format(),
            null,
            null,
            "right"
          );

        // Discounts
        pdf
          .setTextColor(140)
          .text(
            450,
            marginTop + 72,
            `Discount (${this.state.discount}%):`,
            null,
            null,
            "right"
          );
        pdf.setTextColor(30).text(
          555,
          marginTop + 72,
          "$" +
            currency(this.state.subtotal)
              .multiply(this.state.discount / 100)
              .format(),
          null,
          null,
          "right"
        );

        // Tax
        pdf
          .setTextColor(140)
          .text(
            450,
            marginTop + 94,
            `Tax (${this.state.tax}%):`,
            null,
            null,
            "right"
          );
        pdf.setTextColor(30).text(
          555,
          marginTop + 94,
          "$" +
            currency(this.state.subtotal)
              .multiply(1 - this.state.discount / 100)
              .multiply(this.state.tax / 100)
              .format(),
          null,
          null,
          "right"
        );

        // Total
        pdf
          .setTextColor(140)
          .text(450, marginTop + 116, "Total:", null, null, "right");
        pdf
          .setTextColor(30)
          .text(
            555,
            marginTop + 116,
            currency(this.state.amountDue, { formatWithSymbol: true }).format(),
            null,
            null,
            "right"
          );

        // Notes and terms
        pdf.setTextColor(140).text(37, marginTop + 170, "Notes:");

        // const temp =
        //   "Type, write, or even record audio notes from any meeting. Annotate photos and PDFs for quick communication with teams working remotely in field offices or building sites. Photos of anything that might";
        pdf
          .setTextColor(60)
          .text(37, marginTop + 187, notesLineDivision(this.state.notes));

        pdf.setTextColor(140).text(37, marginTop + 225, "Terms:");
        pdf.setTextColor(60).text(37, marginTop + 242, this.state.terms);
      }

      pdf.save("html2pdf.pdf");
    };
    // img.src = this.state.logo;
    img.src = this.state.companyLogo;
    // }
    // );
    // });
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
    this.setState({ customerAddress }, () => {
      this.recalculate();
    });
  };

  changeInvoiceNumber = invoiceNumber => {
    this.setState({ invoiceNumber }, () => {
      this.recalculate();
    });
  };

  changeInvoiceNumberExtension = invoiceNumberExtension => {
    this.setState({ invoiceNumberExtension }, () => {
      this.recalculate();
    });
  };

  changeInvoiceDate = invoiceDate => {
    this.setState({ invoiceDate }, () => {
      this.recalculate();
    });
  };

  changeDueDate = dueDate => {
    this.setState({ dueDate }, () => {
      this.recalculate();
    });
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
          console.log(
            "from the parent addBillableItems: ",
            this.state.billableItems
          );
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
    this.setState({ terms }, () => {
      this.calculateAmountDue();
    });
  };

  render() {
    return (
      <div className="invoiceForm">
        <Navigation />
        <br />
        <hr />
        {/*Header*/}
        <MediaQuery minDeviceWidth={1224}>
          <InvoiceHeader
            {...this.state}
            saveOnly={this.saveOnly}
            changeCompanyLogo={this.changeCompanyLogo}
            changeCompanyAddress={this.changeCompanyAddress}
            changeCustomerAddress={this.changeCustomerAddress}
            changeInvoiceNumber={this.changeInvoiceNumber}
            changeInvoiceNumberExtension={this.changeInvoiceNumberExtension}
            changeInvoiceDate={this.changeInvoiceDate}
            changeDueDate={this.changeDueDate}
            calculateAmountDue={this.calculateAmountDue}
          />
        </MediaQuery>
        <MediaQuery maxDeviceWidth={1223}>
          <InvoiceHeaderMobile
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
        </MediaQuery>
        <hr />
        {/*Table*/}
        <MediaQuery minDeviceWidth={1224}>
          <InvoiceItemsTable2
            {...this.state}
            addBillableItems={this.addBillableItems}
            deleteBillableItems={this.deleteBillableItems}
            updateBillableItems={this.updateBillableItems}
            changeSubtotal={this.changeSubtotal}
            calculateAmountDue={this.calculateAmountDue}
            calculateGrandTotal={this.calculateGrandTotal}
          />
        </MediaQuery>
        <MediaQuery maxDeviceWidth={1223}>
          <InvoiceItemsTable2Mobile
            {...this.state}
            addBillableItems={this.addBillableItems}
            deleteBillableItems={this.deleteBillableItems}
            updateBillableItems={this.updateBillableItems}
            changeSubtotal={this.changeSubtotal}
            calculateAmountDue={this.calculateAmountDue}
            calculateGrandTotal={this.calculateGrandTotal}
          />
        </MediaQuery>
        <hr />
        {/*Footer*/}
        <MediaQuery minDeviceWidth={1224}>
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
        </MediaQuery>
        <MediaQuery maxDeviceWidth={1223}>
          <InvoiceFooter2Mobile
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
        </MediaQuery>
        {/*Buttons*/}
        <MediaQuery minDeviceWidth={1224}>
          <div style={{ width: "90%", margin: "auto" }}>
            <ButtonGroup size="lg">
              <Button
                color="secondary"
                disabled={!this.state.buttonEnabled}
                onClick={this.saveChangesToExistingInvoice}
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
        </MediaQuery>
        <MediaQuery maxDeviceWidth={1223}>
          <div style={{ width: "90%", margin: "auto" }}>
            <Button
              color="secondary"
              disabled={!this.state.buttonEnabled}
              block
              onClick={this.saveChangesToExistingInvoice}
            >
              Update Invoice
            </Button>
            <br />
            <Button color="secondary" onClick={() => this.saveAndClose()} block>
              Save and Close
            </Button>
            <br />
            <Button color="secondary" onClick={() => this.generatePDF()} block>
              Generate PDF
            </Button>
          </div>
        </MediaQuery>
        <br />
        <div>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>
              {this.state.modalHeader}
            </ModalHeader>
            <ModalBody>{this.state.modalBody}</ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleModal}>
                Ok
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}
export default withRouter(InvoiceScreen);
