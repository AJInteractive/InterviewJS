/* eslint react/no-danger: 0 */
import { arrayOf, func, object, number } from 'prop-types';
import React from 'react';
import styled, { keyframes } from 'styled-components';

import {
  Action,
  Bubble,
  BubbleBlock,
  Container,
  Dropdown,
  DropdownContent,
  Icon,
  color,
  radius,
  setSpace,
  skin,
  time
} from 'interviewjs-styleguide';

import { filterIframe } from '../../../util/IframeSanitizer';

const animateEditableBubble = keyframes`
  0% {
    -webkit-transform: translate(0);
            transform: translate(0);
  }
  20% {
    -webkit-transform: translate(-2px, 2px);
            transform: translate(-2px, 2px);
  }
  40% {
    -webkit-transform: translate(-2px, -2px);
            transform: translate(-2px, -2px);
  }
  60% {
    -webkit-transform: translate(2px, 2px);
            transform: translate(2px, 2px);
  }
  80% {
    -webkit-transform: translate(2px, -2px);
            transform: translate(2px, -2px);
  }
  100% {
    -webkit-transform: translate(0);
            transform: translate(0);
  }
`;

const BubbleWrapper = styled.div`
  &,
  & * {
    cursor: ${({ draggable }) => (draggable ? `move` : `default`)};
  }
  position: relative;
  transition: opacity ${time.m};
  ${({ forceEdit }) =>
    forceEdit
      ? `
    & > * {
      visibility: visible !important;
    }
  `
      : ``};
  ${({ fadeOut }) => (fadeOut ? `opacity: 0.5` : ``)};

  ${({ editable }) =>
    editable
      ? `
  animation-delay: 0ms;
  animation-direction: normal;
  animation-duration: 0.75s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${animateEditableBubble};
  animation-play-state: running;
  animation-timing-function: linear;
  `
      : ``};
`;
const BubbleMove = styled.div`
  color: ${color.greyM};
  display: none;
  left: 100%;
  margin-left: 14px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
`;
const BubbleEdit = styled.div`
  align-content: center;
  align-items: center;
  bottom: -5px;
  display: flex;
  justify-content: flex-start;
  left: -38px;
  position: absolute;
  right: -38px;
  top: -5px;
  visibility: hidden;
  z-index: 50;
  & > * {
    ${setSpace('mhx')};
  }
`;
const UserButtons = styled(Container)`
  align-content: flex-end;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  & > * {
    ${setSpace('mlx')};
  }
`;
const StorylineEl = styled.div`
  ${setSpace('phl')};
  ${setSpace('ptm')};
  bottom: 0;
  height: 100%;
  left: 0;
  overflow-y: auto;
  position: absolute;
  right: 0;
  top: 0;
  & > * {
    ${setSpace('mvm')};
  }
  & > *:first-child {
    ${setSpace('mtm')};
  }
  & > *:last-child {
    ${setSpace('mbl')};
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
      visibility: visible;
    }
    ${BubbleMove} {
      display: block;
    }
  }
`;

const placeholder = document.createElement('div');
placeholder.className = 'BubblePlaceholder';

export default class Storyline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdown: null
    };
    this.dragEnd = this.dragEnd.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  componentDidMount() {
    setTimeout(() => this.scrollToBottom('instant'), 300);
  }
  componentDidUpdate(prevProps) {
    return prevProps.storyline.length < this.props.storyline.length
      ? setTimeout(this.scrollToBottom, 150)
      : null;
  }
  dragStart(e) {
    this.setState({ dropdown: null });
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.dragged);
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
      this.dragged.style.display = 'flex';
      this.dragged.parentNode.removeChild(placeholder);
      const payload = { from, to };
      this.props.moveStorylineItem(storyIndex, currentInterviewee, payload);
    }
    return null;
  }
  dragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.dragged.style.display = 'none';
    if (e.target.className === 'BubblePlaceholder') return;
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
  toggleDropdown(dropdown) {
    if (!dropdown) this.setState({ dropdown: null });
    this.setState({ dropdown });
    return null;
  }
  toggleEdit(i) {
    this.props.toggleBubbleEdit(i);
    this.toggleDropdown();
  }
  toggleDelete(i) {
    this.props.deleteStorylineItem(i);
    this.toggleDropdown();
  }
  scrollToBottom(behaviour) {
    return this.anchor
      ? this.anchor.scrollIntoView({
          behavior: behaviour || 'smooth',
          block: 'end',
          inline: 'end'
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
          plain
          theme={{ backg: skin.speakerBackg, font: 'PT sans' }}
        >
          <UserButtons dir="row">
            {content[0].enabled ? (
              <Action
                primary={!content[1].enabled}
                secondary={!!content[1].enabled}
                theme={{ font: 'PT sans' }}
                fixed
              >
                {content[0].value}
              </Action>
            ) : null}
            {content[1].enabled ? (
              <Action primary fixed theme={{ font: 'PT sans' }}>
                {content[1].value}
              </Action>
            ) : null}
          </UserButtons>
        </Bubble>
      );
    };
    const renderIntervieweeBubble = (data) => {
      const { content, type, role } = data;
      if (type === 'text') {
        return (
          <Bubble
            displayType="plain"
            persona={role}
            theme={{ backg: interviewee.color, font: 'PT sans' }}
          >
            {content.value}
          </Bubble>
        );
      } else if (type === 'link') {
        return (
          <Bubble
            displayType="plain"
            persona={role}
            theme={{ backg: interviewee.color, font: 'PT sans' }}
          >
            <a href={content.value} target="_blank">
              {content.title ? content.title : content.value}
            </a>
          </Bubble>
        );
      } else if (type === 'image') {
        return (
          <Bubble
            displayType="rich"
            persona={role}
            theme={{ backg: interviewee.color, font: 'PT sans' }}
          >
            <img src={content.value} alt="" />
            {content.title ? <p>{content.title}</p> : null}
          </Bubble>
        );
      } else if (type === 'embed') {
        return (
          <Bubble
            displayType="embed"
            persona={role}
            theme={{ backg: interviewee.color, font: 'PT sans' }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: filterIframe(content.value)
              }}
            />
          </Bubble>
        );
      } else if (type === 'map') {
        return (
          <Bubble
            displayType="embed"
            persona={role}
            theme={{ backg: interviewee.color, font: 'PT sans' }}
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
            <BubbleWrapper
              data-droppable
              data-id={i}
              draggable={this.props.currentBubble === null}
              editable={this.props.currentBubble === i}
              forceEdit={this.state.dropdown === i}
              key={storyItem}
              onDragEnd={(e) => this.dragEnd(e)}
              onDragStart={(e) => this.dragStart(e)}
              persona={role}
              fadeOut={
                this.props.currentBubble !== null &&
                this.props.currentBubble !== i
              }
            >
              <BubbleBlock>
                {role === 'user'
                  ? renderUserBubble(item)
                  : renderIntervieweeBubble(item)}
              </BubbleBlock>
              {this.props.currentBubble === null
                ? [
                    <BubbleEdit key="bubbleedit">
                      <Dropdown
                        onRequestClose={() => this.toggleDropdown()}
                        open={this.state.dropdown === i}
                        html={
                          <DropdownContent>
                            <ul>
                              {role === 'user' ? (
                                <li>
                                  <Action onClick={() => this.toggleEdit(i)}>
                                    Edit bubble
                                  </Action>
                                </li>
                              ) : null}
                              <li>
                                <Action
                                  tone="negative"
                                  onClick={() => this.toggleDelete(i)}
                                >
                                  Delete bubble
                                </Action>
                              </li>
                            </ul>
                          </DropdownContent>
                        }
                      >
                        <Action iconic onClick={() => this.toggleDropdown(i)}>
                          <Icon name="hdots" size="s" />
                        </Action>
                      </Dropdown>
                    </BubbleEdit>,
                    <BubbleMove key="bubblemove">
                      <Icon name="reorder" size="s" />
                    </BubbleMove>
                  ]
                : null}
            </BubbleWrapper>
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
  currentBubble: number,
  currentInterviewee: number.isRequired,
  deleteStorylineItem: func.isRequired,
  moveStorylineItem: func.isRequired,
  storyIndex: number.isRequired,
  storyline: arrayOf(object),
  toggleBubbleEdit: func.isRequired
};

Storyline.defaultProps = {
  currentBubble: null,
  storyline: []
};
