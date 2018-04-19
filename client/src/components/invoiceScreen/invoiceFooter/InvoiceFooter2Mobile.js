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
import moment from "moment";

export default class InvoiceFooter2 extends Component {
  /**
   * these functions handle passing the changes in the fields back up to index
   */
  handleDiscountChange = e => {
    this.props.changeDiscount(e.target.value);
    this.props.calculateGrandTotal(this.props.grandTotal);
    this.props.calculateAmountDue(this.props.amountDue);
  };

  handleTaxChange = e => {
    this.props.changeTax(e.target.value);
    this.props.calculateGrandTotal(this.props.grandTotal);
    this.props.calculateAmountDue(this.props.amountDue);
  };

  handleShippingChange = e => {
    this.props.changeShipping(e.target.value);
    this.props.calculateGrandTotal(this.props.grandTotal);
    this.props.calculateAmountDue(this.props.amountDue);
  };

  handleDepositChange = e => {
    this.props.changeDeposit(e.target.value);
    this.props.calculateAmountDue(this.props.amountDue);
  };

  handleGrandTotalChange = e => {
    this.props.calculateGrandTotal(this.props.grandTotal);
  };

  handleSubtotalChange = e => {
    this.props.changeSubtotal(e.target.value);
    this.props.calculateGrandTotal(this.props.grandTotal);
    this.props.calculateAmountDue(this.props.amountDue);
  };

  handleAmountDueChange = e => {
    this.props.calculateAmountDue(this.props.amountDue);
  };

  handleNotesChange = e => {
    this.props.changeNotes(e.target.value);
  };

  handleTermsChange = e => {
    this.props.changeTerms(e.target.value);
  };

  render() {
    return (
      <div style={{ width: "90%", margin: "auto" }}>
        <Form>
          <Row>
            <Col sm={{ size: 12, offset: 0.5 }}>
              <FormGroup row>
                {/* Discount given to customer -> decreases the subtotal before it goes to tax */}
                <Label for="discount" sm={1}>
                  Discount
                </Label>
                <Col sm={3}>
                  <InputGroup>
                    <Input
                      name="discount"
                      type="number"
                      step="0.01"
                      placeholder="reduces the subtotal by a percentage"
                      onChange={this.handleDiscountChange.bind(this)}
                      value={this.props.discount}
                    />
                    <InputGroupAddon addonType="append">%</InputGroupAddon>
                  </InputGroup>
                </Col>
              </FormGroup>

              <FormGroup row>
                {/* tax increases the subtotal by x% -> applied AFTER the discount */}
                <Label for="tax" sm={1}>
                  Tax
                </Label>
                <Col sm={3}>
                  <InputGroup>
                    <Input
                      name="tax"
                      type="number"
                      step=".01"
                      placeholder="increases by your tax rate"
                      onChange={this.handleTaxChange}
                      value={this.props.tax}
                    />
                    <InputGroupAddon addonType="append">%</InputGroupAddon>
                  </InputGroup>
                </Col>
              </FormGroup>

              <FormGroup row>
                {/* shipping field increases the total plus tax -> tax is paid by the invoicing company for shipping, should be passed on to the customer */}
                <Label for="shipping" sm={1}>
                  Shipping
                </Label>
                <Col sm={3}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      name="shipping"
                      type="number"
                      step=".01"
                      placeholder="your full shipping charges"
                      onChange={this.handleShippingChange}
                      value={this.props.shipping}
                    />
                  </InputGroup>
                </Col>
              </FormGroup>

              {/* grandTotal includes discount, tax, and shipping, but NOT deposit */}
              <FormGroup row>
                <Label for="grandTotal" sm={1}>
                  Total
                </Label>
                <Col sm={11}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      name="grandTotal"
                      type="text"
                      disabled
                      value={this.props.grandTotal}
                    />
                  </InputGroup>
                </Col>
              </FormGroup>

              {/* displays the amount the customer pre-paid */}
              <FormGroup row>
                <Label for="deposit" sm={1}>
                  Deposit
                </Label>
                <Col sm={11}>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                    <Input
                      name="deposit"
                      type="number"
                      step=".01"
                      placeholder="amount pre-paid by the customer, if any"
                      onChange={this.handleDepositChange}
                      value={this.props.deposit}
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
                      name="amountDue"
                      type="text"
                      disabled
                      value={this.props.amountDue}
                    />
                  </InputGroup>
                </Col>
              </FormGroup>

              {/* Notes from invoicing company to customer */}
              <FormGroup row>
                <Label for="Notes" sm={1}>
                  Notes
                </Label>
                <Col sm={11}>
                  <Input
                    name="notes"
                    type="text"
                    placeholder="any notes for the customer"
                    onChange={this.handleNotesChange}
                    value={this.props.notes}
                    maxLength="200"
                  />
                </Col>
              </FormGroup>

              {/* payment terms -> automatically filled by the difference between the invoice date and the due date */}
              <FormGroup row>
                <Label for="Terms" sm={1}>
                  Terms
                </Label>
                <Col sm={11}>
                  <Input
                    name="terms"
                    type="text"
                    placeholder="payment terms"
                    onBlur={this.handleTermsChange}
                    value={
                      moment(this.props.dueDate).diff(
                        this.props.invoiceDate,
                        "days"
                      ) === 0
                        ? `Please remit payment immediately`
                        : moment(this.props.dueDate).diff(
                            this.props.invoiceDate,
                            "days"
                          ) === 1
                          ? `Payment is due within ${moment(
                              this.props.dueDate
                            ).diff(
                              this.props.invoiceDate,
                              "days"
                            )} day from the date on this invoice.`
                          : `Payment is due within ${moment(
                              this.props.dueDate
                            ).diff(
                              this.props.invoiceDate,
                              "days"
                            )} days from the date on this invoice.`
                    }
                    readOnly
                    // disabled
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
