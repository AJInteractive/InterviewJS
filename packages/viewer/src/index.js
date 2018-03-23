import React from "react";
import { Provider } from "react-redux";
import { render } from "react-dom";
import { Route, Router, IndexRoute, Redirect } from "react-router";

import { configureStore, history } from "./configureStore";

import App from "./App";
import Chat from "./views/Chat";
import Context from "./views/Context";
import Interviewees from "./views/Interviewees";
import Intro from "./views/Intro";
import Listing from "./views/Listing";
import Outro from "./views/Outro";
import Poll from "./views/Poll";
import Results from "./views/Results";

const store = configureStore();

require("./injectGlobalStyles.js");

const rootEl = document.getElementById("root");

class Routes extends React.Component {
  /*
    set `shouldComponentUpdate` to false to make hot loading work as discussed here:
    https://github.com/reactjs/react-router-redux/issues/179#issuecomment-281437927
  */
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Router
        onUpdate={() => window.scrollTo(0, 0)}
        key="Root"
        history={history}
      >
        <Route path="/story" component={App}>
          <IndexRoute component={Intro} />
          <Route path="/story/chat/:chatId" component={Chat} />
          <Route path="/story/context" component={Context} />
          <Route path="/story/interviewees" component={Interviewees} />
          <Route path="/story/listing" component={Listing} />
          <Route path="/story/outro" component={Outro} />
          <Route path="/story/poll" component={Poll} />
          <Route path="/story/results" component={Results} />
        </Route>
        <Redirect from="*" to="story" />
      </Router>
    );
  }
}

const router = (
  <Provider store={store}>
    <Routes />
  </Provider>
);

render(router, rootEl);

if (module.hot) {
  module.hot.accept(App, () => {
    render(router, rootEl);
  });
}
