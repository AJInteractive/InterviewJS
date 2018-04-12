import React, { Component } from "react";
import { string } from "prop-types";
import css from "styled-components";
import axios from "axios";
import { Text } from "interviewjs-styleguide";

const Thumbnail = css.img`
  padding: 5%;
  width: 100%;
`;

const PreviewTitle = css.a`
  font-weight: 400;
  font-size: 20px;
`;

const Description = css(Text)`
  font-family: "PT sans";
  font-weight: 100;
`;

export default class Embed extends Component {
  constructor(props) {
    super(props);
    this.state = { meta: {} };
  }

  componentDidMount() {
    axios
      .get("https://api.embedly.com/1/oembed", {
        params: {
          url: this.props.value,
          key: "be5e8807bede4504bb37a33c736fdcf8",
        },
      })
      .then(res => {
        this.setState({ meta: res.data });
      });
  }

  render() {
    return (
      <div>
        <Thumbnail src={this.state.meta.thumbnail_url} alt="" />
        <PreviewTitle href={this.props.value} target="_blank">
          {this.props.title ? this.props.title : this.state.meta.title}
        </PreviewTitle>
        <br />
        <Description>{this.state.meta.description}</Description>
      </div>
    );
  }
}

Embed.propTypes = {
  value: string.isRequired,
  title: string.isRequired,
};

Embed.defaultProps = {};
