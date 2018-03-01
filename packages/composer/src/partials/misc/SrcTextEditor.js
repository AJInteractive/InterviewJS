import { func, string } from "prop-types";
import { throttle } from "lodash";
import css from "styled-components";
import React from "react";

import { color, font, setType } from "interviewjs-styleguide";

const SrcTextArea = css.textarea`
  ${setType("x")};
  background: transparent;
  border: none;
  bottom: 0;
  color: ${color.blueBlk};
  font-family: ${font.serif};
  height: 100%;
  left: 0;
  position: absolute;
  resize: none;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 2;
`;

const SrcTextPlaceholder = css.p`
  bottom: 0;
  color: ${color.greyBlk};
  display: flex;
  flex-direction: column;
  font-style: italic;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  text-align: center;
  top: 0;
  vertical-align: middle;
  z-index: 1;
`;

export default class SrcTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { srcText: this.props.srcText };

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }
  onChange(e) {
    this.setState({ srcText: e.target.value });
    throttle(this.saveChanges, 500);
  }
  onBlur() {
    this.saveChanges();
  }
  saveChanges() {
    const { srcText } = this.state;
    this.props.updateInterviewee(srcText);
  }
  render() {
    return [
      <SrcTextArea
        onBlur={this.onBlur}
        onChange={this.onChange}
        value={this.state.srcText}
      />,
      this.state.srcText.length === 0 ? (
        <SrcTextPlaceholder>
          Paste or type in your interview text here…
        </SrcTextPlaceholder>
      ) : null
    ];
  }
}

SrcTextEditor.propTypes = {
  updateInterviewee: func.isRequired,
  srcText: string
};

SrcTextEditor.defaultProps = {
  srcText: ""
};

SrcTextEditor.defaultProps = {};