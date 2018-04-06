import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import currency from "currency.js";

/**
 * modifiers for the table
 */
// select a row, for use in delete row
const selectRowProp = {
  mode: "checkbox"
};

// click to edit a cell
const cellEditProp = {
  mode: "click"
};

let newObj = {};
// // table options -> custom text for buttons and when there is no data (ie. new invoice)
// const options = {
//   insertText: "Add Line Item",
//   deleteText: "Delete Line Item",
//   noDataText: "No billable items",
//   afterInsertRow: onAfterInsertRow
//   // onModalClose: () => this.handleModalClose(closeModal)
// };

export default class InvoiceItemsTable extends Component {
  constructor(props) {
    super(props);

    this.onAfterInsertRow = this.onAfterInsertRow.bind(this);

    this.state = {
      data: this.props.billableItems
      // data: [{},]
      // ^^ data must be presented as an array per docs
    };
  }

  // see https://engineering.musefind.com/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c for more information on why this is being used to prevent un-necessary re-renders (causes loss of line items which weren't saved)
  // lies ^^ is a good article, but this is where I got it from https://engineering.musefind.com/react-lifecycle-methods-how-and-when-to-use-them-2111a1b692b1
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  /* 
   * These functions edit the modal for adding new rows of data -> validators for the fields in the modal
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

  /* 
   * This pushes the table total to sessionStorage for use in the header/footer
   */
  // handles the update to subtotal
  handleSubtotalChange(total) {
    const subtotal = sessionStorage.getItem("tableSubtotal");
    this.props.changeSubtotal(subtotal);
    // console.log('newObj: ', newObj)
  }

  handleBillableItemsChange = () => {
    this.props.changeBillableItems(sessionStorage.getItem('lineItem'))
  }

  changeGroup() {
    this.handleBillableItemsChange();
    this.handleSubtotalChange();
  }

  /*
   * these edit the table itself, formatting fields
   */
  // table options -> custom text for buttons and when there is no data (ie. new invoice)
  options = {
    insertText: "Add Line Item",
    deleteText: "Delete Line Item",
    noDataText: "No billable items",
    afterInsertRow: this.onAfterInsertRow
  };
  // format the rate field to be in USD, 2 decimal positions
  rateFormatter(cell, row) {
    return currency(cell);
  }

  // format the amount field to be in USD, 2 decimal positions
  amountFormatter2(cell, row) {
    return currency(row.rate).multiply(row.qty);
  }

  // format the index to be a line number -> used to override the autoNumber creation, which is alphaNumeric and very long
  idFormatter(cell, row, enumObject, index) {
    return index + 1;
  }

  onAfterInsertRow(row) {
    const tempArray = [];
    for (const prop in row) {
      const tempObj = {}
      tempObj[prop]=row[prop]
      tempArray.push(tempObj);
    }
    newObj = JSON.stringify(Object.assign({}, ...tempArray));
    // this.setState({data: [...this.data, newObj ]});
    sessionStorage.setItem("lineItem", newObj);
    // this.setState(prevState => ({
    //   data: [...prevState, newObj]
    // }))
    // this.handleBillableItemsChange;
  }

  render() {
    {
      /*
  This creates the data for the table to render in the footer only
  */
    }
    const footerData = [
      [
        {
          label: "Subtotal",
          columnIndex: 1
        },
        {
          label: "Subtotal",
          columnIndex: 4,
          formatter: tableData => {
            let total = 0;
            for (let i = 0; i < tableData.length; i++) {
              total += tableData[i].qty * tableData[i].rate;
            }
            sessionStorage.setItem("tableSubtotal", Number(total));
            return (
              <div>
                <b
                  id="subtotal"
                  onChange={this.changeGroup()}
                >
                  {total}
                </b>
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
          data={this.data}
          striped
          hover
          condensed
          footerData={footerData}
          footer // <- cannot be disbled or updated subtotal will not be pushed to sessionStorage
          options={this.options}
          version="4"
          deleteRow={true}
          insertRow={true}
          selectRow={selectRowProp}
          cellEdit={cellEditProp}
          onChange={this.changeGroup}
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
