import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import emailValidation from './emailRegExp';
import axios from 'axios';

import './Authorisation.css';

class LoginForm extends Component {
  state = { 
    email: '',
    password: '',
    emailErr: '',
    passwordErr: ''
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const email = this.state.email;
    const password = this.state.password;
    if (!email) { return this.setState({ emailErr: '*this field is required' }); }
    else { this.setState({ emailErr: '' }); }
    if (!password) { return this.setState({ passwordErr: '*this field is required' }); }
    else { this.setState({ passwordErr: '' }); }

    if (!emailValidation.test(email)) { return this.setState({ emailErr: '*invalid email format' }); }
    else { this.setState({ emailErr: '' }); }

    axios
      .post(`http://localhost:3001/login`, { email, password })
      .then((res) => {
        localStorage.setItem('tkn', res.data.token);
        this.props.history.push('/preview');
      })
      .catch((err) => {
        const message = err.response.data.error;
        if (err.response.status === 500) {
          this.setState({ passwordErr: message });
        } else {
          this.setState({ passwordErr: 'Failed to login user' });
        }
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2 className="Auth-Form-header">Welcome Back!</h2>
        <label>Email:</label>
        <input className="Auth-Form-field" type="text" spellCheck="false"
          value={this.state.email} onChange={this.handleEmailChange} />
        <span>{this.state.emailErr}</span>
        <label>Password:</label>
        <input className="Auth-Form-field" type="password" 
          value={this.state.password} onChange={this.handlePasswordChange} />
        <span>{this.state.passwordErr}</span>
        <button type="submit" className="Auth-Form-submit-btn">LOGIN</button>
      </form>
    );
  }
}

export default withRouter(LoginForm);
