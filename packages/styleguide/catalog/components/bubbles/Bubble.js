import React, { Component } from "react";
import { number, string } from "prop-types";

import { Preloader } from "../";
import SpeakerBubble from "./SpeakerBubble";
import SystemBubble from "./SystemBubble";
import UserBubble from "./UserBubble";

export default class Bubble extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, rendering: true };
  }
  componentDidMount() {
    this.preloaderTimer = setTimeout(() => {
      this.setState({ loading: false });
    }, this.props.delay + 1000);
    this.renderTimeout = setTimeout(() => {
      this.setState({ rendering: false });
    }, this.props.delay);
  }
  componentWillUnmount() {
    clearTimeout(this.renderTimeout);
    clearTimeout(this.preloaderTimer);
  }
  render() {
    const { loading, rendering } = this.state;
    const { persona, children } = this.props;
    setTimeout(() => {}, 1000);
    if (persona === "user") {
      if (!rendering) {
        return (
          <UserBubble {...this.props}>
            {loading ? <Preloader /> : children}
          </UserBubble>
        );
      }
      return null;
    } else if (persona === "interviewee") {
      if (!rendering) {
        return (
          <SpeakerBubble {...this.props}>
            {loading ? <Preloader /> : children}
          </SpeakerBubble>
        );
      }
      return null;
    }
    if (!rendering) {
      return (
        <SystemBubble {...this.props}>
          {loading ? <Preloader /> : children}
        </SystemBubble>
      );
    }
    return null;
  }
}

Bubble.propTypes = {
  persona: string,
  delay: number
};

Bubble.defaultProps = {
  persona: null,
  delay: 0
};
