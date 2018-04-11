/* eslint react/no-danger: 0 */
import { arrayOf, func, object, number } from "prop-types";
import css from "styled-components";
import React from "react";
import {Embed} from "../../"

import {
  Action,
  Bubble,
  BubbleBlock,
  Container,
  Icon,
  color,
  radius,
  setSpace,
  skin
} from "interviewjs-styleguide";

import { filterIframe } from "../../../util/IframeSanitizer";

const BubbleEdit = css.div`
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
  ${({ persona }) =>
    persona === "user"
      ? `
    left: 100%;
  `
      : `
    right: 100%;
  `}
`;

const UserButtons = css(Container)`
  justify-content: flex-end;
  align-items: flex-end;
  align-content: flex-end;
  width: 100%;
  & > * {
    ${setSpace("mlx")}
  }
`;
const StorylineEl = css.div`
  ${setSpace("phl")};
  ${setSpace("ptm")};
  bottom: 0;
  height: 100%;
  left: 0;
  overflow-y: auto;
  position: absolute;
  right: 0;
  top: 0;
  & > * {
    ${setSpace("mvm")};
  }
  & > * > *:first-child,
  & > * > *:first-child * {
    cursor: move !important;
  }
  & > *:first-child {
    ${setSpace("mtm")};
  }
  & > *:last-child {
    ${setSpace("mbl")};
  }
  & .BubblePlaceholder {
    background: ${color.greyWt};
    background: ${color.white};
    border-radius: ${radius.a};
    border: 1px dashed ${color.greyM};
    min-height: 40px;
  }
  & > *:hover {
    ${BubbleEdit} {
      display: block;
    }
  }
`;

const placeholder = document.createElement("div");
placeholder.className = "BubblePlaceholder";

export default class Storyline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dragEnd = this.dragEnd.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  componentDidMount() {
    setTimeout(() => this.scrollToBottom("instant"), 300);
  }
  componentDidUpdate(prevProps) {
    return prevProps.storyline.length < this.props.storyline.length
      ? setTimeout(this.scrollToBottom, 150)
      : null;
  }
  dragStart(e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", this.dragged);
  }
  dragEnd() {
    const { currentInterviewee, storyIndex } = this.props;
    const from = Number(this.dragged.dataset.id);
    let to = Number(this.over.dataset.id);
    if (from < to) to--;
    if (
      Number.isInteger(from) &&
      Number.isInteger(to) &&
      this.over.dataset.droppable !== undefined
    ) {
      this.dragged.style.display = "flex";
      this.dragged.parentNode.removeChild(placeholder);
      const payload = { from, to };
      this.props.moveStorylineItem(storyIndex, currentInterviewee, payload);
    }
    return null;
  }
  dragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragged.style.display = "none";
    if (e.target.className === "BubblePlaceholder") return;
    function findDroppableParent(el) {
      while ((el = el.parentElement) && !el.dataset.droppable);
      return el;
    }
    const droppableParent = findDroppableParent(e.target);
    if (droppableParent !== null) {
      this.over = droppableParent;
      droppableParent.parentNode.insertBefore(placeholder, droppableParent);
    }
  }
  scrollToBottom(behaviour) {
    return this.anchor
      ? this.anchor.scrollIntoView({
          behavior: behaviour || "smooth",
          block: "end",
          inline: "end"
        })
      : null;
  }
  render() {
    const { storyline } = this.props;
    const interviewee = this.props.story.interviewees[
      this.props.currentInterviewee
    ];
    const renderUserBubble = (data) => {
      const { content, role } = data;
      return (
        <Bubble 
          persona={role} 
          theme={{ backg: skin.speakerBackg, font:"PT sans" }} 
          plain
        >
          <UserButtons dir="row">
            {content[0].enabled ? (
              <Action
                primary={!content[1].enabled}
                secondary={!!content[1].enabled}
                theme={{font:"PT sans"}}
                fixed
              >
                {content[0].value}
              </Action>
            ) : null}
            {content[1].enabled ? (
              <Action 
                primary
                fixed
                theme={{font:"PT sans"}}
              >
                {content[1].value}
              </Action>
            ) : null}
          </UserButtons>
        </Bubble>
      );
    };
    const renderIntervieweeBubble = (data) => {
      const { content, type, role } = data;
      if (type === "text") {
        return (
          <Bubble
            displayType="plain"
            persona={role}
            theme={{ backg: interviewee.color, font:"PT sans" }}
          >
            {content.value}
          </Bubble>
        );
      } else if (type === "link") {
        return (
          <Bubble
            displayType="rich"
            persona={role}
            theme={{ backg: interviewee.color, font:"PT sans" }}
          >
            <Embed title={content.title} value={content.value} />
          </Bubble>
        );
      } else if (type === "image") {
        return (
          <Bubble
            displayType="rich"
            persona={role}
            theme={{ backg: interviewee.color, font:"PT sans" }}
          >
            <img src={content.value} alt="" />
            {content.title ? <p>{content.title}</p> : null}
          </Bubble>
        );
      } else if (type === "embed") {
        return (
          <Bubble
            persona={role}
            displayType="embed"
            theme={{ backg: interviewee.color, font:"PT sans" }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: filterIframe(content.value)
              }}
            />
          </Bubble>
        );
      } else if (type === "map") {
        return (
          <Bubble
            displayType="embed"
            persona={role}
            theme={{ backg: interviewee.color, font:"PT sans" }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: filterIframe(content.value)
              }}
            />
          </Bubble>
        );
      }
      return null;
    };

    return (
      <StorylineEl onDragOver={(e) => this.dragOver(e)}>
        {Object.keys(storyline).map((storyItem, i) => {
          const { role } = storyline[storyItem];
          const item = storyline[storyItem];
          return (
            <BubbleBlock
              data-droppable
              data-id={i}
              draggable
              key={storyItem}
              onDragEnd={(e) => this.dragEnd(e)}
              onDragStart={(e) => this.dragStart(e)}
            >
              {role === "user"
                ? renderUserBubble(item)
                : renderIntervieweeBubble(item)}
              <BubbleEdit persona={role}>
                {/* <Action iconic onClick={() => this.props.toggleBubbleEdit(i)}>
                  <Icon name="pen" size="x" />
                </Action> */}
                <Action
                  tone="negative"
                  iconic
                  onClick={() => this.props.deleteStorylineItem(i)}
                >
                  <Icon name="cross" size="x" />
                </Action>
              </BubbleEdit>
            </BubbleBlock>
          );
        })}
        <div
          ref={(el) => {
            this.anchor = el;
          }}
        />
      </StorylineEl>
    );
  }
}

Storyline.propTypes = {
  currentInterviewee: number.isRequired,
  deleteStorylineItem: func.isRequired,
  moveStorylineItem: func.isRequired,
  storyIndex: number.isRequired,
  storyline: arrayOf(object)
};

Storyline.defaultProps = {
  storyline: []
};
