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
      <Container>
        <Row>
          <Col xs={{ size: 12, offset: 0.5 }}>
            <Form>
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
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="currentDate" sm={3}>
                  Current Date
                </Label>
                <Col sm={9}>
                  <CurrentDatePicker />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="dueDate" sm={3}>
                  Due Date
                </Label>
                <Col sm={9}>
                  <DueDatePicker />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="amountDue" sm={3}>
                  Amount Due
                </Label>
                <Col sm={9}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      placeholder={
                        !this.amountDue ? "Amount Due" : this.amountDue
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
    );
  }
}
