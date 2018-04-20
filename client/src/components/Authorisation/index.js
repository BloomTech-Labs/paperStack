import React, { Component } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import "./Authorisation.css";

class Authorisation extends Component {
  state = { signUp: window.location.search === "?form=signup" };

  showSignUp = () => {
    this.setState({ signUp: true });
  };

  showLogin = () => {
    this.setState({ signUp: false });
  };

  render() {
    return (
      <div className="Auth-Form-outer">
        <div className="Auth-Form-middle">
          <div className="Auth-Form-inner">
            <div className="Auth-Form">
              <ul className="Auth-Form-tab-group">
                <li className="Auth-Form-tab">
                  <div
                    className={
                      this.state.signUp
                        ? "Auth-Form-active"
                        : "Auth-Form-inactive"
                    }
                    onClick={this.showSignUp}
                  >
                    Sign Up
                  </div>
                </li>
                <li className="Auth-Form-tab">
                  <div
                    className={
                      !this.state.signUp
                        ? "Auth-Form-active"
                        : "Auth-Form-inactive"
                    }
                    onClick={this.showLogin}
                  >
                    Login
                  </div>
                </li>
              </ul>
              {this.state.signUp ? <SignUpForm /> : <LoginForm />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Authorisation;
