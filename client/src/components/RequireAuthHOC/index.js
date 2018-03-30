import React, { Component } from 'react';
import axios from 'axios';

import './RequireAuth.css';

export default ComposedComponent => {
  class RequireAuthentication extends Component {
    state = {
      authenticated: false,
      verifyingToken: false
    }

    componentWillMount() {
      if (!localStorage.getItem('tkn')) {
        return this.setState({ authenticated: false }, () => {
          setTimeout(() => {
              this.props.history.push('/authorisation');
            }, 5000);
        });
      }

      this.setState({ verifyingToken: true }, () => {
        axios
          .get(`http://localhost:3001/jwt`, {
            headers: {
              Authorization: localStorage.getItem('tkn')
            }
          })
          .then(res => {
            if (res.data.authenticated) {
              this.setState({ authenticated: true, verifyingToken: false });
            }
          })
          .catch((err) => {
            this.setState({ authenticated: false, verifyingToken: false }, () => {
              setTimeout(() => {
                this.props.history.push('/authorisation');
              }, 5000);
            });
          });
      });      
    }

    render() {
      if (!this.state.authenticated && !this.state.verifyingToken) {
        return (
          <div className="Require-Auth">
            <p>You are not authorized to access this web page. <br />Please verify
            you are authorized and re-enter your User ID and Password.</p>
          </div>
        );
      } else if (this.state.verifyingToken) {
        return ( 
          <div className="Require-Auth-outer">
            <div className="Require-Auth-middle">
              <div className="Require-Auth-inner">
                <div className="Require-Auth-loader"></div>
              </div>
            </div>
          </div>
        );
      }
      return <ComposedComponent history={this.props.history} />;
    }
  }

  return RequireAuthentication;
};