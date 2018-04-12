import React from "react";
import css from "styled-components";
import { object } from "prop-types";

import { Action, Actionbar, Container, PageTitle, Separator, breakpoint } from "interviewjs-styleguide";

const MobileRedirectEl = css(Container)`
  align-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  ${breakpoint.desktop} {
    display: none;
  }
`;

const MobileRedirect = props => (
  <MobileRedirectEl key="Placeholder">
    <Container>
      <PageTitle typo="h2">
        The composer works exclusively on desktops. Make sure your browser window is expanded.
      </PageTitle>
      <Separator silent size="m" />
      <Actionbar>
        <Action primary fixed onClick={() => props.router.push(`/stories`)}>
          Return home
        </Action>
      </Actionbar>
    </Container>
  </MobileRedirectEl>
);

MobileRedirect.propTypes = {
  router: object.isRequired /* eslint react/forbid-prop-types: 0 */,
};

MobileRedirect.defaultProps = {};

export default MobileRedirect;
