/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */

import css from "styled-components";
import React from "react";
import ReactModal from "react-modal";
import { bool, func } from "prop-types";

import {
  Action,
  Actionbar,
  Container,
  Icon,
  Modal,
  ModalBody,
  ModalFoot,
  ModalHead,
  LogoWSymbol,
  PageSubtitle,
  PageTitle,
  Separator,
  color,
  font,
  setSpace,
  setType,
  setHeight,
} from "interviewjs-styleguide";

// import { ErrorBoundary } from "../";

const DetailsCopy = css.div`
  ${setType("s")};
  text-align: left;
  font-family: ${font.serif};
  h2 {
    ${setType("m")};
    color: ${color.blueBlk};
    text-align: center;
  }
  h3 {
    ${setType("s")};
    font-weight: bold;
  }
  p {
    ${setSpace("mbm")};
    ${setType("s")};
  }
  dl {

  }
  dt {
    display: block;
    color: ${color.blueBlk};
  }
  dd {
    ${setSpace("mbm")};
    display: block;
  }
  a {
    text-decoration: underline;
  }
`;

const Brandmark = css.div`
  line-height: 0;
  img {
    ${setHeight("l")}
  }
`;

export default class AboutModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 7 };
  }

  getCount() {
    if (this.state.counter < 3) throw new Error("Test Error");
    return this.state.counter;
  }

  countDown() {
    this.setState({
      counter: this.state.counter - 1,
    });
  }

  render() {
    return (
      <ReactModal ariaHideApp={false} isOpen={this.props.isOpen} onRequestClose={this.props.handleClose} role="dialog">
        <Modal {...this.props}>
          <ModalHead>
            {/* <ErrorBoundary>
              <PageTitle typo="h1"><span title={this.getCount()} onClick={() => this.countDown()}>About</span> <span title={`version ${process.env.VERSION.replace('-dirty', '')}`}>InterviewJS</span></PageTitle>
            </ErrorBoundary> */}
            <PageTitle>
              <Brandmark>
                <img src={LogoWSymbol} alt="InterviewJS" />
              </Brandmark>
            </PageTitle>
          </ModalHead>
          <ModalBody>
            <Container align="center" limit="m">
              <DetailsCopy>
                <p>
                  Turn interview transcripts to shareable and embeddable interactive chats—InterviewJS is an open-source
                  Google DNI & Al Jazeera-backed app for journalists and newsrooms that allows to compose and manage
                  scripted chats for a more immersive storytelling experience.
                </p>
                <PageSubtitle typo="h2">Connect with InterviewJS</PageSubtitle>
                <Separator silent size="s" />
                <p>
                  InterviewJS is an open-source software happily accepting stars, forks and PRs on Github and followers
                  on Twitter:
                </p>
              </DetailsCopy>
              <Separator silent size="m" />
              <Actionbar>
                <Action href="https://github.com/AJInteractive/InterviewJS" target="_blank" secondary fixed>
                  <Icon name="github" /> Github
                </Action>
                <Action href="https://twitter.com/interview_js" target="_blank" secondary fixed>
                  <Icon name="twitter" /> Twitter
                </Action>
              </Actionbar>
            </Container>
          </ModalBody>
          <ModalFoot>
            <Actionbar>
              <Action fixed primary onClick={this.props.handleClose}>
                Close
              </Action>
            </Actionbar>
          </ModalFoot>
        </Modal>
      </ReactModal>
    );
  }
}

AboutModal.propTypes = {
  handleClose: func.isRequired,
  isOpen: bool.isRequired,
};

AboutModal.defaultProps = {};
