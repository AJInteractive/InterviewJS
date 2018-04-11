import React from "react";
import { bool, func, shape, string } from "prop-types";

import {
  Actionbar,
  Action,
  CharacterCount,
  Form,
  FormItem,
  Label,
  Legend,
  Separator,
  TextInput,
} from "interviewjs-styleguide";

import validateField from "./validateField";

export default class DetailsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        intro: this.props.story.intro,
        context: this.props.story.context,
      },
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    if (e) e.preventDefault();
    this.props.handleSubmit(this.state.formData);
  }
  handleBlur(e) {
    const { target } = e;
    const { name } = target;
    return this.props.handleSave && validateField(target)
      ? this.props.handleSave({ [name]: this.state.formData[name] })
      : null;
  }
  handleChange(e) {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value },
    });
  }
  render() {
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <FormItem>
          <Label>Intro</Label>
          <CharacterCount>{160 - this.state.formData.intro.length}</CharacterCount>
          <TextInput
            area
            maxLength="160"
            name="intro"
            onBlur={e => this.handleBlur(e)}
            onChange={e => this.handleChange(e)}
            placeholder="Start with something like “Investigate...”, “Find out ... “, or “Learn ...”."
            required={this.props.required}
            value={this.state.formData.intro}
          />
          <Legend
            tip="It’s ok if it sounds like a task:
              “Investigate how ...”, “Find out ... “, or “Learn ...” -
              messaging is interactive and the user will choose a response."
          >
            i
          </Legend>
        </FormItem>
        <Separator size="m" silent />
        <FormItem>
          <Label>Context</Label>
          <CharacterCount>{900 - this.state.formData.context.length}</CharacterCount>
          <TextInput
            area
            maxLength="900"
            name="context"
            onBlur={e => this.handleBlur(e)}
            onChange={e => this.handleChange(e)}
            placeholder="Give your user some background to the story, why does it matter?"
            required={this.props.required}
            value={this.state.formData.context}
          />
          <Legend
            tip="Imagine the user finds your interviewees in mid-discussion.
            What key facts should they know? Any crucial points of agreement/
            disagreement?"
          >
            i
          </Legend>
        </FormItem>
        <Separator size="m" silent />
        <Actionbar>
          <Action fixed primary type="submit">
            {this.props.cta}
          </Action>
        </Actionbar>
      </Form>
    );
  }
}

DetailsForm.propTypes = {
  cta: string,
  handleSave: func,
  handleSubmit: func.isRequired,
  required: bool,
  story: shape({
    context: string,
    intro: string,
  }),
};

DetailsForm.defaultProps = {
  cta: "Save",
  required: false,
  handleSave: null,
  story: {
    context: "",
    intro: "",
  },
};
