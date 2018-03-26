import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
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
          <Col xs={{ size: 12}}>
            <Form>
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
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="currentDate" sm={4}>
                  Current Date
                </Label>
                <Col sm={8}>
                  <CurrentDatePicker />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="dueDate" sm={4}>
                  Due Date
                </Label>
                <Col sm={8}>
                  <DueDatePicker />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="amountDue" sm={4}>
                  Amount Due
                </Label>
                <Col sm={8}>
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
