import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Container, Row, Col } from "reactstrap";

export default class InvoiceItemsTable extends Component {
  render() {
    const billableItems = [
      {
        id: 1,
        item: "Primer - Gallon",
        qty: 1,
        rate: 21.99,
        amount: 21.99
      },
      {
        id: 2,
        item: "Gravity Grey Paint - Gallon",
        qty: 3,
        rate: 24.99,
        amount: 74.97
      },
      {
        id: 3,
        item: "Misc. Supplies",
        qty: 1,
        rate: 45.32,
        amount: 45.32
      },
      {
        id: 4,
        item: "Labor",
        qty: 5,
        rate: 70,
        amount: 350.00
      }
    ];

    return (
      <Container>
        <Row>
          <Col >
            <BootstrapTable
              data={billableItems}
              striped
              hover
              condensed
              options={{ noDataText: "No billable items" }}
              version="4"
            >
              <TableHeaderColumn dataField="id" isKey width='10'>#</TableHeaderColumn>
              <TableHeaderColumn dataField="item" width='200'>Item</TableHeaderColumn>
              <TableHeaderColumn dataField="qty" width='30'>Quantity</TableHeaderColumn>
              <TableHeaderColumn dataField="rate" width='30'>Rate</TableHeaderColumn>
              <TableHeaderColumn dataField="amount" width='30'>Amount</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Container>
    );
  }
}
