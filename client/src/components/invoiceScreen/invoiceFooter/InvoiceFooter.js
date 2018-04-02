import React, { Component } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class InvoiceFooter extends Component {
  // tax changes by user input, passed up to state and received back
  handleTaxChange(event) {
    event.preventDefault()
    const tax = event.target.value;
    const grandTotal = this.props.grandTotal;
    this.props.changeTax(tax);
    this.props.calculateGrandTotal(grandTotal);
  }

  handleDiscountChange(e) {
    const discount = e.target.value;
    const grandTotal = this.props.grandTotal;
    this.props.changeDiscount(discount);
    this.props.calculateGrandTotal(grandTotal);
  }

  handleDepositChange(e) {
    const deposit = e.target.value;
    this.props.changeDeposit(deposit);
  }

  handleGrandTotalChange(e) {
    const grandTotal = this.props.grandTotal;
    this.props.calculateGrandTotal(grandTotal);
  }

  handleShippingChange(e) {
    const shipping = e.target.value;
    const grandTotal = this.props.grandTotal;
    this.props.changeShipping(shipping);
    this.props.calculateGrandTotal(grandTotal);
  }

  handleSubtotalChange(e) {
    const subtotal = e.target.value;
    const grandTotal = this.props.grandTotal;
    this.props.changeSubtotal(subtotal);
    this.props.calculateGrandTotal(grandTotal);
  }

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
                          <Input
                            type="text"
                            disabled
                            placeholder={"$"}
                            value={
                              !this.props.subtotal ? "$" : this.props.subtotal
                            }
                          />
                        </Col>
                      </FormGroup>

                      {/* tax increases the subtotal by x% -> for now, will be applied AFTER the discount */}
                      <FormGroup row>
                        <Label for="tax" sm={2}>
                          Tax
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="number"
                            placeholder="%"
                            onChange={this.handleTaxChange.bind(this)}
                          />
                        </Col>

                        {/* shipping field increases the total plus tax -> tax is paid by the company, should be passed on to the customer */}
                        <Label for="shipping" sm={2}>
                          Shipping
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="number"
                            placeholder="$"
                            onChange={this.handleShippingChange.bind(this)}
                          />
                        </Col>
                      </FormGroup>

                      {/* Discount given to customer -> for now, decreases the subtotal before it goes to tax */}
                      <FormGroup row>
                        <Label for="discount" sm={2}>
                          Discount
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="number"
                            placeholder="%"
                            onChange={this.handleDiscountChange.bind(this)}
                          />
                        </Col>

                        {/* displays the amount the customer pre-paid */}
                        <Label for="deposit" sm={2}>
                          Deposit
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="number"
                            placeholder="$"
                            onChange={this.handleDepositChange.bind(this)}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="grandTotal" sm={2}>
                          Grand Total
                        </Label>
                        <Col sm={10}>
                          <Input
                            type="text"
                            disabled
                            placeholder={"$"}
                            value={!this.props.grandTotal ? 0 : this.props.grandTotal}
                          />
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
