import React, { Component } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class InvoiceFooter extends Component {
  render() {
    return (
      <div>
      {/* this container holds everything */}
        <Container>
          <Row>
          {/* left side of footer */}
            <Col>
              <Container>
                <Row>
                {/* restricts the size of the form */}
                  <Col xs={{ size: 12, offset: 0.5 }}>
                    <Form>
                    {/* Notes from company to customer */}
                      <FormGroup row>
                        <Label for="Notes" sm={2}>
                          Notes
                        </Label>
                        <Col sm={10}>
                          <Input type="text" />
                        </Col>
                      </FormGroup>

                      {/* repayment terms -> might pull from dueDatePicker */}
                      <FormGroup row>
                        <Label for="Terms" sm={2}>
                          Terms
                        </Label>
                        <Col sm={10}>
                          <Input type="text" />
                        </Col>
                      </FormGroup>

                    </Form>
                  </Col>
                </Row>
              </Container>
            </Col>

            {/* Right side of footer*/}
            <Col>

            {/* Form first because of multiple columns */}
              <Form>
                <Container>
                  <Row>
                  {/* constrains the size of the items below */}
                    <Col xs={{ size: 12, offset: 0.5 }}>

                    {/* subtotal will inherit it's state from the index, which is passed from the table*/}
                      <FormGroup row>
                        <Label for="subtotal" sm={2}>
                          Subtotal
                        </Label>
                        <Col sm={10}>
                          <Input type="text" disabled />
                        </Col>
                      </FormGroup>

                      {/* tax increases the subtotal by x% -> for now, will be applied AFTER the discount */}
                      <FormGroup row>
                        <Label for="tax" sm={2}>
                          Tax
                        </Label>
                        <Col sm={4}>
                          <Input type="number" placeholder="%" />
                        </Col>

                        {/* shipping field increases the total plus tax -> tax is paid by the company, should be passed on to the customer */}
                        <Label for="shipping" sm={2}>
                          Shipping
                        </Label>
                        <Col sm={4}>
                          <Input type="number" placeholder="$" />
                        </Col>
                      </FormGroup>

                      {/* Discount given to customer -> for now, decreases the subtotal before it goes to tax */}
                      <FormGroup row>
                        <Label for="discount" sm={2}>
                          Discount
                        </Label>
                        <Col sm={4}>
                          <Input type="number" placeholder="%" />
                        </Col>

                        {/* displays the amount the customer pre-paid */}
                        <Label for="deposit" sm={2}>
                          Deposit
                        </Label>
                        <Col sm={4}>
                          <Input type="number" placeholder="$" />
                        </Col>
                      </FormGroup>

                      {/* (((subtotal - discount) + tax) + shipping) */}
                      <FormGroup row>
                        <Label for="grandTotal" sm={2}>
                          Grand Total
                        </Label>
                        <Col sm={10}>
                          <Input type="number" disabled />
                        </Col>
                      </FormGroup>

                    </Col>
                  </Row>
                </Container>
              </Form>
              
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
