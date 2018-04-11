import React from 'react';
import css from 'styled-components';
import { array, bool, func, node, oneOfType, string } from 'prop-types';

import {
  Action,
  Container,
  Icon,
  Separator,
  color,
  font,
  radius,
  setSpace,
  setType
} from 'interviewjs-styleguide';

import ShapeLeft from '../../assets/ShapeAttachedLeft.svg';
import ShapeRight from '../../assets/ShapeAttachedRight.svg';

const Frame = css(Container)`
  display: ${({ active }) => (active ? 'flex' : 'none')};
  height: 100%;
  position: relative;
  width: 100%;
  & > div {
    width: 100%;
    height: 100%;
  }
`;

const DraftHolder = css(Container)`
  ${setSpace('pam')}
  height: 100%;
`;

const Draft = css(Container)`
  ${setSpace('pas')};
  ${setType('x')};
  border-radius: ${radius.l};
  border: 1px solid ${color.greyHL};
  bottom: 0;
  box-shadow: 0 1px 3px ${color.shadowWt};
  color: ${color.blueBlk};
  font-family: ${font.serif};
  height: 100%;
  left: 0;
  line-height: 0;
  overflow-x: auto;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
`;

const SubmitButton = css.span`
  background-position: left center;
  background-size: cover;
  display: block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  & > button {
    height: 45px;
    line-height: 45px;
    width: 45px;
  }
  ${({ side }) =>
    side === 'left'
      ? `
    background-image: url(${ShapeLeft});
    padding: 11px 11px 11px 7px;
    left: 100%;
    margin-left: -2px;
  `
      : `
    background-image: url(${ShapeRight});
    padding: 11px 7px 11px 11px;
    right: 100%;
    margin-right: -2px;
  `}

`;

const PaneFrame = (props) => {
  const { hasDraft } = props;
  return (
    <Frame {...props} dir="column" padded>
      <Container flex={[1, 1, `auto`]}>{props.children}</Container>
      <Separator silent size="s" />
      <Container flex={[0, 0, `180px`]}>
        <DraftHolder>
          <Draft fill="grey">{props.draft}</Draft>
          <SubmitButton side={props.side}>
            {props.editMode ? (
              <Action
                disabled={!hasDraft}
                iconic
                onClick={hasDraft ? props.updateStorylineItem : null}
                primary
                tone="positive"
              >
                <Icon name="checkmark" size="l" />
              </Action>
            ) : (
              <Action
                disabled={!hasDraft}
                iconic
                onClick={hasDraft ? props.addStorylineItem : null}
                primary
                tone="positive"
              >
                <Icon name="plus" size="l" />
              </Action>
            )}
          </SubmitButton>
        </DraftHolder>
      </Container>
    </Frame>
  );
};

PaneFrame.propTypes = {
  addStorylineItem: func.isRequired,
  updateStorylineItem: func.isRequired,
  children: oneOfType([array, string, node]).isRequired,
  draft: oneOfType([array, string, node]),
  editMode: bool,
  hasDraft: bool,
  side: string
};

PaneFrame.defaultProps = {
  draft: null,
  editMode: false,
  hasDraft: false,
  side: 'left'
};

export default PaneFrame;
