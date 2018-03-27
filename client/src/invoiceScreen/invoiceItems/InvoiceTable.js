import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import currencyFormatter from 'currency-formatter';

import billableItems from '../billableItems.json'

export default class InvoiceItemsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: billableItems,

    // ^^ data must be presented as an array per docs
    };
  }

  /*
    These functions edit the modal for adding new rows of data
  */
  // items should not be blank, and should have at least 3 characters
  itemNameValidator = (value, row) => {
    const response = {
      isValid: true,
      notification: { type: "success", msg: "", title: "" }
    };
    if (!value) {
      response.isValid = false;
      response.notification.type = "error";
      response.notification.msg = "Please enter an item name";
      response.notification.title = "No Item Name";
    } else if (value.length < 3) {
      response.isValid = false;
      response.notification.type = "error";
      response.notification.msg = "Items must be at least three characters";
      response.notification.title = "Invalid Item Length";
    }
    return response;
  };

  // quantity should not be blank, and should only accept numbers
  quantityValidator = (value, row) => {
    const response = {
      isValid: true,
      notification: { type: "success", msg: "", title: "" }
    };
    const nan = isNaN(parseInt(value, 10));
    if (!value) {
      response.isValid = false;
      response.notification.type = "error";
      response.notification.msg = "Please enter a quantity";
      response.notification.title = "No Quantity Given";
    } else if (nan) {
      response.isValid = false;
      response.notification.type = "error";
      response.notification.msg = "Please use numbers only";
      response.notification.title = "Invalid Quantity Type";
    }
    return response;
  };

  // rate should not be blank, and should only accept numbers
  rateValidator = (value, row) => {
    const response = {
      isValid: true,
      notification: { type: "success", msg: "", title: "" }
    };
    const nan = isNaN(parseInt(value, 10));
    if (!value) {
      response.isValid = false;
      response.notification.type = "error";
      response.notification.msg = "Please enter a rate";
      response.notification.title = "No Rate Given";
    } else if (nan) {
      response.isValid = false;
      response.notification.type = "error";
      response.notification.msg = "Please use numbers only";
      response.notification.title = "Invalid Rate Type";
    }
    return response;
  };

  render() {

    // select a row, for use in delete row
    const selectRowProp = {
      mode: "checkbox"
    };

    // click to edit a cell
    const cellEditProp = {
      mode: "click"
    };

    // table options -> custom text for buttons and when there is no data (new invoice)
    const options = {
      insertText: "Add Line Item",
      deleteText: "Delete Line Item",
      noDataText: "No billable items"
      // onModalClose: this.handleModalClose
    };

    // format the rate field to be in USD, 2 decimal positions -> could use toLocale to provide support for other countries
    function rateFormatter(cell, row) {
      return currencyFormatter.format(cell, {code: 'USD'});
    }

    // format the amount field to be in USD, 2 decimal positions
    function amountFormatter2(cell, row) {
      return currencyFormatter.format((row.rate * row.qty), {code: 'USD'});
    }

    function idFormatter(cell, row) {
      console.log(row);
    }

    return (
      <div className="invoiceTable" style={{ width: "90%", margin: "auto" }}>
        <link
          rel="stylesheet"
          href="https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
        />
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
          <TableHeaderColumn
            dataField="id"
            isKey
            dataFormat={idFormatter}
            width="15"
          >
            #
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="item"
            width="200"
            editable={{ validator: this.itemNameValidator }}
          >
            Item
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="qty"
            width="30"
            editable={{ validator: this.quantityValidator }}
          >
            Quantity
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="rate"
            dataFormat={rateFormatter}
            width="40"
            editable={{ validator: this.rateValidator }}
          >
            Rate
          </TableHeaderColumn>

          <TableHeaderColumn
            dataField="amount"
            dataFormat={amountFormatter2}
            width="40"
            editable={{ readOnly: true }}
            disabled
          >
            Amount
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
