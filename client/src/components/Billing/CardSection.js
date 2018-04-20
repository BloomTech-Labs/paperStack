import React from "react";
import { CardElement } from "react-stripe-elements";
import { Card, Badge } from "reactstrap";

class CardSection extends React.Component {
  render() {
    return (
      <Card>
        <h4>
          Payment Info <Badge />
        </h4>
        <CardElement style={{ base: { fontSize: "11px" } }} />
      </Card>
    );
  }
}

export default CardSection;
