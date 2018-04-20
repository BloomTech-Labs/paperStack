import React, { Component } from "react";
import Navigation from "../Navigation";
import { withRouter } from "react-router-dom";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardText,
  CardBody,
  CardTitle,
  Button
} from "reactstrap";

import axios from "axios";
import moment from "moment";

import "./InvoiceList.css";

class InvoiceList extends Component {
  state = {
    list: [],
    modal: false,
    modalHeader: "",
    modalBody: "",
    invoiceId: "",
    invoiceIndex: null
  };

  handleCreateNew = () => {
    localStorage.removeItem("invoiceId");
    this.props.history.push("/new");
  };

  handleEdit = id => {
    localStorage.setItem("invoiceId", id);
    this.props.history.push("/new");
  };

  handleDelete = () => {
    this.toggleModal();
    axios
      .delete(`https://lspaperstack.herokuapp.com`, {
        params: {
          invoiceId: this.state.invoiceId,
          userId: localStorage.getItem("userId")
        },
        headers: {
          Authorization: localStorage.getItem("tkn")
        }
      })
      .then(res => {
        const newList = this.state.list;
        newList.splice(this.state.invoiceIndex, 1);
        this.setState({ list: newList });
      });
  };
  openDeleteModal = (id, i) => {
    this.setState({
      invoiceId: id,
      invoiceIndex: i,
      modalHeader: `Are you absolutely sure?`,
      modalBody: `This action cannot be undone. This will permanently delete the invoice`,
      modal: true
    });
  };

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  renderCompanyAddress = info => {
    if (!info.length) return null;
    if (!info.match(/[a-z0-9]/gi)) return null;
    let truncated = "";
    if (info.length < 36) {
      truncated = info;
    } else {
      let lastIndexOfComma = 0;
      for (let i = 0; i <= 36; i++) {
        if (info[i] === ",") {
          lastIndexOfComma = i;
        }
      }

      if (!lastIndexOfComma) {
        truncated = info.substring(0, 36) + "...";
      } else {
        truncated = info.substring(0, lastIndexOfComma) + "...";
      }
    }
    return (
      <div>
        <CardTitle>Customer Address</CardTitle>
        <CardText>{truncated}</CardText>
      </div>
    );
  };

  renderItems = items => {
    const parsedArr = JSON.parse(items);
    if (!parsedArr.length) return null;

    if (parsedArr.length === 1) {
      const item = parsedArr[0].item;
      let truncated = "";
      if (item.length < 36) {
        truncated = item;
      } else {
        truncated = item.substring(0, 36) + "...";
      }
      return (
        <div>
          <CardTitle>Billable Items</CardTitle>
          <CardText>{truncated}</CardText>
        </div>
      );
    }

    let itemsStr = parsedArr[0].item;
    for (let k = 1; k < parsedArr.length; k++) {
      itemsStr += ", " + parsedArr[k].item;
    }
    let truncated = "";
    if (itemsStr.length < 36) {
      truncated = itemsStr;
    } else {
      let lastIndexOfComma = 0;
      for (let i = 0; i <= 36; i++) {
        if (itemsStr[i] === ",") {
          lastIndexOfComma = i;
        }
      }

      if (!lastIndexOfComma) {
        truncated = itemsStr.substring(0, 36) + "...";
      } else {
        truncated = itemsStr.substring(0, lastIndexOfComma) + "...";
      }
    }
    return (
      <div>
        <CardTitle>Billable Items</CardTitle>
        <CardText>{truncated}</CardText>
      </div>
    );
  };

  renderList() {
    const list = this.state.list.map((invoice, i) => {
      return (
        <Card key={invoice._id}>
          <CardBody>
            <CardTitle>Invoice Number &#35;</CardTitle>
            <CardText>
              {invoice.invNumber}
              {invoice.invNumberExtension}
            </CardText>
            {this.renderCompanyAddress(invoice.invCustomerAddress)}
            {this.renderItems(invoice.invBillableItems)}
            <div className="Invoice-List-date-wrapper">
              <CardTitle>Created at:</CardTitle>
              <CardText>
                {moment(invoice.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </CardText>
            </div>
          </CardBody>
          <footer>
            <Button
              className="Invoice-List-edit-btn"
              onClick={() => {
                this.handleEdit(invoice._id);
              }}
            >
              Edit
            </Button>
            <Button
              className="Invoice-List-delete-btn"
              onClick={() => {
                this.openDeleteModal(invoice._id, i);
              }}
            >
              Delete
            </Button>
          </footer>
        </Card>
      );
    });
    return list;
  }

  render() {
    return (
      <div className="Invoice-List">
        <Navigation />
        <div className="Invoice-List-container">
          <Card
            className="Invoice-List-add-card"
            onClick={this.handleCreateNew}
          >
            <CardBody>
              <Button className="Invoice-List-add-btn">
                <span>&#43;</span>
              </Button>
              <p className="Invoice-List-add-text">Create a new invoice</p>
            </CardBody>
          </Card>
          {this.state.list.length ? this.renderList() : null}
        </div>
        {/* Modal */}
        <div>
          <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>
              {this.state.modalHeader}
            </ModalHeader>
            <ModalBody>{this.state.modalBody}</ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={this.handleDelete}>
                Yes
              </Button>
              <Button color="secondary" onClick={this.toggleModal}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }

  componentDidMount() {
    axios({
      method: "get",
      url: `https://lspaperstack.herokuapp.com/invoices`,
      params: { userId: localStorage.getItem("userId") },
      headers: { Authorization: localStorage.getItem("tkn") }
    })
      .then(res => {
        const newestFirst = res.data.sort((a, b) => {
          return a.createdAt === b.createdAt
            ? 0
            : a.createdAt < b.createdAt
              ? 1
              : -1;
        });
        this.setState({ list: newestFirst });
      })
      .catch(err => {
        console.log(err);
        alert("Could not retrieve invoices");
      });
  }
}

export default withRouter(InvoiceList);
