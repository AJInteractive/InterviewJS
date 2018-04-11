import React from "react";
import css from "styled-components";
import { arrayOf, oneOfType, node } from "prop-types";

import { Container, Text, color, setSpace } from "interviewjs-styleguide";
import { ErrorBoundary } from "../";

const StoriesListHead = css(Container)`
  ${setSpace("mhh")};
  ${setSpace("phm")};
  ${setSpace("pbm")};
  color: ${color.greyM};
`;
const StoriesList = css.ol`
  display: block;
  & > * {
    ${setSpace("mbm")};
  }
`;

const Stories = (props) => (
  <Container>
    <StoriesListHead dir="row">
      <Container flex={[1, 1, "60%"]}>
        <Text typo="p5" nowrap>
          Title
        </Text>
      </Container>
      <Container flex={[0, 0, "20%"]} align="center" hide="phone">
        <Text typo="p5" nowrap>
          Modified
        </Text>
      </Container>
      <Container flex={[0, 0, "20%"]} align="right">
        <Text typo="p5" nowrap>
          Interviewees
        </Text>
      </Container>
    </StoriesListHead>
    <ErrorBoundary>
      <StoriesList>{props.children}</StoriesList>
    </ErrorBoundary>
  </Container>
);

Stories.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired
};

Stories.defaultProps = {};

export default Stories;
