import React, { Component } from "react";
import { string } from "prop-types";

// Embedly script: one-time init of the embedly platform.js
if (typeof window !== "undefined") {
  const initEmbedly = (w, d) => { /* eslint-disable no-param-reassign */
    const id = "embedly-platform";
    const n = "script";
    if (!d.getElementById(id)) { 
      const embedlyFunc = () =>  { 
        (w.embedly.q = w.embedly.q || []).push(arguments);
      };
      w.embedly = w.embedly || embedlyFunc;
      const e = d.createElement(n);
      e.id = id;
      e.async = 1;
      e.src =
        `${document.location.protocol === "https:" ?
         "https" : "http"}://cdn.embedly.com/widgets/platform.js`;
      const s = d.getElementsByTagName(n)[0];
      s.parentNode.insertBefore(e, s);
    }
  };
  initEmbedly(window, document);
}

/* eslint no-bitwise: [2, { allow: ["&", ">>"] }] */
const isDark = (color) => {
  const c = color.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (luma < 100) return true;
  return false;
}

export default class Embed extends Component {
  constructor(props) {
    super(props);
    this.state = { color: props.color };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.color !== this.state.color) {
      this.setState({ color: nextProps.color });
    }
    return null;
  }

  render() {
    return (
      <div>
        <a
          href={this.props.value}
          data-card-theme={isDark(this.state.color) ? "dark" : "light"}
          className="embedly-card"
          target="_blank"
        >
          {this.props.title ? this.props.title : this.props.value}
        </a>
      </div>
    );
  }
}

Embed.propTypes = {
  color: string.isRequired,
  value: string.isRequired,
  title: string.isRequired
};

Embed.defaultProps = {};