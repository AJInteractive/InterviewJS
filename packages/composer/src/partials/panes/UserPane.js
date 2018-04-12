import { func, number, string } from "prop-types";
import css from "styled-components";
import React from "react";

import {
  Action,
  Checkbox,
  Container,
  Icon,
  PageSubtitle,
  PaneTab,
  PaneTabs,
  Separator,
  TextInput,
  Tip,
  color,
  font,
  radius,
  setSpace,
  setType,
  time,
  Legend,
  FormItem,
} from "interviewjs-styleguide";

import PaneFrame from "./PaneFrame";

import { GLOBALS, USER_ACTIONS } from "../../options";

const PaneEl = css(Container)`
  height: 100%;
`;

const UserActions = css(Container)`
  ${setSpace("pbm")};
  height: 100%;
  position: relative;
  & > div {
    display: block;
    width: 100%;
    height: 50%;
  }
`;

const UserAction = css(Container)`
  align-items: stretch;
  border-radius: ${radius.l};
  border: 1px solid ${color.greyHL};
  box-shadow: 0 1px 3px ${color.shadowWt};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  & > div {
    border-radius: 0 ${radius.l} ${radius.l} 0;
  }
  & > div:last-child {
    border-left: 1px solid ${color.greyHL};
  }
  & label {
    align-content: center;
    align-items: center;
    bottom: 0;
    display: flex;
    flex-direction: row;
    font-weight: bold;
    justify-content: center;
    left: 0;
    padding: 0;
    position: absolute;
    top: 0;
    width: 140px;
    with: 100%;
    &:before {
      content: '';
      border-width: 1px 0 1px 1px;
      border-radius: ${radius.s} 0 0 ${radius.s};
      border-style: solid;
      border-color: ${color.greyHL};
      background: ${color.white};
      height: 48px;
      width: 30px;
      position: absolute;
      left: -31px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 0;
    }
  };
  & label > span {
    left: -19px;
  }
  ${PaneTabs} {
    width: 100%;
    position: relative;
    & li {
      display: inline-block;
    }
    & button {
      ${setSpace("phn")};
      ${setSpace("pvx")};
    }
  }
  ${PageSubtitle} {
    color: ${({ active }) => (active ? color.blueBlk : color.greyBlk)};
  }
`;

const ActionLibHolder = css(Container)`
  overflow-y: auto;
  width: 100%;
  height: 100%;
`;
const ActionLibList = css.ul`
  display: block;
  text-align: center;
`;
const ActionLibItem = css.li`
  ${setSpace("phs")};
  ${setSpace("mvx")};
`;
const ActionLibAction = css.button`
  ${setSpace("phs")};
  ${setSpace("pvx")};
  ${setType("x")};
  background: none;
  border-radius: ${radius.h};
  border: 1px solid transparent;
  box-shadow: none;
  color: ${color.greyBlk};
  display: inline-block;
  font-family: ${font.serif};
  transition: color ${time.m}, border ${time.m}, text-decoration ${time.m};
  &:focus {
    outline: none;
  }
  ${({ active, interactive }) =>
    interactive && active
      ? `
    border-color: ${color.blueBlk};
    color: ${color.blueBlk};
  `
      : ``}
  ${({ interactive }) =>
    interactive
      ? `
    cursor: pointer;
    &:hover {
      color: ${color.blueBlk};
    }
  `
      : ``}
`;

const CustomActionHolder = css(Container)`
  ${setSpace("phs")};
  width: 100%;
  input {
    ${setSpace("pvn")};
    ${setSpace("phx")};
    height: 34px;
  }
`;

const Draft = css.div`
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  width: 100%;
  & > * {
    ${setSpace("mhx")};
    max-width: 40%;
  }
`;

export default class UserPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enableContinue: false,
      enableExplore: false,

      customContinueVal: "",
      customExploreVal: "",

      continueLibDict: "text",
      continueLibItem: null,

      exploreLibDict: "text",
      exploreLibItem: null,

      exploreVal: "Omg why?",
      continueVal: "Carry on",
    };
    this.addStorylineItem = this.addStorylineItem.bind(this);
    this.customiseActionLabel = this.customiseActionLabel.bind(this);
    this.selectContinueAction = this.selectContinueAction.bind(this);
    this.selectExploreAction = this.selectExploreAction.bind(this);
    this.toggleAction = this.toggleAction.bind(this);
  }
  toggleAction(action, e) {
    // this.setState({ enableExplore: e.target.checked });
    const { enableExplore, enableIgnore } = this.state;
    if (!enableExplore && !enableIgnore) {
      this.setState({ enableContinue: true, enableExplore: e.target.checked });
    }
    this.setState({ enableExplore: e.target.checked });
  }
  customiseActionLabel(action, e) {
    const { value } = e.target;
    return action === "customExploreVal"
      ? this.setState({
          [action]: value,
          enableExplore: value.length > 0,
          enableContinue: !this.state.enableContinue ? value.length > 0 : true,
          exploreLibItem: null,
          exploreVal: value.length > 0 ? value : this.props.exploreVal,
        })
      : this.setState({
          [action]: value,
          enableContinue: value.length > 0,
          continueLibItem: null,
          continueVal: value.length > 0 ? value : this.props.continueVal,
        });
  }
  selectContinueAction(dict, i, e) {
    this.setState({
      continueLibDict: dict,
      continueLibItem: i,
      continueVal: e.target.innerHTML,
      customContinueVal: e.target.innerHTML,
      enableContinue: true,
    });
  }
  selectExploreAction(dict, i, e) {
    this.setState({
      customExploreVal: e.target.innerHTML,
      enableContinue: true,
      enableExplore: true,
      exploreLibDict: dict,
      exploreLibItem: i,
      exploreVal: e.target.innerHTML,
    });
  }
  addStorylineItem() {
    const { storyIndex, currentInterviewee } = this.props;
    const { enableContinue, enableExplore, continueVal, exploreVal } = this.state;
    const newUserBubble = {
      content: [
        {
          enabled: enableContinue,
          value: continueVal,
          type: enableExplore ? "ignore" : "explore",
        },
        { enabled: enableExplore, value: exploreVal, type: "explore" },
      ],
      role: "user",
    };
    this.props.addStorylineItem(storyIndex, currentInterviewee, newUserBubble);
    this.setState({
      customContinueVal: "",
      customExploreVal: "",
      enableContinue: false,
      enableExplore: false,
      continueLibItem: null,
      continueVal: this.props.continueVal,
      exploreLibItem: null,
      exploreVal: this.props.exploreVal,
    });

    this.props.showSavedIndicator();
  }
  render() {
    const { continueLibDict, continueVal, enableContinue, enableExplore, exploreLibDict, exploreVal } = this.state;
    return (
      <PaneEl fill="white" rounded shift dir="column">
        <PaneFrame
          {...this.props}
          active
          addStorylineItem={this.addStorylineItem}
          hasDraft={enableContinue || enableExplore}
          side="right"
          draft={
            <Draft>
              {enableContinue ? (
                <Action fixed primary={!enableExplore} secondary={!!enableExplore} theme={{ font: "PT sans" }}>
                  {continueVal}
                </Action>
              ) : null}
              {enableExplore ? (
                <Action fixed primary theme={{ font: "PT sans" }}>
                  {exploreVal}
                </Action>
              ) : null}
            </Draft>
          }
        >
          <UserActions>
            <Container className="jr-step5">
              <UserAction dir="row" active>
                <Container flex={[0, 0, "140px"]} align="center" dir="column">
                  <PageSubtitle typo="p4">
                    Create an interaction
                    <Tip
                      position="bottom"
                      title="Create user interactions that lead into your interview quote.  Select text options, type your own text or question, or choose a multimedia request via the tabs. It has to bein  the user’s voice."
                    >
                      <Icon
                        name="info2"
                        style={{
                          color: color.greyBlk,
                          marginLeft: "5px",
                          position: "relative",
                          top: "2px",
                        }}
                      />
                    </Tip>
                  </PageSubtitle>
                </Container>
                <Container flex={[2, 2, "auto"]} fill="grey" dir="column">
                  <CustomActionHolder flex={[0, 0, "50px"]} dir="column">
                    <FormItem fullWidth>
                      <TextInput
                        type="text"
                        placeholder="Type a comment or question here ..."
                        maxLength={GLOBALS.fixedButtonCharLimit}
                        value={this.state.customContinueVal}
                        onChange={e => this.customiseActionLabel("customContinueVal", e)}
                        style={{ paddingRight: "40px" }}
                      />
                      <Legend
                        tip="Type your own user interaction here - a comment or a question to lead into your the interview text in the preview panel."
                        style={{ top: "16px" }}
                      >
                        i
                      </Legend>
                    </FormItem>
                  </CustomActionHolder>
                  <Container flex={[1, 0, "auto"]} style={{ width: "100%" }}>
                    <PaneTabs>
                      <PaneTab
                        active={continueLibDict === "text"}
                        onClick={() => this.setState({ continueLibDict: "text" })}
                      >
                        <Icon name="text" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={continueLibDict === "link"}
                        onClick={() => this.setState({ continueLibDict: "link" })}
                      >
                        <Icon name="link" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={continueLibDict === "image"}
                        onClick={() => this.setState({ continueLibDict: "image" })}
                      >
                        <Icon name="image" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={continueLibDict === "embed"}
                        onClick={() => this.setState({ continueLibDict: "embed" })}
                      >
                        <Icon name="embed" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={continueLibDict === "map"}
                        onClick={() => this.setState({ continueLibDict: "map" })}
                      >
                        <Icon name="map" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={continueLibDict === "media"}
                        onClick={() => this.setState({ continueLibDict: "media" })}
                      >
                        <Icon name="media" size="x" />
                      </PaneTab>
                    </PaneTabs>
                  </Container>
                  <ActionLibHolder flex={[1, 1, "auto"]}>
                    <ActionLibList>
                      {USER_ACTIONS.continue[continueLibDict].map((action, i) => (
                        <ActionLibItem key={i}>
                          <ActionLibAction
                            interactive
                            active={i === this.state.continueLibItem}
                            onClick={e => this.selectContinueAction(continueLibDict, i, e)}
                          >
                            {action}
                          </ActionLibAction>
                        </ActionLibItem>
                      ))}
                    </ActionLibList>
                  </ActionLibHolder>
                </Container>
              </UserAction>
            </Container>
            <Separator silent size="s" />
            <Container className="jr-step6">
              <UserAction dir="row" active={enableExplore}>
                <Container flex={[0, 0, "140px"]} align="center" dir="column">
                  <Checkbox checked={enableExplore} onChange={e => this.toggleAction("enableExplore", e)}>
                    <PageSubtitle typo="p4">
                      Add Second Interaction
                      <Tip
                        position="bottom"
                        title="Select to add a second interaction. Together with the first question or user interaction it gives the user choice. Multimedia requests works well - explore all tabs!"
                      >
                        <Icon
                          name="info2"
                          style={{
                            color: color.greyBlk,
                            marginLeft: "5px",
                            position: "relative",
                            top: "2px",
                          }}
                        />
                      </Tip>
                    </PageSubtitle>
                  </Checkbox>
                </Container>
                <Container flex={[2, 2, "auto"]} fill="grey" dir="column">
                  <CustomActionHolder flex={[0, 0, "50px"]} dir="column">
                    <FormItem fullWidth>
                      <TextInput
                        type="text"
                        placeholder="Type your own text label…"
                        maxLength={GLOBALS.fixedButtonCharLimit}
                        value={this.state.customExploreVal}
                        onChange={e => this.customiseActionLabel("customExploreVal", e)}
                        style={{ paddingRight: "40px" }}
                      />
                      <Legend
                        tip="Use this box to script the second user interaction or question. It must be in the users voice!"
                        style={{ top: "16px" }}
                      >
                        i
                      </Legend>
                    </FormItem>
                  </CustomActionHolder>
                  <Container flex={[1, 0, "auto"]} style={{ width: "100%" }}>
                    <PaneTabs>
                      <PaneTab
                        active={exploreLibDict === "text"}
                        onClick={() => this.setState({ exploreLibDict: "text" })}
                      >
                        <Icon name="text" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={exploreLibDict === "link"}
                        onClick={() => this.setState({ exploreLibDict: "link" })}
                      >
                        <Icon name="link" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={exploreLibDict === "image"}
                        onClick={() => this.setState({ exploreLibDict: "image" })}
                      >
                        <Icon name="image" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={exploreLibDict === "embed"}
                        onClick={() => this.setState({ exploreLibDict: "embed" })}
                      >
                        <Icon name="embed" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={exploreLibDict === "map"}
                        onClick={() => this.setState({ exploreLibDict: "map" })}
                      >
                        <Icon name="map" size="x" />
                      </PaneTab>
                      <PaneTab
                        active={exploreLibDict === "media"}
                        onClick={() => this.setState({ exploreLibDict: "media" })}
                      >
                        <Icon name="media" size="x" />
                      </PaneTab>
                    </PaneTabs>
                  </Container>
                  <ActionLibHolder flex={[1, 1, "auto"]}>
                    <ActionLibList>
                      {USER_ACTIONS.explore[exploreLibDict].map((action, i) => (
                        <ActionLibItem key={i}>
                          <ActionLibAction
                            active={i === this.state.exploreLibItem}
                            interactive
                            onClick={e => this.selectExploreAction(exploreLibDict, i, e)}
                          >
                            {action}
                          </ActionLibAction>
                        </ActionLibItem>
                      ))}
                    </ActionLibList>
                  </ActionLibHolder>
                </Container>
              </UserAction>
            </Container>
          </UserActions>
        </PaneFrame>
      </PaneEl>
    );
  }
}

UserPane.propTypes = {
  addStorylineItem: func.isRequired,
  showSavedIndicator: func.isRequired,
  currentInterviewee: number.isRequired,
  continueVal: string,
  exploreVal: string,
  storyIndex: number.isRequired /* eslint react/forbid-prop-types: 0 */,
};

UserPane.defaultProps = {
  exploreVal: "Omg why?",
  continueVal: "Carry on",
};
