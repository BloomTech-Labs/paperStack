import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import emailValidation from "./emailRegExp";
import axios from "axios";

import "./Authorisation.css";

class SignUpForm extends Component {
  state = {
    email: "",
    emailErr: "",
    password: "",
    passwordErr: "",
    confirmPassword: "",
    confirmPasswordErr: ""
  };

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleConfirmPasswordChange = event => {
    this.setState({ confirmPassword: event.target.value }, () => {
      const password = this.state.password;
      const confirmPassword = this.state.confirmPassword;
      if (password.length === confirmPassword.length) {
        if (password !== confirmPassword) {
          this.setState({ confirmPasswordErr: "*passwords do not match" });
        } else {
          this.setState({ confirmPasswordErr: "" });
        }
      }
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;
    if (!email) {
      return this.setState({ emailErr: "*this field is required" });
    } else {
      this.setState({ emailErr: "" });
    }
    if (!password) {
      return this.setState({ passwordErr: "*this field is required" });
    } else {
      this.setState({ passwordErr: "" });
    }
    if (!confirmPassword) {
      return this.setState({ confirmPasswordErr: "*this field is required" });
    } else {
      this.setState({ confirmPasswordErr: "" });
    }
    // The only way to truly validate the email address is
    // to send an email to that address and request the user
    // to confirm by clicking on a unique link (or entering a confirmation code)
    // I am using this RFC 2822 standard to point out typos
    if (!emailValidation.test(email)) {
      return this.setState({ emailErr: "*invalid email format" });
    } else {
      this.setState({ emailErr: "" });
    }

    if (password.length < 8)
      return this.setState({ passwordErr: "*must be at least 8 characters" });
    else this.setState({ passwordErr: "" });

    if (!/[a-z]/i.test(password)) {
      return this.setState({ passwordErr: "*must have one or more letters" });
    } else {
      this.setState({ passwordErr: "" });
    }
    if (!/\d/.test(password)) {
      return this.setState({ passwordErr: "*must have one or more digits" });
    } else {
      this.setState({ passwordErr: "" });
    }

    if (password !== confirmPassword)
      return this.setState({ confirmPasswordErr: "*passwords do not match" });
    else this.setState({ confirmPasswordErr: "" });

    axios
      .post(`https://www.paperstack.pro/new-user`, { email, password })
      .then(res => {
        localStorage.setItem("tkn", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        this.props.history.push("/list");
      })
      .catch(err => {
        const message = err.response.data.error;
        if (err.response.status === 409) {
          this.setState({ emailErr: message });
        } else {
          this.setState({ confirmPasswordErr: "Failed to register user" });
        }
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="Auth-Form-header">Sign Up for Free</h2>
        <label>Email:</label>
        <input
          type="text"
          className="Auth-Form-field"
          spellCheck="false"
          value={this.state.username}
          onChange={this.handleEmailChange}
        />
        <span>{this.state.emailErr}</span>
        <label>Password:</label>
        <input
          type="password"
          className="Auth-Form-field"
          value={this.state.password}
          onChange={this.handlePasswordChange}
        />
        <span>{this.state.passwordErr}</span>
        <label>Confirm Password:</label>
        <input
          type="password"
          className="Auth-Form-field"
          value={this.state.confirmPassword}
          onChange={this.handleConfirmPasswordChange}
        />
        <span>{this.state.confirmPasswordErr}</span>
        <button type="submit" className="Auth-Form-submit-btn">
          GET STARTED
        </button>
      </form>
    );
  }
}

export default withRouter(SignUpForm);
