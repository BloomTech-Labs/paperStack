import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

import InvoiceHeaderLeft from "./invoiceHeaderLeft";
import InvoiceHeaderRight from "./invoiceHeaderRight";

export default class InvoiceHeader extends Component {
  render() {
    return (
      <div className="invoiceHeader">
        <Container className='invoiceHeaderContainer'>
          <Row className='invoiceHeaderContainerOuterRow'>
            <Col className='invoiceHeaderContainerOuterColLeft'>
              <InvoiceHeaderLeft />
            </Col>

            <Col className='invoiceHeaderContainerOuterColRight'>
              <InvoiceHeaderRight />
            </Col>
          </Row>
        </Container>

      </div>
    );
  }
}
