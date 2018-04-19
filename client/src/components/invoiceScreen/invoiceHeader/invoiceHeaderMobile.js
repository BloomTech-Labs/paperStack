import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import { Link } from "react-router-dom";

import DueDatePicker from "./dueDatePicker";
import CurrentDatePicker from "./currentDatePicker";

import "react-datepicker/dist/react-datepicker.css";
import "./datePicker.css";

export default class InvoiceHeader extends Component {
  saveAndChange = () => {
    this.props.saveOnly();
  };

  /**
   * these functions handle the change events for the invoice fields
   */
  handleCompanyAddressChange = e => {
    this.props.changeCompanyAddress(e.target.value);
  };

  handleCustomerAddressChange = e => {
    this.props.changeCustomerAddress(e.target.value);
  };

  handleInvoiceNumberChange = e => {
    this.props.changeInvoiceNumber(e.target.value);
  };

  handleAmountDueChange = e => {
    this.props.calculateAmountDue(e.target.value);
  };

  render() {
    return (
      <div style={{ width: "90%", margin: "auto" }}>
        {/* This container holds everything */}
        <Form>
          <Row>
            {/* constrains the size of the column */}
            <Col sm={{ size: 12, offset: 0.5 }}>
              {/* display the company logo -> currently hard wired */}
              <FormGroup row>
                <Label for="businessLogo" sm={3}>
                  Company Logo
                </Label>
                <Col sm={5}>
                  <img
                    src={this.props.companyLogo}
                    alt="company logo"
                    style={{ maxHeight: "150px", maxWidth: "150px" }}
                  />
                </Col>
                <Col sm={3}>
                  <Button name="updateLogo" tag={Link} to="/settings">
                    Change Logo
                  </Button>
                </Col>
              </FormGroup>

              {/* company address -> pull from DB */}
              <FormGroup row>
                <Label for="businessAddress" sm={3}>
                  Company Address
                </Label>
                <Col sm={9}>
                  <InputGroup>
                    <Input
                      id="companyAddress"
                      placeholder="name, address, city, state, zip"
                      disabled
                      value={`${this.props.companyName}, ${
                        this.props.companyAddress
                      }`}
                    />
                  </InputGroup>
                  <FormText color="muted">
                    The logo and address above will appear on your invoice.
                  </FormText>
                </Col>
              </FormGroup>

              {/* customer's address -> may convert to dropdown button to pre-populate with existing customer addresses */}
              <FormGroup row>
                <Label for="customerAddress" sm={3}>
                  Customer Address
                </Label>
                <Col sm={9}>
                  <Input
                    type="textarea"
                    name="text"
                    id="customerAddress"
                    onChange={this.handleCustomerAddressChange}
                    value={this.props.customerAddress}
                  />
                </Col>
              </FormGroup>

              {/* invoice number, currently accepts numeric typing only -> should pre-populate */}
              <FormGroup row>
                <Label for="invoiceNumber" sm={3}>
                  Invoice #
                </Label>
                <Col sm={9}>
                  <Input
                    type="number"
                    name="invoiceNumber"
                    id="invoiceNumber"
                    placeholder="Invoice #"
                    onChange={this.handleInvoiceNumberChange}
                        value={this.props.invoiceNumber}
                  />
                  <FormText color="muted">
                    Please use only numbers in your main Invoice #.
                  </FormText>
                </Col>
              </FormGroup>

              {/* invoice number extension, accepts alpha numeric typing*/}
              <FormGroup row>
              <Label for="invoiceNumberExtension" sm={3}>
                Invoice Extension
              </Label>
              <Col sm={9}>
                <Input
                  type="text"
                  name="invoiceNumberExtension"
                  id="invoiceNumberExtension"
                  placeholder="Invoice Extension"
                  onChange={this.handleInvoiceNumberExtensionChange}
                  value={this.props.invoiceNumberExtension}
                  maxLength={27-(this.props.invoiceNumber).toString().length}
                />
                <FormText color="muted">
                  Letters or hyphenated sections can be added here.
                </FormText>
              </Col>
            </FormGroup>
            
              {/* current date picker -> defaults to today */}
              <FormGroup row>
                <Label for="currentDate" sm={3}>
                  Current Date
                </Label>
                <Col sm={9}>
                  <CurrentDatePicker
                    changeInvoiceDate={this.props.changeInvoiceDate} {...this.props}
                  />
                </Col>
              </FormGroup>

              {/* due date picker -> highlights 7,14,30,60 days out */}
              <FormGroup row>
                <Label for="dueDate" sm={3}>
                  Due Date
                </Label>
                <Col sm={9}>
                    <DueDatePicker changeDueDate={this.props.changeDueDate} {...this.props} />
                </Col>
              </FormGroup>

              {/* amount due -> state should be passed in from index by way of footer & table.
                      (grand total - deposit)
                      */}
              <FormGroup row>
                <Label for="amountDue" sm={3}>
                  Amount Due
                </Label>
                <Col sm={9}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      placeholder={
                        !this.props.amountDue
                          ? "Amount Due"
                          : this.props.amountDue
                      }
                      type="text"
                      value={this.props.amountDue}
                      disabled
                    />
                  </InputGroup>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
