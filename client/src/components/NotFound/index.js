import React, { Component } from 'react';
import './NotFound.css';

class NotFound extends Component {
  render() {
    return (
      <div className="Not-Found-outer">
        <div className="Not-Found-middle">
          <div className="Not-Found-inner">
            <div className="Not-Found">
              <h1>404</h1>
              <h2>Page Not Found</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;