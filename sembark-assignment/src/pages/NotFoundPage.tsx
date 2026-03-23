import React, { Component } from "react";
import StatusView from "../components/StatusView";

class NotFoundPage extends Component {
  render() {
    return (
      <StatusView
        eyebrow="404"
        linkLabel="Browse products"
        linkTo="/"
        message="The page you requested does not exist in this storefront."
        title="We could not find that route"
        tone="error"
      />
    );
  }
}

export default NotFoundPage;
