import { func, shape, string } from "prop-types";
import React, { Component } from "react";

import {
  BubbleHTMLWrapper,
  FormItem,
  Label,
  Separator,
  TextInput,
  Legend
} from "interviewjs-styleguide";
import PaneFrame from "../PaneFrame";

export default class LinkPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: this.props.draft
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { draft } = nextProps;
    if (draft !== this.props.draft) {
      this.setState({ draft });
    }
    return null;
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ draft: { ...this.state.draft, [name]: value } }, () =>
      this.props.updateDraft(this.state.draft)
    );
  }
  render() {
    const { value, title } = this.state.draft;
    return (
      <PaneFrame
        {...this.props}
        draft={
          <BubbleHTMLWrapper>
            <a href={value} target="_blank">
              {title || value}
            </a>
          </BubbleHTMLWrapper>
        }
        hasDraft={this.props.draft.value !== ""}
        side="left"
      >
        <Separator size="x" silent />
        <FormItem>
          <Label>Link URL</Label>
          <TextInput
            input
            name="value"
            onChange={(e) => this.handleChange(e)}
            placeholder="Select and paste URL e.g. http:// ... or www. ... "
            required
            type="url"
            value={value}
          />
          <Legend
            tip="Select and paste URL e.g. http:// ... or www. ... "
          >
            i
          </Legend>
        </FormItem>
        <Separator size="m" silent />
        <FormItem>
          <Label>Display text (optional)</Label>
          <TextInput
            input
            name="title"
            onChange={(e) => this.handleChange(e)}
            placeholder="Type the text to be hyperlinked"
            value={title}
          />
          <Legend
            tip="Type the text to be hyperlinked"
          >
            i
          </Legend>
        </FormItem>
      </PaneFrame>
    );
  }
}

LinkPane.propTypes = {
  updateDraft: func.isRequired,
  draft: shape({
    value: string,
    title: string
  })
};

LinkPane.defaultProps = {
  draft: {
    value: "",
    title: ""
  }
};
