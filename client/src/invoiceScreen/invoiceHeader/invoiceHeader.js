import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

import InvoiceHeaderLeft from "./invoiceHeaderLeft";
import InvoiceHeaderRight from "./invoiceHeaderRight";

export default class InvoiceHeader extends Component {
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col>
              <InvoiceHeaderLeft />
            </Col>

            <Col>
              <InvoiceHeaderRight />
            </Col>
          </Row>
        </Container>

      </div>
    );
  }
}
