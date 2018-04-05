import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default class CurrentDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      invoiceDate: this.props.invoiceDate
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date,
      invoiceDate: this.state.startDate
    }, () => {this.props.handleInvoiceDateChange()});
  }

  render() {
    return (
      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
        minDate={moment()}
      />
    );
  }
}
