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

// variable for use in onAfterRowInsert
let newObj = {};

export default class InvoiceItemsTable2 extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   data: this.props.billableItems
    //   // ^^ data must be presented as an array per docs
    // };
  }

  // componentDidMount() {
  //   this.setState({data: this.props.billableItems}, () => {
  //     console.log('from componentDidMount: ', this.state.data)
  //   })
  // } // component doesn't receive it's props until AFTER it and the rest of the children are rendered

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.billableItems !== this.props.billableItems) {
  //     this.setState({data: nextProps.billableItems}, () => {
  //       console.log('from componentWillReceiveProps: ', this.state.data)
  //     })
  //   }
  // }

  // see https://engineering.musefind.com/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c for more information on why this is being used to prevent un-necessary re-renders (causes loss of line items which weren't saved)
  // lies ^^ is a good article, but this is where I got it from https://engineering.musefind.com/react-lifecycle-methods-how-and-when-to-use-them-2111a1b692b1
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.billableItems != this.props.billableItems) {
      return true;
    } else {
    return false;
    }
    // return nextState.billableItems != this.state.data;
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
      response.notification.msg =
        "Please use numbers only. If using a decimal value, please use a leading 0";
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
  }

  handleAddBillableItems = () => {
    this.props.addBillableItems(sessionStorage.getItem("lineItem"));
  };

  handleDeleteBillableItems = () => {
    this.props.deleteBillableItems(sessionStorage.getItem("deleteMe"));
  };

  handleUpdateBillableItems = () => {
    this.props.updateBillableItems(sessionStorage.getItem('modifyMe'));
  }

  changeGroup() {
    this.handleAddBillableItems();
    this.handleDeleteBillableItems();
    this.handleUpdateBillableItems();
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
    afterInsertRow: this.onAfterInsertRow,
    afterDeleteRow: this.onAfterDeleteRow
  };
  // click to edit a cell
  cellEditProp = {
    mode: "click",
    afterSaveCell: this.onAfterSaveCell
    // blurToSave: true
  };
  // format the rate field to be in USD, 2 decimal positions
  rateFormatter(cell, row) {
    return currency(cell).format();
  }

  // format the amount field to be in USD, 2 decimal positions
  amountFormatter2(cell, row) {
    return currency(row.rate)
      .multiply(row.qty)
      .format();
  }

  // format the index to be a line number -> used to override the autoNumber creation, which is alphaNumeric and very long
  idFormatter(cell, row, enumObject, index) {
    return index + 1;
  }

  // works with the modal to push items to billableItems in the parent for saving
  onAfterInsertRow(row) {
    const tempArray = [];
    for (const prop in row) {
      const tempObj = {};
      tempObj[prop] = row[prop];
      tempArray.push(tempObj);
    }
    newObj = JSON.stringify(Object.assign({}, ...tempArray));
    sessionStorage.setItem("lineItem", newObj);
  }

  onAfterSaveCell(row, cellName, cellValue) {
    const tempArray2 = [];
    for (const prop in row) {
      const tempObj = {};
      tempObj[prop] = row[prop];
      tempArray2.push(tempObj);
    }
    newObj = JSON.stringify(Object.assign({}, ...tempArray2));
    sessionStorage.setItem("modifyMe", newObj);
  }

  onAfterDeleteRow(rowKeys, rows) {
    sessionStorage.setItem("deleteMe", rowKeys);
  }

  // footerData handles the subtotal for the table
  render() {
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
            sessionStorage.setItem("tableSubtotal", currency(total).format());
            return (
              <div>
                <b id="subtotal" onChange={this.changeGroup()}>
                  {currency(total, { formatWithSymbol: true }).format()}
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
          data={this.props.billableItems}
          striped
          hover
          condensed
          // remote={true}
          footerData={footerData}
          footer // <- cannot be disbled or the updated subtotal will not be pushed to sessionStorage
          options={this.options}
          version="4"
          deleteRow={true}
          insertRow={true}
          selectRow={selectRowProp}
          cellEdit={this.cellEditProp}
          onChange={this.changeGroup}
        >
          {/*This is column 0 - line item number, the checkmark column doesn't count and can't be modified here*/}
          <TableHeaderColumn
            dataField="id"
            autoValue={true}
            isKey
            dataFormat={this.idFormatter}
            width="5%"
            hiddenOnInsert
          >
            #
          </TableHeaderColumn>

          {/*Column 1 - Item/Description field*/}
          <TableHeaderColumn
            dataField="item"
            width="55%"
            editable={{ validator: this.itemNameValidator }}
          >
            Item/Description
          </TableHeaderColumn>

          {/*Column 2 - Qty field*/}
          <TableHeaderColumn
            dataField="qty"
            width="10%"
            editable={{ validator: this.quantityValidator }}
          >
            Quantity
          </TableHeaderColumn>

          {/*Column 3 - Rate Field*/}
          <TableHeaderColumn
            dataField="rate"
            dataFormat={this.rateFormatter}
            width="10%"
            editable={{ validator: this.rateValidator }}
          >
            Rate
          </TableHeaderColumn>

          {/*Column 4 - Amount field, calculates from rate and qty fields*/}
          <TableHeaderColumn
            dataField="amount"
            dataFormat={this.amountFormatter2}
            width="20%"
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
