/* eslint no-param-reassign: 0 */
import React from "react";
import { array, func, number, shape, string } from "prop-types";
import shortUuid from "short-uuid";

import {
  Action,
  Actionbar,
  Container,
  Separator,
  Text
} from "interviewjs-styleguide";

import { QuestionForm } from "../";

const uuidv4 = () => shortUuid().fromUUID(shortUuid.uuid());

export default class PollForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.addQuestion = this.addQuestion.bind(this);
    this.removeQuestion = this.removeQuestion.bind(this);
  }

  saveQuestion(data, i) {
    console.log("data: ", data);
    console.log("i: ", i);

    // const arr = [...this.state.poll, data];
    // const obj = { poll: arr };
    // this.props.updateStory(obj, this.props.storyIndex);
  }

  removeQuestion(i) {
    const { poll } = this.props.story;
    const obj = { poll: [...poll.slice(0, i), ...poll.slice(i + 1)] };
    this.props.updateStory(obj, this.props.storyIndex);
  }

  addQuestion(data) {
    data.id = `p0_${uuidv4()}`;
    const { poll } = this.props.story;
    const arr = [...poll, data];
    const obj = { poll: arr };
    this.props.updateStory(obj, this.props.storyIndex);
  }

  render() {
    const { poll } = this.props.story;
    const isPollEmpty = poll.length === 0;
    return (
      <Container>
        {poll.map((item, i) => [
          <Container dir="row" key={item.question}>
            <Container flex={[1, 0, "auto"]}>
              <Text typo="p3">{i + 1}</Text>
            </Container>
            <Separator size="s" dir="v" silent />
            <Container flex={[1, 1, "100%"]}>
              <QuestionForm
                handleSubmit={(data) => this.saveQuestion(data, i)}
                question={item}
                removeQuestion={() => this.removeQuestion(i)}
              />
            </Container>
          </Container>,
          <Separator size="m" silent key="separator" />
        ])}
        <Container dir="row">
          <Container flex={[1, 0, "auto"]}>
            <Text typo="p3">{poll.length + 1}</Text>
          </Container>
          <Separator size="s" dir="v" silent />
          <Container flex={[1, 1, "100%"]}>
            <QuestionForm
              isNew
              handleSubmit={(data) => this.addQuestion(data)}
            />
          </Container>
        </Container>
        <Separator size="m" silent />
        <Actionbar>
          <Action
            fixed
            onClick={!isPollEmpty ? this.props.handleSubmit : null}
            primary
            disabled={isPollEmpty}
            type="submit"
          >
            {this.props.cta}
          </Action>
        </Actionbar>
      </Container>
    );
  }
}

PollForm.propTypes = {
  cta: string,
  handleSubmit: func.isRequired,
  story: shape({
    poll: array.isRequired
  }).isRequired,
  storyIndex: number.isRequired,
  updateStory: func.isRequired
};

PollForm.defaultProps = {
  cta: "Save"
};
