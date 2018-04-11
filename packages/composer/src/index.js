import React from "react";
import { Provider } from "react-redux";
import { render } from "react-dom";
import { Route, Router, IndexRoute, Redirect } from "react-router";
import ReactGA from "react-ga";
// import { withAuthenticator } from "aws-amplify-react";


import { configureStore, history } from "./configureStore";

import App from "./App";
import Auth from "./views/Auth";
import Composer from "./views/Composer";
import Listing from "./views/Listing";

const store = configureStore();

require("./injectGlobalStyles.js"); // meh

ReactGA.initialize("UA-1615344-7");
const pageView = () => ReactGA.pageview(document.location.pathname);

// const AppWithAuth = withAuthenticator(App, {
//   // includeGreetings: true
// });
// const federated = {
//   google_client_id: "106275763263-of8jnrgl86kvlgv62v1vfmkp7mu45v2u.apps.googleusercontent.com",
// };

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
      <Router key="Root" history={history} onUpdate={pageView}>
        <Route path="/" component={App}>
          <IndexRoute component={Auth} />
          <Route path="/stories" component={Listing} />
          <Route path="/stories/:storyId" component={Composer} />
        </Route>
        <Redirect from="*" to="/" />
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
