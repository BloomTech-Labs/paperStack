import React, { Component } from "react";
import { Container, Row, Col, Form, FormGroup, Label, Input } from "reactstrap";

export default class InvoiceFooter extends Component {
  componentDidMount() {
  this.handleAmountDueChange();
  this.handleGrandTotalChange();
  // axios calls here to retreive data
  }

  // did not give the desired result
  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.tax !== nextProps.tax || this.props.discount !== nextProps.discount || this.props.deposit !== nextProps.deposit || this.props.shipping !== nextProps.shipping || this.props.grandTotal !== nextProps.grandTotal
  // }

  // getDerivedStateFromProps(nextProps) {
  //   if (nextProps.discount !== this.props.discount) {
  //     this.setState({ discount: nextProps.discount });
  //   }
  //   if (nextProps.tax !== this.props.tax) {
  //     this.setState({ tax: nextProps.tax });
  //   }
  //   if (nextProps.shipping !== this.props.shipping) {
  //     this.setState({ shipping: nextProps.shipping });
  //   }
  //   if (nextProps.deposit !== this.props.deposit) {
  //     this.setState({ deposit: nextProps.deposit });
  //   }
  // }

  // componentDidUpdate(_, previousState) {
  //   // might not use this exploring componentWillReceiveProps
  //   // but is used in cases where you don't know why something is updating
  //   console.log(previousState);
  //   console.log(this.state)
  // }

  // componentWillUnmount() {
  //   // use this later to save the current state of the invoice when we go change the logo
  // }

  // tax changes by user input, passed up to state and received back
  handleTaxChange(e) {
    const tax = e.target.value;
    const grandTotal = this.props.grandTotal;
    const amountDue = this.props.amountDue;
    this.props.calculateAmountDue(amountDue);
    this.props.changeTax(tax);
    this.props.calculateGrandTotal(grandTotal);
  }

  handleDiscountChange(e) {
    const discount = e.target.value;
    const grandTotal = this.props.grandTotal;
    const amountDue = this.props.amountDue;
    this.props.calculateAmountDue(amountDue);
    this.props.changeDiscount(discount);
    this.props.calculateGrandTotal(grandTotal);
  }

  handleDepositChange(e) {
    const deposit = e.target.value;
    const amountDue = this.props.amountDue;
    this.props.changeDeposit(deposit);
    this.props.calculateAmountDue(amountDue);
  }

  handleGrandTotalChange(e) {
    const grandTotal = this.props.grandTotal;
    this.props.calculateGrandTotal(grandTotal);
  }

  handleShippingChange(e) {
    const shipping = e.target.value;
    const grandTotal = this.props.grandTotal;
    const amountDue = this.props.amountDue;
    this.props.calculateAmountDue(amountDue);
    this.props.changeShipping(shipping);
    this.props.calculateGrandTotal(grandTotal);
  }

  handleSubtotalChange(e) {
    const subtotal = e.target.value;
    const grandTotal = this.props.grandTotal;
    const amountDue = this.props.amountDue;
    this.props.calculateAmountDue(amountDue);
    this.props.changeSubtotal(subtotal);
    this.props.calculateGrandTotal(grandTotal);
  }

  handleAmountDueChange(e) {
    const amountDue = this.props.amountDue;
    this.props.calculateAmountDue(amountDue);
  }

  render() {
    return (
      <div style={{ width: "90%", margin: "auto" }}>
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
                      {/*<FormGroup row>
                        <Label for="subtotal" sm={2}>
                          Subtotal
                        </Label>
                        <Col sm={10}>
                          <Input
                            type="text"
                            disabled
                            placeholder={"$"}
                            value={
                              !this.props.subtotal ? "$" : `$${this.props.subtotal}`
                            }
                          />
                        </Col>
                          </FormGroup>*/}

                      {/* Discount given to customer -> for now, decreases the subtotal before it goes to tax */}
                      <FormGroup row>
                        <Label for="discount" sm={2}>
                          Discount
                        </Label>
                        <Col sm={4}>
                          <Input
                            type="number"
                            // placeholder="%"
                            onBlur={this.handleDiscountChange.bind(this)}
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
                            onBlur={this.handleDepositChange.bind(this)}
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
                            onBlur={this.handleTaxChange.bind(this)}
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
                            onBlur={this.handleShippingChange.bind(this)}
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="grandTotal" sm={2}>
                          Total
                        </Label>
                        <Col sm={10}>
                          <Input
                            type="text"
                            disabled
                            placeholder={"$"}
                            value={
                              this.props.grandTotal
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                      <Label for="amountDue" sm={2}>
                        Amount Due
                      </Label>
                      <Col sm={10}>
                        <Input
                          type="text"
                          disabled
                          placeholder={"$"}
                          value={
                            this.props.amountDue
                          }
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
