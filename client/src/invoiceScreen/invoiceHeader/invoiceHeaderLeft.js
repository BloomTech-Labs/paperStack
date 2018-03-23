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

export default class InvoiceHeaderLeft extends Component {
  render() {
    return (
      <Form>
        <Container>
          <Row>
            <Col sm={{ size: 12, offset: 1 }}>
              <FormGroup>
                <Label for="businessLogo">
                  Your company logo
                </Label>
                <Input
                  type="file"
                  name="business logo"
                  id="businessLogo"
                  size="sm"
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs={{ size: 12, offset: 1 }}>
              <FormGroup>
                <Label for="businessAddress">
                  Your Address
                </Label>
                <Input type="textarea" name="text" id="businessAddress" size="xs"/>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col xs={{ size: 12, offset: 1 }}>
              <FormGroup>
                <Label for="customerAddress" >
                  Customer Address
                </Label>
                <Input type="textarea" name="text" id="customerAddress" size="xs"/>
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </Form>
    );
  }
}
