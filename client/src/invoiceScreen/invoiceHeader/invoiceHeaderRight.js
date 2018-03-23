import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  InputGroup,
  InputGroupAddon,
  Container,
  Row,
  Col
} from "reactstrap";
import DueDatePicker from "./dueDatePicker";
import CurrentDatePicker from "./currentDatePicker";

export default class InvoiceHeaderRight extends Component {
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col sm={{ size: 8, offset: 1 }}>
              <Form>
                <FormGroup>
                  <Label for="invoiceNumber">
                    Invoice #
                  </Label>
                  <Input
                    type="number"
                    name="invoiceNumber"
                    id="invoiceNumber"
                    placeholder="Invoice #"
                  />
                </FormGroup>
              </Form>
            </Col>
          </Row>

          <Row>
            <Col sm={{ size: 8, offset: 1 }}>
            <Label for="currentDate">Current Date</Label>
              <CurrentDatePicker />
            </Col>
          </Row>

          <Row>
            <Col sm={{ size: 8, offset: 1 }}>
            <Label for="dueDate">Due Date</Label>
              <DueDatePicker />
            </Col>
          </Row>

          <Row>
            <Col sm={{ size: 8, offset: 1 }}>
            <Label for="amountDue">Amount Due</Label>
              <InputGroup>
                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                <Input
                  placeholder={!this.amountDue ? "Amount Due" : this.amountDue}
                  type="number"
                  disabled
                />
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
