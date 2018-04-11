import React from 'react';
import css from 'styled-components';
import { arrayOf, func, object, shape, string } from 'prop-types';
import Joyride from 'react-joyride';

import {
  Action,
  Container,
  Icon,
  PageTitle,
  Preloader,
  Separator,
  Text,
  breakpoint,
  color,
  font,
  radius,
  setSpace
} from 'interviewjs-styleguide';

import './joyride.css';

import {
  DetailsModal,
  IntervieweePane,
  MobileRedirect,
  PublishStoryModal,
  StoryPane,
  UserPane,
  ErrorBoundary
} from '../partials';

const Page = css.div`
  align-content: stretch;
  align-items: stretch;
  display: none;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
  ${breakpoint.desktop} {
    display: flex;
  }
`;

const PageHead = css.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 1 0 auto;
  ${PageTitle} {
    color: ${color.blueBlk};
  }
`;
const SaveIndicator = css(Text)`
  color: ${color.greenM};
  font-weight: bold;
`;

const PageBody = css.div`
  ${setSpace('pbm')};
  ${setSpace('phm')};
  align-content: stretch;
  align-items: stretch;
  display: flex;
  flex-direction: row;
  flex: 0 1 100%;
  & > *:first-child {
    ${setSpace('mrs')};
  }
  & > *:nth-child(2) {
    ${setSpace('mhs')};
  }
  & > *:last-child {
    ${setSpace('mls')};
  }
`;

export default class ComposerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBubble: null,
      currentInterviewee: 0,
      detailsModal: '',
      joyrideSteps: [],
      publishModal: false,
      savedLabel: null
    };
    this.deleteInterviewee = this.deleteInterviewee.bind(this);
    this.initTour = this.initTour.bind(this);
    this.joyrideCallback = this.joyrideCallback.bind(this);
    this.showSavedIndicator = this.showSavedIndicator.bind(this);
    this.switchInterviewee = this.switchInterviewee.bind(this);
    this.toggleBubbleEdit = this.toggleBubbleEdit.bind(this);
    this.toggleDetailsModal = this.toggleDetailsModal.bind(this);
    this.togglePublishModal = this.togglePublishModal.bind(this);
    this.updateStory = this.updateStory.bind(this);
  }

  componentDidMount() {
    this.initTour();
  }

  initTour() {
    const joyrideStyles = {
      fontFamily: font.serif,
      backgroundColor: color.blueBlk,
      borderRadius: radius.l,
      color: color.white,
      mainColor: color.white,
      textAlign: 'left',
      padding: 0,
      arrow: {},
      beacon: {
        inner: color.greenM,
        outer: color.greenM
      },
      header: {
        border: 'none',
        fontFamily: font.serif,
        fontSize: '15px',
        fontWeight: 'bold',
        lineHeight: '20px'
      },
      main: {
        color: color.greyLLt,
        fontFamily: font.serif,
        fontSize: '14px',
        lineHeight: '20px',
        margin: 0,
        padding: '7pxpx 0'
      },
      footer: {
        paddingTop: '3px'
      },
      button: {
        borderRadius: '100px',
        boxShadow: `0 1px 3px ${color.shadowM}`,
        color: color.blueM,
        fontFamily: font.serif,
        fontSize: '13px',
        padding: '7px 12px'
      },
      skip: {
        color: color.flareLD,
        fontFamily: font.serif,
        fontSize: '13px',
        padding: '7px 0',
        textDecoration: 'underline'
      },
      back: {
        color: color.flareLD,
        fontFamily: font.serif,
        fontSize: '13px',
        padding: '7px 0',
        textDecoration: 'underline'
      },
      close: {},
      hole: {}
    };
    const steps = [
      {
        title: 'Welcome to the InterviewJS dashboard! ',
        text:
          'Here’s where you convert your interviews into messaging exchanges. Follow us on a quick tour. You don’t have to remember everything - once you’re starting to build conversations you can click ‘i’ for extra info and guidance.',
        selector: '.jr-intro',
        style: joyrideStyles,
        position: 'top-left'
      },
      {
        title: '1. This is the chat panel',
        text:
          'It displays the conversations between your interviewees and end users. Switch between different messaging exchanges by clicking the interviewee profile pictures at the top.',
        selector: '.jr-step1',
        style: joyrideStyles,
        position: 'left'
      },
      {
        title: '2. This is the interviewee panel',
        text:
          'Use this space to create text messages from an interview or transcript.  Type a text or paste a transcript, then highlight and select a quote and click + to add it to the chat panel in the middle.',
        selector: '.jr-step2',
        style: joyrideStyles,
        position: 'right'
      },
      {
        title: '3. Create multimedia messages',
        text:
          'Your interviewee can respond with more than just text. Select these icons to create messages that contain links, photos, videos, maps or audio.',
        selector: '.jr-step3',
        style: joyrideStyles,
        position: 'bottom'
      },
      {
        title: '4. This is the user panel',
        text:
          'Here you create interactions for the readers of your chat story.  We call them ‘users’ because InterviewJS allows them to actively engage with the interviewees via the interactions that you create for them.',
        selector: '.jr-step4',
        style: joyrideStyles,
        position: 'left'
      },
      {
        title: '5. Option 1 - Single interaction ',
        text:
          'A single interaction simply moves the story on. Want users to ask the interviewee a question? Type it into the space provided! Alternatively choose a pre-scripted comment or type your own. Select tabs to create user requests for multimedia.  Then click + to add this user message to the central chat panel.',
        selector: '.jr-step5',
        style: joyrideStyles,
        position: 'left'
      },
      {
        title: '6. Option 2 - Choice interaction',
        text:
          'Create a choice between two user interactions here. Select this after creating a question, a comment or a multimedia request above and add a second one in the same way. Once both interactions have been created, click + to add them to the central chat panel.',
        selector: '.jr-step6',
        style: joyrideStyles,
        position: 'left'
      },
      {
        title: '7. Edit your conversation',
        text:
          'InterviewJS allows you to edit text in your messages. You can also re-arrange the order by drag and drop.',
        selector: '.jr-step1',
        style: joyrideStyles,
        position: 'left'
      },
      {
        title: '8. Edit your story elements',
        text:
          'Need to correct the title or edit a profile? Or give the user a bit more context? Select “story elements” to access your story intro and biographies.',
        selector: '.jr-step7',
        style: joyrideStyles,
        position: 'bottom'
      },
      {
        title: '9. Publish',
        text:
          'Once you’re done creating your story, you can publish it here - you’ll see a preview before it goes live! Each time you publish, you will be given a new link to share with your network.',
        selector: '.jr-step8',
        style: joyrideStyles,
        position: 'bottom'
      }
    ];
    const doneComposerTour = localStorage.getItem('doneComposerTour');
    if (!doneComposerTour) this.setState({ joyrideSteps: steps });
    // setTimeout(() => this.setState({ joyrideSteps: steps }), 3000);
  }

  switchInterviewee(interviewee) {
    this.setState({ currentInterviewee: interviewee });
  }

  deleteInterviewee(story, interviewee) {
    this.setState({ currentInterviewee: 0 });
    this.props.deleteInterviewee(story, interviewee);
  }

  toggleDetailsModal(tab) {
    return tab
      ? this.setState({ detailsModal: tab })
      : this.setState({ detailsModal: '' });
  }

  togglePublishModal() {
    this.setState({ publishModal: !this.state.publishModal });
  }

  toggleBubbleEdit(target) {
    console.log('toggleBubbleEdit :', target);
    this.setState({ currentBubble: target });
  }

  updateStory(data) {
    const { storyId } = this.props.params;
    const i = this.props.stories.findIndex((story) => story.id === storyId);
    this.props.updateStory(data, i);
    this.showSavedIndicator();
  }

  showSavedIndicator() {
    this.setState({ savedLabel: false });
    setTimeout(() => this.setState({ savedLabel: true }), 2000);
    setTimeout(() => this.setState({ savedLabel: null }), 5000);
  }

  joyrideCallback(cb) {
    if (cb.type === 'finished') localStorage.setItem('doneComposerTour', true);
    return null;
  }

  render() {
    const { storyId } = this.props.params;
    const storyIndex = this.props.stories.findIndex(
      (story) => story.id === storyId
    );
    const story = this.props.stories[storyIndex];

    if (!story) {
      this.props.router.push(`/`);
      return null;
    }

    console.log('COMPOSER PROPS: ', this.props);

    const renderSaveIndicator = () => {
      if (this.state.savedLabel === false) {
        return [<Preloader />, <Separator dir="v" size="m" />];
      } else if (this.state.savedLabel === true) {
        return [
          <SaveIndicator typo="p5">
            <Icon name="checkmark" /> Saved
          </SaveIndicator>,
          <Separator dir="v" size="m" />
        ];
      }
      return null;
    };

    return [
      <Page key="Page">
        <ErrorBoundary>
          <PageHead>
            <Container flex={[1, 1, `${100 / 3}%`]} padded>
              <Action onClick={() => this.props.router.push(`/stories`)}>
                <Icon name="arrow-left" size="x" /> My story library
              </Action>
              <Separator dir="v" size="m" />
              <Action
                onClick={() => this.toggleDetailsModal('meta')}
                className="jr-step7"
              >
                <Icon
                  name="info2"
                  size="s"
                  style={{
                    position: 'relative',
                    top: '1px',
                    marginRight: '2px'
                  }}
                />
                {` `}Story elements
              </Action>
            </Container>
            <Container flex={[1, 1, `${100 / 3}%`]} align="center">
              <PageTitle typo="h2">{story.title}</PageTitle>
            </Container>
            <Container flex={[1, 1, `${100 / 3}%`]} align="right" padded>
              {renderSaveIndicator()}
              <Action href="https://interviewjs.io" target="_blank">
                Help
              </Action>
              <Separator dir="v" size="m" />
              <Action
                primary
                onClick={this.togglePublishModal}
                className="jr-step8"
              >
                Publish Story
              </Action>
            </Container>
          </PageHead>
          <PageBody>
            <Container flex={[1, 1, `${100 / 3}%`]} className="jr-step2">
              <IntervieweePane
                {...this.props}
                currentBubble={this.state.currentBubble}
                currentInterviewee={this.state.currentInterviewee}
                story={story}
                storyIndex={storyIndex}
                showSavedIndicator={this.showSavedIndicator}
              />
            </Container>
            <Container flex={[0, 1, `400px`]} className="jr-step1">
              <StoryPane
                {...this.props}
                currentInterviewee={this.state.currentInterviewee}
                story={story}
                storyIndex={storyIndex}
                switchInterviewee={this.switchInterviewee}
                toggleBubbleEdit={this.toggleBubbleEdit}
                toggleDetailsModal={() =>
                  this.toggleDetailsModal('interviewees')
                }
              />
            </Container>
            <Container flex={[1, 1, `${100 / 3}%`]} className="jr-step4">
              <UserPane
                {...this.props}
                currentBubble={this.state.currentBubble}
                currentInterviewee={this.state.currentInterviewee}
                story={story}
                storyIndex={storyIndex}
                showSavedIndicator={this.showSavedIndicator}
              />
            </Container>
          </PageBody>
        </ErrorBoundary>
      </Page>,
      <MobileRedirect {...this.props} key="MobileRedirect" />,
      this.state.detailsModal !== '' ? (
        <DetailsModal
          {...this.props}
          deleteInterviewee={this.deleteInterviewee}
          handleClose={() => this.toggleDetailsModal()}
          isOpen
          key="DetailsModal"
          story={story}
          storyIndex={storyIndex}
          tab={this.state.detailsModal}
          updateStory={this.updateStory}
        />
      ) : null,
      this.state.publishModal ? (
        <PublishStoryModal
          {...this.props}
          handleClose={() => this.togglePublishModal()}
          isOpen
          key="PublishModal"
          story={story}
          user={this.props.user}
          storyIndex={storyIndex}
          tab={this.state.detailsModal}
          updateStory={this.updateStory}
        />
      ) : null,
      <Joyride
        ref="joyride" /* eslint react/no-string-refs: 0 */
        steps={this.state.joyrideSteps}
        autoStart={false}
        showSkipButton
        showStepsProgress
        type="continuous"
        locale={{
          back: 'Back',
          close: 'Close',
          last: 'Thanks!',
          next: 'Next',
          skip: 'Skip tour'
        }}
        holePadding={10}
        run // or some other boolean for when you want to start it
        // debug
        callback={this.joyrideCallback}
      />
    ];
  }
}

ComposerView.propTypes = {
  deleteInterviewee: func,
  params: shape({ storyId: string.isRequired }).isRequired,
  router: object.isRequired /* eslint react/forbid-prop-types: 0 */,
  stories: arrayOf(object),
  user: object,
  updateStory: func
};

ComposerView.defaultProps = {
  deleteInterviewee: null,
  stories: [],
  user: {},
  updateStory: null
};
