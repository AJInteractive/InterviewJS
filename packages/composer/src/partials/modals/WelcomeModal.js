import React from "react";
import ReactModal from "react-modal";
import { bool, func } from "prop-types";

import {
  Action,
  Actionbar,
  Container,
  Modal,
  Image,
  ModalBody,
  ModalFoot,
  ModalHead,
  PageSubtitle,
  PageTitle,
  Separator,
  PageParagraph
} from "interviewjs-styleguide";

import WelcomeImage from "../../assets/welcome-image.png";

export default class WelcomeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}
        role="dialog"
      >
        <Modal {...this.props} wizard>
          <ModalHead>
            <PageTitle typo="h1">Welcome to InterviewJS</PageTitle>
          </ModalHead>
          <ModalBody>
            <Container align="center" limit="m">
              <PageSubtitle typo="h3">
                InterviewJS users will engage with your story through a
                series of direct messaging exchanges based on your interviews.
                It’s a web app - there’s no need to download anything -
                users will simply need to be online!
              </PageSubtitle>
              <Separator size="m" silent />
              <Container align="center" limit="s">
                <Image src={WelcomeImage} alt="" />
              </Container>
            </Container>
          </ModalBody>
          <ModalFoot>
            <Container align="center" limit="m">
              <PageParagraph typo="p3">
              Users will interact with your story through a series of direct 
              messaging exchanges based on your interviews. It’s a web app -
              there’s no need to download anything - so users will need to be 
              online!
              </PageParagraph>
              <Separator size="m" silent />
              <Actionbar>
                <Action fixed primary onClick={this.props.handleClose}>
                  Create your first story
                </Action>
              </Actionbar>
            </Container>
          </ModalFoot>
        </Modal>
      </ReactModal>
    );
  }
}

WelcomeModal.propTypes = {
  handleClose: func.isRequired,
  isOpen: bool.isRequired
};

WelcomeModal.defaultProps = {};
