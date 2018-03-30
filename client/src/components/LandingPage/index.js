import React, { Component } from 'react';
import CoverFlow from './CoverFlow';

import { Link } from 'react-router-dom';
import './LandingPage.css';

class LandingPage extends Component {
  render() {
    return (
      <div className="Landing">
        <header>
          <h1>Paper Stack</h1>
          <div className="Landing-nav-btns">
            <Link to="/authorisation?form=signup">
              Sign Up
            </Link>
            <span>/</span>
            <Link to="/authorisation">
              Sign In
            </Link>
          </div>
        </header>
        <main>
          <div className="Landing-slider">
            <CoverFlow />
          </div>
          <div className="Landing-info">
            <h2>A platform for quick and easy invocing</h2>
            <div className="Landing-paragraph">
              <p>Are overdue invoices piling up on your desk? Invoicing system too complicated? PaperStack is here to help. Let PaperStack reduce your desk clutter, organize and simplify your billing process, and cut down on the time between job completion and invoicing customers. With our simple interface and invoice templates, you can send customized PDF invoices directly to your customers. You can even access your invoices from your mobile device while you’re on the job, and send your invoices as soon as the job is complete. Don’t let lagging invoices impact your cash flow. Use PaperStack to simplify billing, and get back on track.</p>
            </div>
            <div className="Landing-buy-btn">
              <Link to="/authorisation?form=signup">Buy Now!</Link>
            </div>
          </div>
        </main>
        <footer><p>Crafted with &hearts;</p></footer>
      </div>
    );
  }
}

export default LandingPage;