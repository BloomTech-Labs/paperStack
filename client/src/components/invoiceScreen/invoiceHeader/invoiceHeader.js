import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import currencyFormatter from "currency-formatter";

import tempLogo from "../invoiceHeader/tempLogo.svg";

import DueDatePicker from "./dueDatePicker";
import CurrentDatePicker from "./currentDatePicker";

import "react-datepicker/dist/react-datepicker.css";

export default class InvoiceHeader extends Component {
  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  handleAmountDueChange(event) {
    const amountDue = event.target.value;
    this.props.calculateAmountDue(amountDue);
  }
  // this updates the AmountDue line in response to changes in the footer
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.amountDue !== this.props.amountDue) {
  //     this.setState({ count: nextProps.amountDue });
  //   }
  // }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <div>
        {/* This container holds everything */}
        <Container>
          <Row>
            {/* Left side of header */}
            <Col>
              {/* holds left items */}
              <Container>
                <Row>
                  {/* constrains the size of the column */}
                  <Col sm={{ size: 12, offset: 0.5 }}>
                    <Form>
                      {/* display the company logo -> currently hard wired */}
                      <FormGroup row>
                        <Label for="businessLogo" sm={3}>
                          Your Logo
                        </Label>
                        <Col sm={2}>
                          <img src={tempLogo} alt="company logo" />
                        </Col>
                        <Col sm={4}>
                          <p>This logo will appear on your invoice</p>
                        </Col>
                        <Col sm={3}>
                          <Button name="updateLogo">Change Logo</Button>
                        </Col>
                      </FormGroup>

                      {/* business address -> dropdown to select existing address */}
                      <FormGroup row>
                        <Label for="businessAddress" sm={3}>
                          Your Address
                        </Label>
                        <Col sm={9}>
                          <InputGroup>
                            <Input />
                            <InputGroupButtonDropdown
                              addonType="append"
                              isOpen={this.state.dropdownOpen}
                              toggle={this.toggleDropDown}
                            >
                              <DropdownToggle caret>
                                Select Address
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>Primary Address</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem disabled>
                                  Secondary Address
                                </DropdownItem>
                              </DropdownMenu>
                            </InputGroupButtonDropdown>
                          </InputGroup>
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
                          />
                        </Col>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </Col>

            {/* Right side of header */}
            <Col>
              <Container>
                <Row>
                  {/* constrain the proportions */}
                  <Col xs={{ size: 12 }}>
                    <Form>
                      {/* invoice number, currently accepts alpha numberic typing -> should pre-populate */}
                      <FormGroup row>
                        <Label for="invoiceNumber" sm={4}>
                          Invoice #
                        </Label>
                        <Col sm={8}>
                          <Input
                            type="text"
                            name="invoiceNumber"
                            id="invoiceNumber"
                            placeholder="Invoice #"
                            onChange={this.handleAmountDueChange.bind(this)}
                          />
                        </Col>
                      </FormGroup>

                      {/* current date picker -> defaults to today */}
                      <FormGroup row>
                        <Label for="currentDate" sm={4}>
                          Current Date
                        </Label>
                        <Col sm={8}>
                          <CurrentDatePicker />
                        </Col>
                      </FormGroup>

                      {/* due date picker -> highlights 7,14,30,60 days out */}
                      <FormGroup row>
                        <Label for="dueDate" sm={4}>
                          Due Date
                        </Label>
                        <Col sm={8}>
                          <DueDatePicker />
                        </Col>
                      </FormGroup>

                      {/* amount due -> state should be passed in from index by way of footer & table.
                      (grand total - deposit)
                      */}
                      <FormGroup row>
                        <Label for="amountDue" sm={4}>
                          Amount Due
                        </Label>
                        <Col sm={8}>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              $
                            </InputGroupAddon>
                            <Input
                              placeholder={
                                !this.props.amountDue ? "Amount Due" : currencyFormatter.format(this.props.amountDue, {code: 'USD'})
                              }
                              type="number"
                              disabled
                            />
                          </InputGroup>
                        </Col>
                      </FormGroup>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
