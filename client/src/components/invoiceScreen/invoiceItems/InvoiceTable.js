import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import formatMoney from "accounting-js/lib/formatMoney.js";

import billableItems from "../billableItems.json";

// select a row, for use in delete row
const selectRowProp = {
  mode: "checkbox"
};

// click to edit a cell
const cellEditProp = {
  mode: "click"
};

// table options -> custom text for buttons and when there is no data (ie. new invoice)
const options = {
  insertText: "Add Line Item",
  deleteText: "Delete Line Item",
  noDataText: "No billable items"
};

export default class InvoiceItemsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: billableItems
      // ^^ data must be presented as an array per docs
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  // componentWillMount() {
  //   // footerData calculates the subtotal
  //   this.footerData = [
  //     [
  //       {
  //         label: "Subtotal",
  //         columnIndex: 4,
  //         formatter: tableData => {
  //           let total = 0;
  //           for (let i = 0; i < tableData.length; i++) {
  //             total += tableData[i].qty * tableData[i].rate;
  //           }
  //           localStorage.setItem("tableSubtotal", total);
  //           return (
  //             <div>
  //               <i
  //                 id="subtotal"
  //                 onChange={this.handleSubtotalChange.bind(this, total)}
  //               >
  //                 {total}
  //               </i>
  //             </div>
  //           );
  //         }
  //       }
  //     ]
  //   ];
  // }

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

  // handles the update to subtotal
  handleSubtotalChange(total) {
    const subtotal = localStorage.getItem("tableSubtotal");
    this.props.changeSubtotal(subtotal);
  }

  // format the rate field to be in USD, 2 decimal positions
  rateFormatter(cell, row) {
    return formatMoney(cell);
  }

  // format the amount field to be in USD, 2 decimal positions
  amountFormatter2(cell, row) {
    return formatMoney(row.rate * row.qty);
  }

  // format the index to be a line number -> used to override the autoNumber creation, which is alphaNumeric and very long
  idFormatter(cell, row, enumObject, index) {
    return index + 1;
  }

  render() {
    const footerData = [
      [
        {
          label: "Subtotal",
          columnIndex: 4,
          formatter: tableData => {
            let total = 0;
            for (let i = 0; i < tableData.length; i++) {
              total += tableData[i].qty * tableData[i].rate;
            }
            localStorage.setItem("tableSubtotal", total);
            return (
              <div>
                <i
                  id="subtotal"
                  onChange={this.handleSubtotalChange(total)}
                >
                  {total}
                </i>
              </div>
            );
          }
        }
      ]
    ];
    return (
      <div className="invoiceTable" style={{ width: "90%", margin: "auto" }}>
        {/*had to link the style sheet, wasn't loading correctly*/}
        <link
          rel="stylesheet"
          href="https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table-all.min.css"
        />
        <BootstrapTable
          id="table"
          data={billableItems}
          striped
          hover
          condensed
          footerData={footerData}
          footer // <- disbled the display of the footer, not needed at bottom of table
          options={options}
          version="4"
          deleteRow={true}
          insertRow={true}
          selectRow={selectRowProp}
          cellEdit={cellEditProp}
          onChange={this.handleSubtotalChange.bind(this)}
        >
          {/*This is column 0 - line item number, the checkmark column doesn't count and can't be modified here*/}
          <TableHeaderColumn
            dataField="id"
            autoValue={true}
            isKey
            dataFormat={this.idFormatter}
            width="15"
            hiddenOnInsert
          >
            #
          </TableHeaderColumn>

          {/*Column 1 - Item/Description field*/}
          <TableHeaderColumn
            dataField="item"
            width="200"
            editable={{ validator: this.itemNameValidator }}
          >
            Item/Description
          </TableHeaderColumn>

          {/*Column 2 - Qty field*/}
          <TableHeaderColumn
            dataField="qty"
            width="30"
            editable={{ validator: this.quantityValidator }}
          >
            Quantity
          </TableHeaderColumn>

          {/*Column 3 - Rate Field*/}
          <TableHeaderColumn
            dataField="rate"
            dataFormat={this.rateFormatter}
            width="40"
            editable={{ validator: this.rateValidator }}
          >
            Rate
          </TableHeaderColumn>

          {/*Column 4 - Amount field, calculates from rate and qty fields*/}
          <TableHeaderColumn
            dataField="amount"
            dataFormat={this.amountFormatter2}
            width="40"
            editable={{ readOnly: true }}
            disabled
            hiddenOnInsert
          >
            Amount
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
