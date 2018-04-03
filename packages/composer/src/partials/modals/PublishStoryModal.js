/* eslint react/forbid-prop-types: 0 */
import css from "styled-components";
import React, { Component } from "react";
import ReactModal from "react-modal";
import { arrayOf, bool, func, number, object } from "prop-types";
import { API, Storage } from "aws-amplify";
import shortUuid from "short-uuid";

import {
  Actionbar,
  Action,
  Breadcrumb,
  Breadcrumbs,
  Container,
  Modal,
  ModalBody,
  ModalHead,
  PageTitle,
  PageSubtitle,
  Separator,
  radius
} from "interviewjs-styleguide";

import { DetailsForm, MetaForm, Poll } from "../";

import iframeRatioSpacer from "./iframeRatioSpacer.png";

const uuidv4 = () => shortUuid().fromUUID(shortUuid.uuid());

const getStepState = (step, i) => {
  if (step === i) {
    return "active";
  } else if (step > i) {
    return "passed";
  }
  return null;
};

const PreviewWrapper = css.div`
  border-radius: ${radius.m};
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  overflow: hidden;
  position: relative;
  width: 100%;
  img {
    display: block;
    width: 100%;
  }
  iframe {
    height: 100%;
    left: 0;
    max-width: 100% !important;
    position: absolute;
    top: 0;
    width: 100%;
  }
`;

export default class PublishStoryModal extends Component {
  constructor(props) {
    super(props);

    let storyBase = "/"; // FIXME: local-dev url?
    switch(document.location.hostname) {
      case "composer.interviewjs.net.s3-website-us-east-1.amazonaws.com":
        storyBase = "http://story.interviewjs.net.s3-website-us-east-1.amazonaws.com";
        break;
      case "composer.interviewjs.net":
        storyBase = "https://story.interviewjs.net/";
        break;
      default:
        storyBase = "https://story.interviewjs.io/"; // production
    }

    this.state = {
      step: 0,
      storyKey: null,
      storyBase
    };

    this.handleStep0 = this.handleStep0.bind(this);
    this.handleStep1 = this.handleStep1.bind(this);
    this.handleStep2 = this.handleStep2.bind(this);
    this.handleStep3 = this.handleStep3.bind(this);
  }

  componentDidUpdate() {
    if (this.iframe) {
      this.iframe.addEventListener("load", () => {
        // console.log("iframe loaded");
        if (!this.state.storyKey) setTimeout(
          () => this.iframe.contentWindow.postMessage(this.props.story, "*"),
          5000
        );
      });
    }
  }

  handleStep0(data) {
    this.props.updateStory(data, this.props.storyIndex);
    this.setState({ step: this.state.step + 1 });
  }

  handleStep1(data) {
    this.props.updateStory(data, this.props.storyIndex);
    this.setState({ step: this.state.step + 1 });
  }

  handleStep2() {
    // Publish
    console.log(this.props.user);
    Storage.put(`stories/${this.props.user.id}/${this.props.story.id}/story.json`, JSON.stringify(this.props.story), {
      bucket: "data.interviewjs.io",
      level: "public",
      contentType: "application/json"
    })
    .then (async result => {
      console.log(result);

      // const { result2 } = await API.get("Story", `/publish`, { response: true }); // /${this.props.story.id}
      // const { result2 } = await API.get("Poll", `/poll`, { response: true }); // /${this.props.story.id}
      // console.log(result2);
      // API.get("Poll", `/poll`, { response: true }).then(result2 => console.log(result2));
      API.post("Push", `/story/${this.props.story.id}`, { response: true, body: { a: 1 } }).then(result2 => console.log(result2));

      this.setState({
        step: this.state.step + 1,
        // storyKey: result.key,
      });
    })
    .catch(err => console.log(err));
  }

  handleStep3() {
    this.props.handleClose();
  }

  render() {
    const iframeViewer = `${this.state.storyBase}${this.props.story.id}`;

    const { step } = this.state;
    const getModalBody = () => {
      if (step === 0) {
        return (
          <Container limit="s" align="center">
            <PageSubtitle typo="h3">Review your story details…</PageSubtitle>
            <Separator size="m" silent />
            <MetaForm
              handleSubmit={this.handleStep0}
              story={this.props.story}
              cta="Confirm"
              required
            />
          </Container>
        );
      } else if (step === 1) {
        return (
          <Container limit="s" align="center">
            <PageSubtitle typo="h3">
              Give the readers a quest, tell them what they will learn about a
              topic when speaking to the interviewees.
            </PageSubtitle>
            <Separator size="m" silent />
            <DetailsForm
              handleSubmit={this.handleStep1}
              story={this.props.story}
              cta="Confirm"
              required
            />
          </Container>
        );
      } else if (step === 2) {
        return (
          <Container limit="s" align="center">
            <PageSubtitle typo="h3">
              Engage your readers. Ask them to have their say…
            </PageSubtitle>
            <Separator size="m" silent />
            <Poll
              {...this.props}
              cta="Publish Story"
              handleSubmit={this.handleStep2}
              story={this.props.story}
            />
          </Container>
        );
      } else if (step === 3) {
        return (
          <Container limit="s" align="center">
            <PageSubtitle typo="h3">
              Well done! Your story is now up running. Here’s a preview:
            </PageSubtitle>
            <Separator size="m" silent />
            <PreviewWrapper>
              <img src={iframeRatioSpacer} alt="" />
              <iframe
                title="Preview"
                src={`${iframeViewer}?${uuidv4()}`}
                ref={(iframe) => {
                  this.iframe = iframe;
                }}
              >
                {" "}
              </iframe>
            </PreviewWrapper>
            <Separator size="m" silent />
            Grab the link and share on social
            <Separator size="m" silent />
            <Actionbar>
              <Action fixed primary onClick={this.handleStep3}>
                Close
              </Action>
              <Action
                fixed
                href={`${iframeViewer}`}
                secondary
                target="_blank"
              >
                Open your story
              </Action>
            </Actionbar>
          </Container>
        );
      }
      return null;
    };
    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={this.props.isOpen} // TODO
        key="PublishStoryModal"
        onRequestClose={this.props.handleClose}
        role="dialog"
      >
        <Modal {...this.props} wizard>
          <ModalHead>
            <PageTitle typo="h1">Publish Story</PageTitle>
            <Separator size="s" silent />
            <Breadcrumbs count={4}>
              <Breadcrumb
                onClick={step >= 0 ? () => this.setState({ step: 0 }) : null}
                state={getStepState(step, 0)}
              >
                Review basic info
              </Breadcrumb>
              <Breadcrumb
                onClick={step >= 1 ? () => this.setState({ step: 1 }) : null}
                state={getStepState(step, 1)}
              >
                Review context
              </Breadcrumb>
              <Breadcrumb
                onClick={step >= 2 ? () => this.setState({ step: 2 }) : null}
                state={getStepState(step, 2)}
              >
                Add closing poll
              </Breadcrumb>
              <Breadcrumb
                onClick={step >= 3 ? () => this.setState({ step: 3 }) : null}
                state={getStepState(step, 3)}
              >
                Share your story
              </Breadcrumb>
            </Breadcrumbs>
          </ModalHead>
          <Separator size="s" silent />
          <ModalBody>{getModalBody()}</ModalBody>
        </Modal>
      </ReactModal>
    );
  }
}

PublishStoryModal.propTypes = {
  createInterviewee: func.isRequired,
  createStory: func.isRequired,
  deleteInterviewee: func.isRequired,
  handleClose: func.isRequired,
  isOpen: bool.isRequired,
  router: object.isRequired,
  stories: arrayOf(object),
  storyIndex: number.isRequired,
  updateInterviewee: func.isRequired,
  updateStory: func.isRequired,
  story: object.isRequired,
  user: object.isRequired
};

PublishStoryModal.defaultProps = {
  stories: []
};
