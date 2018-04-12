import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from 'reactstrap';

import './Navigation.css';

class Navigation extends Component {
  state = {
    isOpen: false
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleSignOut = () => {
    localStorage.removeItem('tkn');
    localStorage.removeItem('userId');
    this.props.history.push("/");
  }

  render() {
    return (
        <Navbar color="faded" light expand="md">
          <NavbarBrand onClick={() => this.props.history.push("/")}>Paper Stack</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem active={window.location.pathname === '/new'}>
                <NavLink onClick={() => this.props.history.push("/new")}>New</NavLink>
              </NavItem>
              <NavItem active={window.location.pathname === '/invoices'}>
                <NavLink onClick={() => this.props.history.push("/invoices")}>Invoices</NavLink>
              </NavItem>
              <NavItem active={window.location.pathname === '/billing'}>
                <NavLink onClick={() => this.props.history.push("/billing")}>Billing</NavLink>
              </NavItem>
              <NavItem active={window.location.pathname === '/settings'}>
                <NavLink onClick={() => this.props.history.push("/settings")}>Settings</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={this.handleSignOut}>Sign Out</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
    );
  }
}

export default withRouter(Navigation);
