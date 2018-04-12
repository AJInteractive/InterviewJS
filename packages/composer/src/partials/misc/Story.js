import css from "styled-components";
import React from "react";
import { array, func, number, shape, string } from "prop-types";
import { format } from "date-fns";

import {
  Action,
  Avatar,
  Container,
  Dropdown,
  DropdownContent,
  Icon,
  Text,
  Tip,
  color,
  radius,
  setSpace,
  time,
  disselect,
} from "interviewjs-styleguide";

import { DeleteModal, DetailsModal, ErrorBoundary } from "../";

const StoryEl = css(Container)`
  ${disselect};
  ${setSpace("mhh")};
  border-radius: ${radius.l};
  cursor: pointer;
  transition: box-shadow ${time.m}, transform ${time.m};
  &:active {
    box-shadow: 0 1px 2px ${color.shadowHL};
    transform: translateY(1px);
  }
`;
const StoryTitle = css(Text.withComponent("h2"))`
  ${disselect};
  ${setSpace("mbx")};
  color: ${color.blueM};
`;
const StorySummary = css(Text.withComponent("p"))`
  ${disselect};
  color: ${color.greyHD};
`;
const StoryDate = css(Text)`
  ${disselect};
  color: ${color.greyM};
`;
const StoryMenu = css.div`
  ${setSpace("mrm")};
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`;
const AvatarList = css.ul`
  text-align: right;
  white-space: nowrap;
`;
const AvatarListItem = css.li`
  border-radius: ${radius.a};
  border: 2px solid ${color.white};
  display: inline-block;
  line-height: 0;
  margin-left: -10px;
  position: relative;
`;

export default class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteModal: false,
      detailsModal: "",
      settingsDropdown: false,
    };
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleDetailsModal = this.toggleDetailsModal.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.updateStory = this.updateStory.bind(this);
  }
  toggleDetailsModal(tab) {
    return tab ? this.setState({ detailsModal: tab, settingsDropdown: false }) : this.setState({ detailsModal: "" });
  }
  toggleDeleteModal() {
    this.setState({
      deleteModal: !this.state.deleteModal,
      settingsDropdown: false,
    });
  }
  toggleDropdown(dropdown) {
    this.setState({ [dropdown]: !this.state[dropdown] });
  }
  updateStory(data) {
    this.props.updateStory(data, this.props.storyIndex);
  }
  render() {
    const { deleteModal, detailsModal } = this.state;
    return [
      <ErrorBoundary key="boundary">
        <Container key="body">
          <StoryEl {...this.props} dir="row" fill="white" onClick={() => this.props.openStory()} padded shift>
            <Container flex={[1, 2, "60%"]}>
              <StoryTitle typo="h2">{this.props.story.title}</StoryTitle>
              <StorySummary typo="p5">{this.props.story.intro}</StorySummary>
            </Container>
            <Container flex={[2, 1, "20%"]} align="center" hide="phone">
              <StoryDate typo="p5">{format(this.props.story.modDate, "D MMM YYYY")}</StoryDate>
            </Container>
            <Container flex={[2, 1, "20%"]} align="right">
              <AvatarList>
                {this.props.story.interviewees
                  ? this.props.story.interviewees.map((el, i) => (
                      <AvatarListItem key={i}>
                        <Tip
                          animation="fade"
                          arrow
                          arrowSize="small"
                          hideDelay={350}
                          interactiveBorder={5}
                          position="bottom"
                          sticky
                          theme="dark"
                          title={el.name ? el.name : ""}
                        >
                          <Avatar size="m" image={el.avatar} />
                        </Tip>
                      </AvatarListItem>
                    ))
                  : null}
              </AvatarList>
            </Container>
          </StoryEl>
          <StoryMenu>
            <Dropdown
              onRequestClose={() => this.toggleDropdown("settingsDropdown")}
              open={this.state.settingsDropdown}
              html={
                <DropdownContent>
                  <ul>
                    <li>
                      <Action onClick={() => this.toggleDetailsModal("meta")}>Story Elements</Action>
                    </li>
                    <li>
                      <Action tone="negative" onClick={this.toggleDeleteModal}>
                        Delete
                      </Action>
                    </li>
                  </ul>
                </DropdownContent>
              }
            >
              <Action iconic onClick={() => this.toggleDropdown("settingsDropdown")}>
                <Icon name="hdots" />
              </Action>
            </Dropdown>
          </StoryMenu>
        </Container>
      </ErrorBoundary>,
      detailsModal !== "" ? (
        <ErrorBoundary>
          <DetailsModal
            {...this.props}
            handleClose={() => this.toggleDetailsModal()}
            isOpen
            key="DetailsModal"
            story={this.props.story}
            storyIndex={this.props.storyIndex}
            tab={this.state.detailsModal}
            updateStory={this.updateStory}
          />
        </ErrorBoundary>
      ) : null,
      deleteModal ? (
        <ErrorBoundary>
          <DeleteModal
            {...this.props}
            deleteStory={() => this.props.deleteStory(this.props.storyIndex)}
            handleClose={() => this.toggleDeleteModal()}
            isOpen
            key="DeleteModal"
            story={this.props.story}
          />
        </ErrorBoundary>
      ) : null,
    ];
  }
}

Story.propTypes = {
  story: shape({
    id: string.isRequried,
    interviewees: array.isRequired,
    intro: string.isRequired,
    pubDate: string.isRequired,
    title: string.isRequired,
  }).isRequired,
  deleteStory: func.isRequired,
  storyIndex: number.isRequired,
  openStory: func.isRequired,
  updateStory: func.isRequired,
};

Story.defaultProps = {};
