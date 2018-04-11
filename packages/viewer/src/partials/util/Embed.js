import React, { Component } from "react";
import { string } from "prop-types";

// one-time init of the embedly platform.js
if (typeof window !== "undefined") {
  let init_embedly = function(w, d) {
    var id = "embedly-platform",
      n = "script";
    if (!d.getElementById(id)) {
      w.embedly =
        w.embedly ||
        function() {
          (w.embedly.q = w.embedly.q || []).push(arguments);
        };
      var e = d.createElement(n);
      e.id = id;
      e.async = 1;
      e.src =
        ("https:" === document.location.protocol ? "https" : "http") +
        "://cdn.embedly.com/widgets/platform.js";
      var s = d.getElementsByTagName(n)[0];
      s.parentNode.insertBefore(e, s);
    }
  };
  init_embedly(window, document);
}

class Embed extends Component {
  constructor(props) {
    super(props);
    this.state = { color: props.color };
    this.isDark = this.isDark.bind(this);
  }

  isDark(color) {
    const c = color.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    console.log("=============>", luma);
    if (luma < 100) return true;
    return false;
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
        <h1>{this.state.color}</h1>
        <a
          href={this.props.value}
          data-card-theme={this.isDark(this.state.color) ? "dark" : "light"}
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

export default Embed;
