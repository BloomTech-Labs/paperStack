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

        <Container>
          <Row>
            <Col sm={{ size: 12, offset: 0.5 }}>
            <Form>
              <FormGroup row>
                <Label for="businessLogo" sm={4}>
                  Your Company Logo
                </Label>
                <Col sm={8}>
                <Input
                  type="file"
                  name="business logo"
                  id="businessLogo"
                />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="businessAddress" sm={2}>
                  Your Address
                </Label>
                <Col sm={10}>
                <Input type="textarea" name="text" id="businessAddress" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="customerAddress" sm={2}>
                  Customer Address
                </Label>
                <Col sm={10}>
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
