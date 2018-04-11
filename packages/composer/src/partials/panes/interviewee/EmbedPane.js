import { func, shape, string } from "prop-types";
import React, { Component } from "react";

import { BubbleHTMLWrapper, FormItem, Label, Separator, TextInput, Legend } from "interviewjs-styleguide";
import PaneFrame from "../PaneFrame";

import { filterIframe } from "../../../util/IframeSanitizer";

export default class EmbedPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draft: this.props.draft,
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
    const clean = filterIframe(value);
    console.log(clean);
    this.setState(
      { draft: { ...this.state.draft, [name]: value } },
      () =>
        clean.toLowerCase().startsWith("<iframe") &&
        clean.toLowerCase().includes("src=") &&
        clean.toLowerCase().endsWith("></iframe>")
          ? this.props.updateDraft(this.state.draft, clean)
          : null
    );
  }

  render() {
    const { value } = this.state.draft;
    const clean = filterIframe(value);

    const renderDraft = () => {
      if (value.length > 0) {
        return clean.toLowerCase().startsWith("<iframe") &&
          clean.toLowerCase().includes("src=") &&
          clean.toLowerCase().endsWith("></iframe>") ? (
          <BubbleHTMLWrapper type="embed">
            <div dangerouslySetInnerHTML={{ __html: clean }} />
          </BubbleHTMLWrapper>
        ) : (
          <BubbleHTMLWrapper>
            This is not a valid iframe. An iframe code starts with {`"<iframe" `}
            and ends with {`"></iframe>"`}
          </BubbleHTMLWrapper>
        );
      }
      return null;
    };

    return (
      <PaneFrame
        {...this.props}
        draft={<div>{renderDraft()}</div>}
        hasDraft={this.props.draft.value !== ""}
        side="left"
      >
        <Separator size="x" silent />
        <FormItem>
          <Label>Embed URL</Label>
          <TextInput
            area
            name="value"
            onChange={e => this.handleChange(e)}
            placeholder="Insert an iframe to display web content directly into your chat"
            required
            rows={10}
            type="url"
            value={this.state.draft.value}
          />
          <Legend tip="Insert an iframe to display web content directly in your chat. Click the share icon to see if an ‘embed code’ is available. Then copy and paste.">
            i
          </Legend>
        </FormItem>
      </PaneFrame>
    );
  }
}

EmbedPane.propTypes = {
  updateDraft: func.isRequired,
  draft: shape({
    value: string,
    title: string,
  }),
};

EmbedPane.defaultProps = {
  draft: {
    value: "",
    title: "",
  },
};
