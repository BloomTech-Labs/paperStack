import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Container,
  Row,
  Col
} from "reactstrap";

export default class InvoiceFooterRight extends Component {
  render() {
    return (
      <Form>
        <Container>
          <Row>
            <Col xs={{ size: 12, offset: 0.5 }}>
              <Form>
                <FormGroup row>
                  <Label for="subtotal" sm={2}>
                    Subtotal
                  </Label>
                  <Col sm={10}>
                    <Input type="text" disabled />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label for="tax" sm={2}>
                    Tax
                  </Label>
                  <Col sm={4}>
                    <Input type="number" placeholder="%" />
                  </Col>
    
                  <Label for="shipping" sm={2}>
                    Shipping
                  </Label>
                  <Col sm={4}>
                    <Input type="number" placeholder="$" />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label for="discount" sm={2}>
                    Discount
                  </Label>
                  <Col sm={4}>
                    <Input type="number" placeholder="%" />
                  </Col>

                  <Label for="deposit" sm={2}>
                    Deposit
                  </Label>
                  <Col sm={4}>
                    <Input type="number" placeholder="$" />
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label for="grandTotal" sm={2}>
                    Grand Total
                  </Label>
                  <Col sm={10}>
                    <Input type="number" disabled />
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </Form>
    );
  }
}
