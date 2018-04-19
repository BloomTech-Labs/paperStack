import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

export default class CurrentDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.handleSavedDate();
  }

  handleSavedDate = () => {
    localStorage.getItem("invoiceId") ? this.setState({startDate: moment(this.props.invoiceDate)}) : moment();
  };

  handleChange = (date) => {
    this.setState({
      startDate: date
    })
  }

  handleInvoiceDateChange = e => {
    this.props.changeInvoiceDate(e.target.value);
  }

  render() {
    return (
      <DatePicker
        className="form-control"
        selected={this.state.startDate ? this.state.startDate : moment()}
        onChange={this.handleChange}
        onBlur={this.handleInvoiceDateChange}
        minDate={moment()}
      />
    );
  }
}
