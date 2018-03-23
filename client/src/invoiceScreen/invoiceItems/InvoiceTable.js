import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Container, Row, Col } from "reactstrap";

export default class InvoiceItemsTable extends Component {
  // constructor(props) {
  //   state = {
  //     data: this.billableItems
  //   };
  // }

  itemNameValidator = (value, row) => {
    const response = {isValid: true, notification: {type: 'success', msg: '', title:''}}
    if (!value) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Please enter an item name';
      response.notification.title = 'No Item Name';
    } else if (value.length < 3) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Items must be at least three characters';
      response.notification.title = 'Invalid Item Length'
    }
    return response;
  }

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

    const selectRowProp = {
      mode: "checkbox"
    };

    const cellEditProp = {
      mode: "click"
    };

    const options = {
      insertText: "Add Line Item",
      deleteText: "Delete Line Item",
      noDataText: "No billable items"
    };

    return (
      <Container>
        <Row>
          <Col>
          {/* table options */}
            <BootstrapTable
              data={billableItems}
              striped
              hover
              condensed
              options={options}
              version="4"
              deleteRow={true}
              insertRow={true}
              selectRow={selectRowProp}
              cellEdit={cellEditProp}
            >

            {/* id field */}
              <TableHeaderColumn dataField="id" isKey width="10">
                #
              </TableHeaderColumn>

              {/* item field */}
              <TableHeaderColumn dataField="item" width="200" editable={{ validator: this.itemNameValidator}} >
                Item
              </TableHeaderColumn>

              {/* quantity field */}
              <TableHeaderColumn
                dataField="qty"
                width="30"
                tdStyle={{ whiteSpace: "tight" }}
              >
                Quantity
              </TableHeaderColumn>

              {/* rate field */}
              <TableHeaderColumn
                dataField="rate"
                width="30"
                tdStyle={{ whiteSpace: "tight" }}
              >
                Rate
              </TableHeaderColumn>

              {/* amount field */}
              <TableHeaderColumn dataField="amount" width="30">
                Amount
              </TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Container>
    );
  }
}
