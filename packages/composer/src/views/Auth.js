import { object, func } from "prop-types";

import css from "styled-components";
import React, { Component } from "react";
import Raven from "raven-js";
import md5 from "md5";

import { AuthModal } from "../partials";

const Page = css.div`
  align-content: stretch;
  align-items: stretch;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
`;

export default class AuthView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  handleAuthentication(info) {
    const user = {
      id: info.id,
      name: info.username,
      username: info.username,
      email: info.attributes.email,
      avatar: `https://www.gravatar.com/avatar/${md5(info.attributes.email)}?d=retro`
    };

    this.props.signInUser(user);

    Raven.setUserContext({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    this.props.router.push(`/stories`);
  }

  render() {
    return [
      <Page key="Page" />,
      <AuthModal
        {...this.props}
        handleAuthentication={this.handleAuthentication}
        isOpen
        key="AuthModal"
        style={{
          maxWidth: "350px",
          minHeight: "350px"
        }}
      />
    ];
  }
}

AuthView.propTypes = {
  router: object.isRequired, /* eslint react/forbid-prop-types: 0 */
  signInUser: func.isRequired
};

AuthView.defaultProps = {
};
