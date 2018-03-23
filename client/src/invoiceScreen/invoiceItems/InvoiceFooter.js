import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

import InvoiceFooterLeft from './InvoiceFooterLeft';
import InvoiceFooterRight from './InvoiceFooterRight';

export default class InvoiceFooter extends Component {
  render() {
    return (
      <div>
      <Container>
        <Row>
          <Col>
            <InvoiceFooterLeft />
          </Col>
          <Col>
            <InvoiceFooterRight />
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}
