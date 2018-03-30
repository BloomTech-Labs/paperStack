import React from "react";
import { render } from "react-dom";
import ReactTable from "react-table";
import _ from "lodash";

import "react-table/react-table.css";

import billableItems from "../billableItems.json";

export default class InvoiceItemsTable2 extends React.Component {
  constructor() {
    super();
    this.state = {
      data: billableItems
    };
  }

  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  render() {
    const { data } = this.state;
    return (
      <div className="invoiceTable" style={{ width: "90%", margin: "auto" }}>
        <ReactTable
          data={data}
          noDataText="Please add a line item"
          columns={[
            {
              Header: "Line Item",
              accessor: "lineItem"

            },
            {
              Header: "Description",
              accessor: "item",
              Cell: this.renderEditable
            },
            {
              Header: "Qty",
              accessor: "qty",
              Cell: props => <span className='number'>{props.value}</span>
            },
            {
              Header: "Rate",
              accessor: "rate",
              Cell: props => <span className='number'>{props.value}</span>
            },
            {
              Header: "Amount",
              accessor: "amount",
              Cell: props => <span className='number'>{props.value}</span>, 
              Footer: (
                <span>
                  <strong>Average:</strong>{" "}
                  {_.sum(_.map(data, d => d.age))}
                </span>
              )
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
        <br />
      </div>
    );
  }
}
