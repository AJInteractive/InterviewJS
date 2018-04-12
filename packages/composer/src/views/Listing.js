/* eslint react/forbid-prop-types: 0 */

import css from "styled-components";
import React, { Component } from "react";
import { arrayOf, func, object, shape, string } from "prop-types";
import { Auth } from "aws-amplify";

import {
  Action,
  Avatar,
  Container,
  Dropdown,
  DropdownContent,
  Icon,
  PageSubtitle,
  PageTitle,
  Separator,
  Text,
  breakpoint,
  color,
  disselect,
  radius,
  setHeight,
  setSpace,
  time,
} from "interviewjs-styleguide";

import { configureStore } from "../configureStore";
import { syncRemoteStories } from "../actions/actionCreators";

import { AboutModal, NewStoryModal, Stories, Story, WelcomeModal } from "../partials";

const store = configureStore();

const Page = css.div`
  align-content: stretch;
  align-items: stretch;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
`;

const PageHead = css.div`
  align-items: center;
  background: ${color.greyWt};
  display: flex;
  flex-direction: row;
  flex: 1 0 auto;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 5;
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
  &:after {
    ${setHeight("m")};
    background: linear-gradient(${color.greyWt}, rgba(247, 247, 247, 0));
    content: ' ';
    left: 0;
    position: absolute;
    right: 0;
    top: 100%;s
    width: 100%;
  }
  ${PageTitle} {
    color: ${color.blueBlk};
  }
`;

const PageBody = css.div`
  flex: 1 0 auto;
`;

const PageFoot = css.div`
  ${setSpace("pvl")};
  ${setSpace("phm")};
  bottom: 0;
  left: 0;
  right: 0;
  flex: 0 1 auto;
  text-align: center;
`;

const StoryNew = css(Container)`
  ${disselect};
  ${setSpace("mhh")};
  border-radius: ${radius.l};
  cursor: pointer;
  ${PageSubtitle} {
    ${setSpace("mbx")};
    color: ${color.blueM};
  }
  ${Text} {
    color: ${color.greyBlk};
  }
  transition: box-shadow ${time.m}, transform ${time.m};
  &:active {
    box-shadow: 0 1px 2px ${color.shadowHL};
    transform: translateY(1px);
  }
`;

const UserMenu = css.div`
`;

const UserDdToggle = css.div`
  align-content: center;
  align-items: center;
  color: ${color.blueM};
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  transition: transform ${time.m};
  &:active {
    transform: translateY(1px);
  }
  ${Text} {
    ${setSpace("mrs")};
    ${breakpoint.onlyphone} {
      display: none;
    }
  }
  ${Avatar} {
    ${setSpace("mrs")};
    border: 2px solid ${color.white};
    box-shadow: 0 2px 4px ${color.shadowHL};
    display: inline-block;
    float: left;
  }
`;

const MobileNewStoryToggle = css.span`
  ${breakpoint.tablet} {
    display: none;
  }
`;
const DesktopNewStoryToggle = css.span`
  ${breakpoint.onlyphone} {
    display: none;
  }
`;

export default class ListingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aboutModal: false,
      createStoryModal: false,
      welcomeModal: true,
    };
    this.blockWelcomeModal = this.blockWelcomeModal.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleNewStoryModal = this.toggleNewStoryModal.bind(this);
    this.toggleAboutModal = this.toggleAboutModal.bind(this);
  }

  componentDidMount() {
    if (!this.props.user.ignore && typeof this.props.user.id === "string")
      store.dispatch(syncRemoteStories(this.props.user.id, this.props.user.email));
    if (!this.props.user || !this.props.user.id || this.props.user.ignore) this.props.router.push(`/`);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user.id !== nextProps.user.id && !nextProps.user.ignore && typeof nextProps.user.id === "string")
      store.dispatch(syncRemoteStories(nextProps.user.id ? nextProps.user.id : "", nextProps.user.email));
  }

  handleLogout() {
    Auth.signOut()
      .then(data => {
        console.log(data);
        this.props.router.push(`/`);
      })
      .catch(err => console.log(err));
  }
  toggleNewStoryModal() {
    this.setState({ createStoryModal: !this.state.createStoryModal });
  }
  toggleAboutModal() {
    this.setState({ aboutModal: !this.state.aboutModal });
  }
  blockWelcomeModal() {
    localStorage.setItem("welcomeModalBlocker", "active");
    this.setState({ welcomeModal: false, createStoryModal: true });
  }
  render() {
    // console.log("LISTING PROPS: ", this.props);
    const { createStoryModal, welcomeModal, aboutModal } = this.state;
    const welcomeModalBlocker = localStorage.getItem("welcomeModalBlocker");
    return [
      welcomeModalBlocker !== "active" ? (
        <WelcomeModal handleClose={this.blockWelcomeModal} isOpen={welcomeModal} key="WelcomeModal" />
      ) : null,
      <Page key="Page">
        <PageHead>
          <Container flex={[1, 1, `${100 / 3}%`]} padded>
            <UserMenu>
              <Dropdown
                html={
                  <DropdownContent>
                    <Action onClick={this.handleLogout} tone="negative">
                      Sign out
                    </Action>
                  </DropdownContent>
                }
                position="bottom"
              >
                <UserDdToggle>
                  <Avatar image={this.props.user.avatar} size="m" />
                  <Text typo="p4">{this.props.user.name}</Text>
                  <Icon name="arrow-down" size="x" />
                </UserDdToggle>
              </Dropdown>
            </UserMenu>
          </Container>
          <Container flex={[1, 1, `${100 / 3}%`]} align="center">
            <PageTitle typo="h1">My story library</PageTitle>
          </Container>
          <Container flex={[1, 1, `${100 / 3}%`]} align="right" padded>
            <MobileNewStoryToggle>
              <Action iconic primary onClick={this.toggleNewStoryModal}>
                <Icon name="plus" size="s" />
              </Action>
            </MobileNewStoryToggle>
            <DesktopNewStoryToggle>
              <Action primary onClick={this.toggleNewStoryModal}>
                <Icon name="plus" size="s" /> Create new
              </Action>
            </DesktopNewStoryToggle>
          </Container>
        </PageHead>
        <Separator silent size="h" />
        <PageBody>
          {/* <Container align="center" limit="m">
            <PageSubtitle typo="h3">
                Here is a list of all the stories that you’ve created so far.
                Use it to access and edit the story elements of each story or
                to enter and edit the messaging exchanges with your
                interviewees via the chat dashboard.
            </PageSubtitle>
          </Container>
          <Separator size="m" silent /> */}
          <Container limit="l">
            <Stories>
              {this.props.stories.length > 0 ? (
                this.props.stories.map((story, i) => (
                  <Story
                    {...this.props}
                    deleteStory={() => this.props.deleteStory(i)}
                    key={story.id}
                    openStory={() => this.props.router.push(`/stories/${story.id}`)}
                    story={story}
                    storyIndex={i}
                  />
                ))
              ) : (
                <StoryNew fill="white" onClick={this.toggleNewStoryModal} padded shift>
                  <PageSubtitle typo="h2">Create new</PageSubtitle>
                  <Text typo="p2">Start your new story here…</Text>
                </StoryNew>
              )}
            </Stories>
          </Container>
        </PageBody>
        <PageFoot key="footer">
          <Action onClick={this.toggleAboutModal}>About InterviewJS</Action>
        </PageFoot>
      </Page>,
      createStoryModal ? (
        <NewStoryModal
          {...this.props}
          createStory={this.props.createStory}
          handleClose={this.toggleNewStoryModal}
          isOpen={createStoryModal}
          key="NewStoryModal"
          updateStory={this.props.updateStory}
        />
      ) : null,
      aboutModal ? (
        <AboutModal {...this.props} handleClose={this.toggleAboutModal} isOpen={aboutModal} key="AboutModal" />
      ) : null,
    ];
  }
}

ListingView.propTypes = {
  createStory: func,
  deleteStory: func,
  router: object,
  stories: arrayOf(object),
  updateStory: func,
  user: shape({
    name: string,
    id: string,
    avatar: string,
  }),
};

ListingView.defaultProps = {
  createStory: null,
  deleteStory: null,
  router: null,
  stories: [],
  updateStory: null,
  user: {},
};
