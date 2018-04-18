import React, { Component } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default class DueDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment().add(1, "days")
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.handleSavedDate();
  }

  handleSavedDate = () => {
    localStorage.getItem("invoiceId") ? this.setState({startDate: moment(this.props.dueDate)}) : moment().add(1, "days");
  };

  handleChange = (date) => {
    this.setState({
      startDate: date
    });
  }

  handleDueDateChange = e => {
    this.props.changeDueDate(e.target.value);
  };

  render() {
    return (
      <DatePicker
        className="form-control"
        style={{width:"100%"}}
        selected={this.state.startDate}
        onChange={this.handleChange}
        onBlur={this.handleDueDateChange}
        minDate={moment()}
        highlightDates={[
          moment().add(7, "days"),
          moment().add(14, "days"),
          moment().add(30, "days"),
          moment().add(60, "days")
        ]}
      />
    );
  }
}
