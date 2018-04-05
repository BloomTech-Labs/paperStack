import React, { Component } from "react";
import { StripeProvider } from "react-stripe-elements";
import Checkout from "./Checkout";
import Navigation from "../Navigation";

class Billing extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <StripeProvider apiKey="pk_test_KeAhEEIedzMx2yGsMmFoOgqZ">
          <Checkout />
        </StripeProvider>
      </div>
    );
  }
}

export default Billing;
