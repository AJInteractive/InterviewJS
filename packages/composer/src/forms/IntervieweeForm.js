import React, { Component } from "react";
import { func, shape, string } from "prop-types";

import {
  Actionbar,
  Action,
  CharacterCount,
  Form,
  FormItem,
  Label,
  Separator,
  TextInput
} from "interviewjs-styleguide";

export default class IntervieweeForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        avatar: this.props.interviewee.avatar,
        bio: this.props.interviewee.bio,
        color: this.props.interviewee.color,
        name: this.props.interviewee.name,
        title: this.props.interviewee.title
      }
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    if (e) e.preventDefault();
    this.props.handleSubmit(this.state.formData);
  }
  handleInput(e) {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value }
    });
  }
  render() {
    return (
      <Form onSubmit={(e) => this.handleSubmit(e)}>
        <FormItem>
          <Label>Name</Label>
          <CharacterCount>
            {50 - this.state.formData.name.length}
          </CharacterCount>
          <TextInput
            input
            maxlength="50"
            name="name"
            onChange={(e) => this.handleInput(e)}
            placeholder="i.e. Barack Obama"
            required
            value={this.state.formData.name}
          />
        </FormItem>
        <Separator size="m" silent />
        <FormItem>
          <Label>Title</Label>
          <CharacterCount>
            {50 - this.state.formData.title.length}
          </CharacterCount>
          <TextInput
            input
            maxlength="50"
            name="title"
            onChange={(e) => this.handleInput(e)}
            placeholder="i.e. 44th President of the US"
            required
            value={this.state.formData.title}
          />
        </FormItem>
        <Separator size="m" silent />
        <FormItem>
          <Label>Bio</Label>
          <CharacterCount>
            {280 - this.state.formData.bio.length}
          </CharacterCount>
          <TextInput
            area
            maxlength="280"
            name="bio"
            onChange={(e) => this.handleInput(e)}
            placeholder=""
            required
            value={this.state.formData.bio}
          />
        </FormItem>
        <Separator size="m" silent />
        <Actionbar>
          <Action fixed primary type="submit">
            Save
          </Action>
        </Actionbar>
      </Form>
    );
  }
}

IntervieweeForm.propTypes = {
  handleSubmit: func.isRequired,
  interviewee: shape({
    avatar: string,
    bio: string,
    color: string,
    name: string,
    title: string
  })
};

IntervieweeForm.defaultProps = {
  interviewee: {
    avatar: "",
    bio: "",
    color: "",
    name: "",
    title: ""
  }
};
