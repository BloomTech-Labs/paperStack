import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

import InvoiceHeaderLeft from "./invoiceHeaderLeft";
import InvoiceHeaderRight from "./invoiceHeaderRight";
import currentDatePicker from './currentDatePicker';

export default class InvoiceHeader extends Component {
  render() {
    return (
      <div>
      <Container>
        <Row>
          <Col xl={{ size: 'auto', offset: 1 }}>
            <InvoiceHeaderLeft />
          </Col>
          <Col xl={{ size: 'auto', offset: 1 }}>
            <InvoiceHeaderRight />
          </Col>
        </Row>
      </Container>
      <currentDatePicker />
      </div>
    );
  }
}
