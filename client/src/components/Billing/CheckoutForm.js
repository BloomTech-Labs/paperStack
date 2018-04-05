import React from "react";
import { injectStripe } from "react-stripe-elements";
import axios from "axios";
import CardSection from "./CardSection";
import { Container, Row, Button, Input, Form, Badge } from "reactstrap";

class CheckoutForm extends React.Component {
  state = {
    sub: false,
    one: false,
    subErr: false,
    oneErr: false
  };

  handleSubChange = ev => {
    this.setState({ sub: ev.target.value });
  };

  handleOneChange = ev => {
    this.setState({ one: ev.target.value });
  };

  handleSubmit = ev => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();
    const sub = this.state.sub;
    const one = this.state.one;
    if (!sub && !one) {
      return this.setState({ subErr: "Please choose one payment plan" });
    } else {
      this.setState({ subErr: "" });
    }

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe
      .createToken({ name: "Woody Carpenter" }) //User to purchase paperStack
      .then(({ token }) => {
        console.log("Received Stripe token:", token);
        axios
          .post("http://localhost:3001/api/checkout", {
            token: token.id,
            sub,
            one
          })
          .then(res => {
            console.log("Charge success: ", res.data);
            window.location = "/invoices";
          })
          .catch(err => {
            console.log("there was an error", err);
            window.location = "/";
          });
      })
      .catch(e => {
        console.log("there was an error", e);
      });

    // However, this line of code will do the same thing:
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <h1 align="left">
            Billing <Badge />
          </h1>
          <Container>
            <CardSection />
            {/* <AddressSection /> */}
            <Row>
              <Input
                type="checkbox"
                value={this.state.sub}
                onChange={this.handleSubChange}
              />
              <span>{this.state.subErr}</span>
              1 Year Subscription - $9.99
            </Row>
            <Row>
              <Input
                type="checkbox"
                value={this.state.one}
                onChange={this.handleOneChange}
              />
              <span>{this.state.oneErr}</span>
              1 Invoice - $0.99
            </Row>
            <Button>Buy Now</Button>
          </Container>
        </Form>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
