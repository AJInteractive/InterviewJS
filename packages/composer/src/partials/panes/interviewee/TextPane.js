import { func, shape, string } from "prop-types";
import css from "styled-components";
import React, { Component } from "react";

import { color, font, setSpace, setType } from "interviewjs-styleguide";
import PaneFrame from "../PaneFrame";

const SrcText = css.textarea`
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

const SrcPlaceholder = css.p`
  bottom: 0;
  color: ${color.greyBlk};
  display: flex;
  flex-direction: column;
  font-style: italic;
  line-height: 1.5em;
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

const Draft = css.textarea`
  ${setSpace("pan")};
  ${setType("x")};
  background: none;
  border: none;
  color: ${color.blueBlk};
  font-family: ${font.serif};
  height: 100%;
  overflow-y: auto;
  resize: none;
  width: 100%;
`;

export default class TextPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: this.props.draft,
      srcText: this.props.srcText,
    };

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDraftEdit = this.onDraftEdit.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { draft, srcText } = nextProps;
    if (srcText !== this.props.srcText) {
      this.setState({ srcText });
    } else if (draft !== this.props.draft) {
      this.setState({ draft });
    }
    return null;
  }
  onBlur() {
    this.saveChanges();
  }
  onChange(e) {
    this.setState({ srcText: e.target.value });
  }
  onSelect(e) {
    const { currentTarget } = e;
    const { selectionStart, selectionEnd } = e.currentTarget;
    const sel = currentTarget.value.substring(selectionStart, selectionEnd);
    const newDraft = { value: sel };
    this.props.updateDraft(newDraft, "text");
  }
  onDraftEdit(e) {
    const { value } = e.currentTarget;
    const draft = { value };
    this.props.updateDraft(draft);
  }
  saveChanges() {
    const { srcText } = this.state;
    this.props.updateSrcText(srcText);
  }
  render() {
    return (
      <PaneFrame
        {...this.props}
        draft={<Draft onChange={this.onDraftEdit} value={this.state.draft.value} />}
        hasDraft={this.props.draft.value !== ""}
        side="left"
      >
        <SrcText onBlur={this.onBlur} onChange={this.onChange} onSelect={this.onSelect} value={this.state.srcText} />
        {this.state.srcText.length === 0 ? (
          <SrcPlaceholder>
            Here’s where you can type your interview notes or copy and paste existing transcripts to convert into chat
            bubbles
          </SrcPlaceholder>
        ) : null}
      </PaneFrame>
    );
  }
}

TextPane.propTypes = {
  draft: shape({
    value: string,
  }),
  srcText: string,
  updateDraft: func.isRequired,
  updateSrcText: func.isRequired,
};

TextPane.defaultProps = {
  draft: {
    value: "",
  },
  srcText: "",
};
