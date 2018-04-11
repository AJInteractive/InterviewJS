import css from "styled-components";
import React from "react";
import ReactModal from "react-modal";
import { bool, func } from "prop-types";
import { Auth } from "aws-amplify";

import {
  Action,
  Actionbar,
  Animator,
  Bubble,
  BubbleBlock,
  Container,
  FormItem,
  Label,
  LogoWSymbolNegative,
  Modal,
  ModalBody,
  ModalFoot,
  PaneTab,
  PaneTabs,
  Separator,
  Text,
  TextInput,
  color,
  setSpace,
} from "interviewjs-styleguide";

const Brandmark = css.div`
  ${setSpace("mbl")};
  line-height: 0;
  opacity: .8;
  text-align: center;
  img {
    height: 36px;
  }
`;

export default class AuthModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      code: "",
      newPassword: "",
      activeTab: "signIn",
      forgotPassword: false,
      message: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleConfirmSignUp = this.handleConfirmSignUp.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.handleConfirmForgotPassword = this.handleConfirmForgotPassword.bind(this);
    this.handleTabActivation = this.handleTabActivation.bind(this);
    this.toggleForgotPassword = this.toggleForgotPassword.bind(this);
  }

  async componentDidMount() {
    const info = await Auth.currentUserInfo();
    if (info) {
      this.props.handleAuthentication(info);
    }
  }

  toggleForgotPassword() {
    this.setState({ forgotPassword: true });
  }

  handleTabActivation(activeTab) {
    this.setState({ activeTab, forgotPassword: false });
  }

  handleInputChange({ target }) {
    this.clearMessage();
    const { value, name } = target;

    this.setState({
      [name]: value,
    });
  }

  raiseError(error) {
    console.log(error);
    this.setState({ message: error.message });
  }

  raiseMessage(message, data) {
    this.setState({ message });
    if (data) console.log(data);
  }

  clearMessage() {
    this.setState({ message: "" });
  }

  handleSignIn() {
    const { username, password } = this.state;

    Auth.signIn(username, password)
      .then(async user => {
        const info = await Auth.currentUserInfo();
        if (user && info) {
          this.raiseMessage("OK", info);
          this.props.handleAuthentication(info);
        }
      })
      .catch(error => this.raiseError(error));
  }

  handleSignUp() {
    const { username, password, email } = this.state;

    Auth.signUp({
      username,
      password,
      attributes: { email },
    })
      .then(data => this.raiseMessage("Check your email for access code", data))
      .catch(error => this.raiseError(error));
  }

  handleConfirmSignUp() {
    const { username, code } = this.state;

    Auth.confirmSignUp(username, code)
      .then(data => this.raiseMessage("Now please sign in", data))
      .catch(error => this.raiseError(error));
  }

  handleForgotPassword() {
    const { username } = this.state;

    Auth.forgotPassword(username)
      .then(data => this.raiseMessage("Check your email for access code", data))
      .catch(error => this.raiseError(error));
  }

  handleConfirmForgotPassword() {
    const { username, code, newPassword } = this.state;

    Auth.forgotPasswordSubmit(username, code, newPassword)
      .then(data => this.raiseMessage("Now please sign in", data))
      .catch(error => this.raiseError(error));
  }

  render() {
    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={this.props.isOpen}
        onRequestClose={this.props.handleClose}
        overlayClassName="ReactModal__HeroOverlay"
        role="dialog"
      >
        <Modal {...this.props} persistent transparent>
          <ModalBody>
            <Brandmark>
              <img src={LogoWSymbolNegative} alt="InterviewJS" />
            </Brandmark>
            <BubbleBlock>
              <Bubble animated persona="interviewee" theme={{ backg: color.flareLLt, color: color.white }}>
                Welcome!
              </Bubble>
              <Bubble animated delay={1000} persona="interviewee" theme={{ backg: color.flareLLt, color: color.white }}>
                InterviewJS will help you tell interactive stories by converting your interviews into a chat experience.
              </Bubble>
              <Bubble animated delay={2000} persona="interviewee" theme={{ backg: color.flareLLt, color: color.white }}>
                To continue, sign in with your Google account.
              </Bubble>
            </BubbleBlock>
          </ModalBody>
          <ModalFoot>
            <Animator delay={3000}>
              <Container rounded fill="white">
                <PaneTabs>
                  <PaneTab
                    opinionated
                    active={this.state.activeTab === "signIn"}
                    onClick={() => this.handleTabActivation("signIn")}
                  >
                    Sign In
                  </PaneTab>
                  <PaneTab
                    opinionated
                    active={this.state.activeTab === "signUp"}
                    onClick={() => this.handleTabActivation("signUp")}
                  >
                    Sign Up
                  </PaneTab>
                </PaneTabs>

                <Separator dir="h" size="s" silent />
                <Text typo="h3">{this.state.message ? this.state.message : "\xa0"}</Text>

                {!this.state.forgotPassword && this.state.activeTab === "signIn" ? (
                  <div style={{ padding: "1em" }}>
                    <FormItem>
                      <Label>Username</Label>
                      <TextInput
                        input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Password</Label>
                      <TextInput input type="password" name="password" onChange={this.handleInputChange} />
                    </FormItem>
                    <Separator dir="h" silent />
                    <Actionbar>
                      <Action fixed primary onClick={this.handleSignIn}>
                        Sign in
                      </Action>
                      <Action fixed onClick={this.toggleForgotPassword}>
                        Forgot password?
                      </Action>
                    </Actionbar>
                  </div>
                ) : null}

                {this.state.activeTab === "signUp" ? (
                  <div style={{ padding: "0em 1em 1em 1em" }}>
                    <Text typo="h5">Step 1</Text>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Username</Label>
                      <TextInput
                        input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Password</Label>
                      <TextInput
                        input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Email</Label>
                      <TextInput
                        input
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" silent />
                    <Actionbar>
                      <Action fixed primary onClick={this.handleSignUp}>
                        Sign up
                      </Action>
                    </Actionbar>
                    <Separator dir="h" silent />
                    <Text typo="h5">Step 2</Text>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Username</Label>
                      <TextInput
                        input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Confirmation code</Label>
                      <TextInput
                        input
                        type="text"
                        name="code"
                        value={this.state.code}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" silent />
                    <Actionbar>
                      <Action fixed primary onClick={this.handleConfirmSignUp}>
                        Confirm sign up
                      </Action>
                    </Actionbar>
                  </div>
                ) : null}

                {this.state.forgotPassword && this.state.activeTab === "signIn" ? (
                  <div style={{ padding: "0em 1em 1em 1em" }}>
                    <Text typo="h5">
                      Forgot Password<br /> Step 1
                    </Text>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Username</Label>
                      <TextInput
                        input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" silent />
                    <Actionbar>
                      <Action fixed primary onClick={this.handleForgotPassword}>
                        Forgot password
                      </Action>
                    </Actionbar>
                    <Separator dir="h" silent />
                    <Text typo="h4">Step 2</Text>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Username</Label>
                      <TextInput
                        input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>Confimation Code</Label>
                      <TextInput
                        input
                        type="text"
                        name="code"
                        value={this.state.code}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" size="s" silent />
                    <FormItem>
                      <Label>New password</Label>
                      <TextInput
                        input
                        type="password"
                        name="newPassword"
                        value={this.state.newPassword}
                        onChange={this.handleInputChange}
                      />
                    </FormItem>
                    <Separator dir="h" silent />
                    <Actionbar>
                      <Action fixed primary onClick={this.handleConfirmForgotPassword}>
                        Confirm forgot password
                      </Action>
                    </Actionbar>
                  </div>
                ) : null}

                <Separator dir="h" size="s" silent />
              </Container>
            </Animator>
          </ModalFoot>
        </Modal>
      </ReactModal>
    );
  }
}

AuthModal.propTypes = {
  handleAuthentication: func.isRequired,
  handleClose: func,
  isOpen: bool,
};

AuthModal.defaultProps = {
  handleClose: null,
  isOpen: true,
};

AuthModal.defaultProps = {};
