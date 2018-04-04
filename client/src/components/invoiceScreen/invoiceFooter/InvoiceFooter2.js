import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon
} from "reactstrap";

export default class InvoiceFooter2 extends Component {

  componentDidMount() {
    // axios calls here to retreive data
  }

  // componentWillUnmount() {
  //   // use this later to save the current state of the invoice when we go change the logo
  // }

  // tax changes by user input, passed up to state and received back
  handleTaxChange(e) {
    this.props.changeTax(e.target.value);
    this.props.calculateGrandTotal(this.props.grandTotal);
    this.props.calculateAmountDue(this.props.amountDue);
  }

  handleDiscountChange(e) {
    this.props.changeDiscount(e.target.value);
    this.props.calculateGrandTotal(this.props.grandTotal);
    this.props.calculateAmountDue(this.props.amountDue);
  }

  handleDepositChange(e) {
    this.props.changeDeposit(e.target.value);
    this.props.calculateAmountDue(this.props.amountDue);
  }

  handleGrandTotalChange(e) {
    this.props.calculateGrandTotal(this.props.grandTotal);
  }

  handleShippingChange(e) {
    this.props.changeShipping(e.target.value);
    this.props.calculateGrandTotal(this.props.grandTotal);
    this.props.calculateAmountDue(this.props.amountDue);
  }

  handleSubtotalChange(e) {
    this.props.changeSubtotal(e.target.value);
    this.props.calculateGrandTotal(this.props.grandTotal);
    this.props.calculateAmountDue(this.props.amountDue);
  }

  handleAmountDueChange(e) {
    this.props.calculateAmountDue(this.props.amountDue);
  }

  render() {
    return (
      <div style={{ width: "90%", margin: "auto" }}>
          <Form>
            {/* Discount given to customer -> for now, decreases the subtotal before it goes to tax */}
            <FormGroup row>
              <Label for="discount" sm={1}>
                Discount
              </Label>
              <Col sm={3}>
                <InputGroup>
                  <Input
                    name="discount"
                    type="number"
                    step='0.01'
                    placeholder="reduces the subtotal by a percentage"
                    onBlur={this.handleDiscountChange.bind(this)}
                    onFocusOut={this.handleGrandTotalChange.bind(this)}
                  />
                  <InputGroupAddon addonType="append">%</InputGroupAddon>
                </InputGroup>
              </Col>

              {/* tax increases the subtotal by x% -> for now, will be applied AFTER the discount */}
              <Label for="tax" sm={1}>
                Tax
              </Label>
              <Col sm={3}>
                <InputGroup>
                  <Input
                    name="tax"
                    type="number"
                    step='.01'
                    placeholder="increases by your tax rate"
                    onBlur={this.handleTaxChange.bind(this)}
                  />
                  <InputGroupAddon addonType="append">%</InputGroupAddon>
                </InputGroup>
              </Col>

              {/* shipping field increases the total plus tax -> tax is paid by the invoicing company, should be passed on to the customer */}
              <Label for="shipping" sm={1}>
                Shipping
              </Label>
              <Col sm={3}>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                  <Input
                    name='shipping'
                    type="number"
                    step='.01'
                    placeholder="your full shipping charges"
                    onBlur={this.handleShippingChange.bind(this)}
                  />
                </InputGroup>
              </Col>
            </FormGroup>

            <Row>
              <Col>
              {/* grandTotal includes discount, tax, and shipping, but NOT deposit */}
                <FormGroup row>
                  <Label for="grandTotal" sm={1}>
                    Total
                  </Label>
                  <Col sm={11}>
                  <InputGroup>
                  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      name='grandTotal'
                      type="text"
                      disabled
                      value={this.props.grandTotal}
                    />
                    </InputGroup>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  {/* displays the amount the customer pre-paid */}
                  <Label for="deposit" sm={1}>
                    Deposit
                  </Label>
                  <Col sm={11}>
                  <InputGroup>
                  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      name='deposit'
                      type="number"
                      step='.01'
                      placeholder='amount pre-paid by the customer, if any'
                      onBlur={this.handleDepositChange.bind(this)}
                    />
                    </InputGroup>
                  </Col>
                </FormGroup>

                {/* amountDue is grandTotal less deposit */}
                <FormGroup row>
                  <Label for="amountDue" sm={1}>
                    Amount Due
                  </Label>
                  <Col sm={11}>
                  <InputGroup>
                  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      name='amountDue'
                      type="text"
                      disabled
                      value={this.props.amountDue}
                    />
                    </InputGroup>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                {/* Notes from invoicing company to customer */}
                <FormGroup row>
                  <Label for="Notes" sm={1}>
                    Notes
                  </Label>
                  <Col sm={11}>
                    <Input 
                      name='notes'
                      type="text" 
                      placeholder='any notes for the customer' />
                  </Col>
                  </FormGroup>

                  <FormGroup row>
                  {/* payment terms -> might pull from dueDatePicker later, presently filled in by hand */}
                  <Label for="Terms" sm={1}>
                    Terms
                  </Label>
                  <Col sm={11}>
                    <Input 
                      name='terms'
                      type="text" 
                      placeholder='payment terms' />
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </Form>
      </div>
    );
  }
}
