import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col
} from "reactstrap";

export default class InvoiceFooterLeft extends Component {
  render() {
    return (

        <Container>
          <Row>
            <Col xs={{ size: 12, offset: 0.5 }}>
              <Form>
                <FormGroup row>
                  <Label for="Notes" sm={2}>
                    Notes
                  </Label>
                  <Col sm={10}>
                    <Input type="text" />
                  </Col>
                </FormGroup>

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

    );
  }
}
