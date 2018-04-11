/* eslint func-names: 0 */

import Amplify from "aws-amplify";
import { createStore, compose, applyMiddleware } from "redux";
import { syncHistoryWithStore } from "react-router-redux";
import { browserHistory } from "react-router";
import thunkMiddleware from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import firebase from "firebase";
import Rebase from "re-base";

import Raven from "raven-js";
import createRavenMiddleware from "raven-for-redux";
import clone from "clone";

import rootReducer from "./reducers";
import awsmobile from "./aws-exports";

import stories from "./data/stories";

// AWS Mobile
Amplify.configure(awsmobile);

// Sentry.io
if (document.location.hostname !== "localhost") {
  Raven.config("https://796f1032b1c74f15aba70d91dfcd14c5@sentry.io/360335", {
    release: process.env.VERSION,
    autoBreadcrumbs: {
      xhr: false,
      console: false,
      dom: false,
    },
    maxBreadcrumbs: 32,
    sanitizeKeys: ['logo', 'cover', 'avatar'],
  }).install();
}

// FIREBASE
export const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAzBGoszKOt1C_T4GV84hUBpjkK08H57KY",
  authDomain: "interviewjs-6c14d.firebaseapp.com",
  databaseURL: "https://interviewjs-6c14d.firebaseio.com",
  projectId: "interviewjs-6c14d",
  storageBucket: "interviewjs-6c14d.appspot.com",
  messagingSenderId: "126484254752"
});


// RE-BASE
export const base = Rebase.createClass(firebaseApp.database());


// PERSIST
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["routing"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const defaultState = {
  stories: document.location.hostname === "localhost" ? stories : [],
  user: {}
};

const enhancers = compose(
  applyMiddleware(
    createRavenMiddleware(Raven, {
      stateTransformer: state => ({ stories: state.stories.map(({ id }) => ({ id })) }),
      actionTransformer: action => {
        const cloned = clone(action);
        if (cloned.payload && cloned.payload.content && cloned.payload.content.value && cloned.payload.content.value.length > 64) cloned.payload.content.value = cloned.payload.content.value.substring(64);
        if (cloned.payload && cloned.payload.avatar && cloned.payload.avatar.length > 64) cloned.payload.avatar = cloned.payload.avatar.substring(64);
        if (cloned.payload && cloned.payload.logo && cloned.payload.logo.length > 64) cloned.payload.logo = cloned.payload.logo.substring(64);
        if (cloned.payload && cloned.payload.cover && cloned.payload.cover.length > 64) cloned.payload.cover = cloned.payload.cover.substring(64);
        return cloned;
      },
    }),
    thunkMiddleware
  ),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f,
);


let store;
switch (document.location.hostname === "localhost" ? null : "persist") {
  case "persist":
    store = createStore(
      persistedReducer,
      defaultState,
      enhancers
    );
    break;
  default:
    store = createStore(
      rootReducer,
      defaultState,
      enhancers
    );
}

export const history = syncHistoryWithStore(browserHistory, store);
export const configureStore = () => {
  if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
      module.hot.accept("./reducers", () => {
        store.replaceReducer(
          rootReducer,
          defaultState,
          applyMiddleware(thunkMiddleware)
        );
      });
    }
  }
  return store;
};

export const persistor = persistStore(configureStore());
