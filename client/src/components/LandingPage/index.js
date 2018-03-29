import React, { Component } from 'react';
import CoverFlow from './CoverFlow';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
>>>>>>> 7ed120e862bafcd4593f71684a6491e56b596720
import './LandingPage.css';

class LandingPage extends Component {
  render() {
    return (
      <div className="Landing">
        <header>
          <h1>Paper Stack</h1>
          <div className="Landing-nav-btns">
<<<<<<< HEAD
            <Link to="/authorisation?form=signup">
              Sign Up
            </Link>
            <span>/</span>
            <Link to="/authorisation">
              Sign In
            </Link>
=======
            <a href="#">Sign Up</a> 
            <span>/</span>
            <a href="#">Sign In</a>
>>>>>>> 7ed120e862bafcd4593f71684a6491e56b596720
          </div>
        </header>
        <main>
          <div className="Landing-slider">
            <CoverFlow />
          </div>
          <div className="Landing-info">
<<<<<<< HEAD
            <h2>A platform for quick and easy invocing</h2>
            <div className="Landing-paragraph">
              <p>Are overdue invoices piling up on your desk? Invoicing system too complicated? PaperStack is here to help. Let PaperStack reduce your desk clutter, organize and simplify your billing process, and cut down on the time between job completion and invoicing customers. With our simple interface and invoice templates, you can send customized PDF invoices directly to your customers. You can even access your invoices from your mobile device while you’re on the job, and send your invoices as soon as the job is complete. Don’t let lagging invoices impact your cash flow. Use PaperStack to simplify billing, and get back on track.</p>
            </div>
            <div className="Landing-buy-btn">
              <Link to="/authorisation?form=signup">Buy Now!</Link>
            </div>
=======
            <h2>What is an invoice template?</h2>
            <div className="Landing-paragraph">
              <p>Before defining what invoice template is, let’s clarify what’s invoice first. Simply put invoice is a document representing a request for payment of the given services or sold merchandise. When you’re doing business with another person, in order to charge them you’ll need to issue an invoice for the work you’ve done for them.</p>
            </div>
            <a className="Landing-buy-btn" href="#">Buy Now!</a>
>>>>>>> 7ed120e862bafcd4593f71684a6491e56b596720
          </div>
        </main>
        <footer><p>Crafted with &hearts;</p></footer>
      </div>
    );
  }
}

export default LandingPage;