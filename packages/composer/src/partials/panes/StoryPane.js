import { array, func, shape, number } from "prop-types";
import css from "styled-components";
import React from "react";

import { Action, Avatar, Container, Icon, Tip, radius, setSize, setSpace, skin, time } from "interviewjs-styleguide";

import { Storyline } from "./story";

const PaneEl = css(Container)`
  height: 100%;
`;
const PaneHead = css.div`
  bottom: 100%;
  left: 0;
  position: absolute;
  right: 0;
  text-align: center;
  transform: translateY(50%);
  z-index: 5;
`;
const PaneBody = css.div`
  height: 100%;
  width: 100%;
  & > * {
    height: 100%;
    overflow-y: auto;
  }
`;

const IntervieweesWrapper = css.div`
  display: inline-block;
  position: relative;
`;
const IntervieweesAction = css.span`
  ${setSize("s")};
  ${setSpace("mlx")};
  display: inline-block;
  left: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  & button {
    ${setSize("s")};
  }
`;
const Interviewees = css.ol`
  display: block;
  text-align: center;
`;
const Interviewee = css.li`
  border-color: transparent;
  border-radius: ${radius.a};
  border-style: solid;
  border-width: 2px;
  display: inline-block;
  line-height: 0;
  margin-left: 2px;
  margin-right: 2px;
  text-align: center;
  transition: border ${time.m};
  & button {
    border-width: 2px;
    min-height: auto;
    padding: 0;
  }
  & button:active {
    transform: none !important;
  }
  ${({ active, intervieweeColor }) =>
    active
      ? `
  border-color: ${intervieweeColor || skin.speakerColor};
  `
      : ``}
`;

export default class StoryPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.deleteStorylineItem = this.deleteStorylineItem.bind(this);
  }
  deleteStorylineItem(i) {
    const { storyIndex, currentInterviewee } = this.props;
    this.props.deleteStorylineItem(storyIndex, currentInterviewee, i);
  }
  render() {
    const { interviewees } = this.props.story;
    const { currentInterviewee } = this.props;
    const { storyline } = interviewees[currentInterviewee];
    return (
      <PaneEl fill="white" rounded shift dir="column" className="jr-intro">
        <PaneHead>
          <IntervieweesWrapper>
            <Interviewees>
              {interviewees.length > 0
                ? interviewees.map((interviewee, intervieweeIndex) => (
                    <Interviewee
                      active={this.props.currentInterviewee === intervieweeIndex}
                      intervieweeColor={interviewee.color ? interviewee.color : null}
                      key={intervieweeIndex}
                    >
                      <Tip position="bottom" title={interviewee.name}>
                        <Action secondary onClick={() => this.props.switchInterviewee(intervieweeIndex)}>
                          <Avatar image={interviewee.avatar} size="m" />
                        </Action>
                      </Tip>
                    </Interviewee>
                  ))
                : null}
            </Interviewees>
            <IntervieweesAction>
              <Tip position="bottom" title="Manage interviewees">
                <Action iconic onClick={this.props.toggleDetailsModal} secondary>
                  <Icon name="pen" size="x" />
                </Action>
              </Tip>
            </IntervieweesAction>
          </IntervieweesWrapper>
        </PaneHead>
        <PaneBody>
          <Storyline {...this.props} deleteStorylineItem={this.deleteStorylineItem} storyline={storyline} />
        </PaneBody>
      </PaneEl>
    );
  }
}

StoryPane.propTypes = {
  currentInterviewee: number.isRequired,
  moveStorylineItem: func.isRequired,
  deleteStorylineItem: func.isRequired,
  toggleBubbleEdit: func.isRequired,
  story: shape({
    interviewees: array.isRequired,
  }).isRequired,
  storyIndex: number.isRequired,
  switchInterviewee: func.isRequired,
  toggleDetailsModal: func.isRequired,
};

StoryPane.defaultProps = {};
