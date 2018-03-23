import React, { Component } from 'react';
import CoverFlow from './CoverFlow';
import './LandingPage.css';

class LandingPage extends Component {
  render() {
    return (
      <div className="Landing">
        <header>
          <h1>Paper Stack</h1>
          <div className="Landing-nav-btns">
            <a href="#">Sign Up</a> 
            <span>/</span>
            <a href="#">Sign In</a>
          </div>
        </header>
        <main>
          <div className="Landing-slider">
            <CoverFlow />
          </div>
          <div className="Landing-info">
            <h2>What is an invoice template?</h2>
            <div className="Landing-paragraph">
              <p>Before defining what invoice template is, let’s clarify what’s invoice first. Simply put invoice is a document representing a request for payment of the given services or sold merchandise. When you’re doing business with another person, in order to charge them you’ll need to issue an invoice for the work you’ve done for them.</p>
            </div>
            <a className="Landing-buy-btn" href="#">Buy Now!</a>
          </div>
        </main>
        <footer><p>Crafted with &hearts;</p></footer>
      </div>
    );
  }
}

export default LandingPage;