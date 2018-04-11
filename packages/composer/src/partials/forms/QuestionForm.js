import React from "react";
import { bool, func, shape, string } from "prop-types";

import {
  Action,
  CharacterCount,
  Container,
  Form,
  FormItem,
  Icon,
  Label,
  Legend,
  Separator,
  TextInput
} from "interviewjs-styleguide";

import { GLOBALS } from "../../options";

import validateField from "./validateField";

export default class PollForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.question,
      formValidation: { question: null, answer1: null, answer2: null }
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
  }

  handleSubmit(e) {
    const { isNew } = this.props;
    const { formData, formValidation } = this.state;
    if (isNew) {
      if (
        formValidation.question === true &&
        formValidation.answer1 === true &&
        formValidation.answer2 === true
      ) {
        if (e) e.preventDefault();
        this.props.handleSubmit(formData);
        this.setState({
          formData: this.props.question,
          formValidation: { question: null, answer1: null, answer2: null }
        });
      }
      return null;
    }
    return this.props.handleSubmit(this.state.formData);
  }

  handleBlur(e) {
    const { name } = e.target;
    this.setState({
      formValidation: {
        ...this.state.formValidation,
        [name]: validateField(e.target)
      }
    });
    // return this.props.handleSave && validateField(e.target)
    //   ? this.props.handleSave({ [name]: this.state.formData[name] })
    //   : null;
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  }

  removeQuestion(e) {
    if (e) e.preventDefault();
    this.props.removeQuestion();
  }

  render() {
    const { isNew } = this.props;
    return (
      <Form onSubmit={(e) => this.handleSubmit(e)}>
        <Container dir="row">
          <Container flex={[1, 1, `${100 / 2}%`]}>
            <FormItem>
              <Label>Question</Label>
              <CharacterCount>
                {64 - this.state.formData.question.length}
              </CharacterCount>
              <TextInput
                input
                maxLength="64"
                minLength="1"
                name="question"
                onBlur={(e) => this.handleBlur(e)}
                onChange={(e) => this.handleChange(e)}
                placeholder="Did you enjoy this story?"
                required
                valid={this.state.formValidation.question}
                value={this.state.formData.question}
              />
              {isNew ? (
                <Legend tip="Ask a question based on the content of your story">
                  i
                </Legend>
              ) : null}
            </FormItem>
          </Container>
          <Separator dir="v" silent size="s" />
          <Container flex={[1, 1, `${100 / 2}%`]}>
            <FormItem>
              <Label>Answers</Label>
              <Container dir="row">
                <Container flex={[1, 0, `${100 / 2}%`]}>
                  <CharacterCount>
                    {GLOBALS.fixedButtonCharLimit -
                      this.state.formData.answer1.length}
                  </CharacterCount>
                  <TextInput
                    input
                    maxLength={GLOBALS.fixedButtonCharLimit}
                    minLength="1"
                    name="answer1"
                    onBlur={(e) => this.handleBlur(e)}
                    onChange={(e) => this.handleChange(e)}
                    place="left"
                    placeholder="Yes"
                    required
                    valid={this.state.formValidation.answer1}
                    value={this.state.formData.answer1}
                  />
                </Container>
                <Container flex={[1, 0, `${100 / 2}%`]}>
                  <CharacterCount>
                    {GLOBALS.fixedButtonCharLimit -
                      this.state.formData.answer2.length}
                  </CharacterCount>
                  <TextInput
                    input
                    maxLength={GLOBALS.fixedButtonCharLimit}
                    minLength="1"
                    name="answer2"
                    onBlur={(e) => this.handleBlur(e)}
                    onChange={(e) => this.handleChange(e)}
                    place="right"
                    placeholder="No"
                    required
                    valid={this.state.formValidation.answer2}
                    value={this.state.formData.answer2}
                  />
                </Container>
              </Container>
              {isNew ? (
                <Legend tip="Provide mutually exclusive, binary choices">
                  i
                </Legend>
              ) : null}
            </FormItem>
          </Container>
          <Separator dir="v" silent size="s" />
          <Container flex={[1, 0, "auto"]}>
            <Action
              iconic
              onClick={isNew ? this.handleSubmit : this.removeQuestion}
              secondary
              tone={isNew ? "positive" : "negative"}
            >
              <Icon name={isNew ? "plus" : "cross"} />
            </Action>
          </Container>
        </Container>
      </Form>
    );
  }
}

PollForm.propTypes = {
  handleSubmit: func.isRequired,
  isNew: bool,
  question: shape({
    question: string,
    answer1: string,
    answer2: string
  }),
  removeQuestion: func
};

PollForm.defaultProps = {
  isNew: false,
  question: {
    question: "",
    answer1: "",
    answer2: ""
  },
  removeQuestion: null
};
