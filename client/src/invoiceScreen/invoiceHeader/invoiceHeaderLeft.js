import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, FormText } from "reactstrap";

export default class InvoiceHeaderLeft extends Component {
  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="businessLogo" hidden>Your logo</Label>
          <Input type="file" name="business logo" id="businessLogo" size='lg' />
          <FormText color="muted">
            Please upload your logo as either a jpg, png, or svg file.
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label for="businessAddress" hidden >Your Address</Label>
          <Input type="textarea" name="text" id="businessAddress" />
        </FormGroup>
        <FormGroup>
          <Label for="customerAddress" hidden>Customer Address</Label>
          <Input type="textarea" name="text" id="customerAddress" />
        </FormGroup>
      </Form>
    );
  }
}
