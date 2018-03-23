import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  InputGroup,
  InputGroupAddon
} from "reactstrap";
import DueDatePicker from "./dueDatePicker";
import CurrentDatePicker from "./currentDatePicker";

export default class InvoiceHeaderRight extends Component {
  render() {
    return (
      <div>
        <Form>
          <FormGroup>
            <Label for="invoiceNumber" hidden>
              Invoice #
            </Label>
            <Input
              type="email"
              name="invoiceNumber"
              id="invoiceNumber"
              placeholder="Invoice #"
            />
          </FormGroup>
        </Form>
        <CurrentDatePicker />
        <DueDatePicker />
        <InputGroup>
          <Label for="amountDue">Amount Due</Label>
          <InputGroupAddon addonType="prepend">$</InputGroupAddon>
          <Input
            placeholder={!this.amountDue ? "Amount Due" : this.amountDue}
            type="number"
            disabled
          />
        </InputGroup>
      </div>
    );
  }
}
