import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import tempLogo from "../invoiceHeader/tempLogo.svg";

export default class InvoiceHeaderLeft extends Component {
  constructor(props) {
    super(props);

    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col sm={{ size: 12, offset: 0.5 }}>
            <Form>
              <FormGroup row>
                <Label for="businessLogo" sm={3}>
                  Your Logo
                </Label>
                <Col sm={2}>
                  <img src={tempLogo} alt="company logo" />
                </Col>
                <Col sm={4}>
                  <p>This logo will appear on your invoice</p>
                </Col>
                <Col sm={3}>
                  <Button name="updateLogo">Change Logo</Button>
                </Col>
              </FormGroup>

              {/* business address*/}
              <FormGroup row>
                <Label for="businessAddress" sm={3}>
                  Your Address
                </Label>
                <Col sm={9}>
                  <InputGroup>
                    <Input />
                    <InputGroupButtonDropdown
                      addonType="append"
                      isOpen={this.state.dropdownOpen}
                      toggle={this.toggleDropDown}
                    >
                      <DropdownToggle caret>Select Address</DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Primary Address</DropdownItem>
                        <DropdownItem divider />
                        <DropdownItem disabled>Secondary Address</DropdownItem>
                      </DropdownMenu>
                    </InputGroupButtonDropdown>
                  </InputGroup>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="customerAddress" sm={3}>
                  Customer Address
                </Label>
                <Col sm={9}>
                  <Input type="textarea" name="text" id="customerAddress" />
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}
