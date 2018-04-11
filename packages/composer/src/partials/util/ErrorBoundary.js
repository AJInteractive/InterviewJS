/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */

import React from "react";
import { arrayOf, oneOfType, node } from "prop-types";
import Raven from "raven-js";

// https://reactjs.org/docs/error-boundaries.html
// https://blog.sentry.io/2017/09/28/react-16-error-boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    Raven.captureException(error, { info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ErrorBoundary" onClick={() => Raven.lastEventId() && Raven.showReportDialog()}>
          <p>We’re sorry — something’s gone wrong.</p>
          <p>Our team has been notified, but click here fill out a report.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: oneOfType([arrayOf(node), node]).isRequired,
};

ErrorBoundary.defaultProps = {};

export default ErrorBoundary;
