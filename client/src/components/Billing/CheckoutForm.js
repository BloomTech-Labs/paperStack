import React from "react";
import { injectStripe } from "react-stripe-elements";
import axios from "axios";
import CardSection from "./CardSection";
import { Container, Row, Button, Input, Form, Badge, Col } from "reactstrap";

// const serverURL = "https://lspaperstack.herokuapp.com/";
const serverURL = "http://localhost:3001/";

class CheckoutForm extends React.Component {
  state = {
    subscription: false,
    oneTimePaid: false,
    one: false,
    subErr: false,
    oneErr: false
  };

  handleSubChange = ev => {
    this.setState({ subscription: ev.target.value });
  };

  handleOneChange = ev => {
    this.setState({ one: ev.target.value });
  };

  handleSubmit = ev => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();
    const subscription = this.state.subscription;
    const one = this.state.one;
    if (!subscription && !one) {
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
          .post(
            `${serverURL}api/checkout`,
            {
              token: token.id,
              subscription,
              one
            },
            {
              params: { userId: localStorage.getItem("userId") },
              headers: {
                Authorization: localStorage.getItem("tkn")
              }
            }
          )
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
          <h1 align="center">
            Billing <Badge />
          </h1>
          <Container>
            <CardSection />
            {/* <AddressSection /> */}
            <Col>
              <Row>
                <Col sm={{ size: 6, order: 2, offset: 0 }}>
                  <Input
                    type="checkbox"
                    value={this.state.subscription}
                    onChange={this.handleSubChange}
                  />
                  <span>{this.state.subErr}</span>
                  1 Year Subscription - $9.99
                </Col>
              </Row>
              <Row>
                <Col sm={{ size: 6, order: 2, offset: 0 }}>
                  <Input
                    type="checkbox"
                    value={this.state.one}
                    onChange={this.handleOneChange}
                  />
                  <span>{this.state.oneErr}</span>
                  1 Invoice - $0.99
                </Col>
              </Row>
            </Col>
            <Button>Buy Now</Button>
          </Container>
        </Form>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
