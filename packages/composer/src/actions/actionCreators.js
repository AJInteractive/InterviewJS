/* eslint no-await-in-loop: 0 */
/* eslint no-plusplus: 0 */

import Raven from "raven-js";
import { Storage } from "aws-amplify";
import axios from "axios";
import shortUuid from "short-uuid";

const uuidv4 = () => shortUuid().fromUUID(shortUuid.uuid());

export function createStory({
  uid = "anonymous",
  author = "",
  authorLink = "",
  context = "",
  cover = null,
  logo = null,
  interviewees = [
    {
      avatar: "",
      bio: "",
      color: "",
      id: `iv_${uuidv4()}`,
      name: "Name of interviewee",
      srcText: "",
      storyline: [],
      title: ""
    }
  ],
  intro = "",
  poll = [],
  pubDate = "",
  title = ""
}) {
  return {
    type: "CREATE_STORY",
    payload: {
      author,
      authorLink,
      context,
      cover,
      interviewees,
      intro,
      logo,
      poll,
      pubDate,
      title,
      uid,
      id: uuidv4(),
      modDate: new Date()
    }
  };
}

export function updateStory(payload, storyIndex) {
  return {
    type: "UPDATE_STORY",
    storyIndex,
    payload
  };
}

export function syncStory(payload) {
  return {
    type: "SYNC_STORY",
    payload
  };
}

export function syncAndSaveStory(payload) {
  return {
    type: "SYNC_AND_SAVE_STORY",
    payload
  };
}

export function deleteStory(storyIndex) {
  return {
    type: "DELETE_STORY",
    storyIndex
  };
}

export function createInterviewee(storyIndex, payload) {
  return {
    type: "CREATE_INTERVIEWEE",
    storyIndex,
    payload: {
      ...payload,
      id: `iv_${uuidv4()}`,
      storyline: []
    }
  };
}

export function updateInterviewee(storyIndex, intervieweeIndex, payload) {
  return {
    type: "UPDATE_INTERVIEWEE",
    intervieweeIndex,
    payload,
    storyIndex
  };
}

export function deleteInterviewee(storyIndex, intervieweeIndex) {
  return {
    type: "DELETE_INTERVIEWEE",
    intervieweeIndex,
    storyIndex
  };
}

export function addStorylineItem(storyIndex, intervieweeIndex, payload) {
  return {
    type: "ADD_STORYLINE_ITEM",
    id: `sl_${uuidv4()}`,
    intervieweeIndex,
    order: 0,
    payload,
    storyIndex
  };
}

export function updateStorylineItem(
  storyIndex,
  intervieweeIndex,
  storylineItemIndex,
  payload
) {
  return {
    type: "UPDATE_STORYLINE_ITEM",
    intervieweeIndex,
    payload,
    storyIndex,
    storylineItemIndex
  };
}

export function moveStorylineItem(storyIndex, intervieweeIndex, payload) {
  return {
    type: "MOVE_STORYLINE_ITEM",
    intervieweeIndex,
    payload,
    storyIndex
  };
}

export function deleteStorylineItem(
  storyIndex,
  intervieweeIndex,
  storyItemIndex
) {
  return {
    type: "DELETE_STORYLINE_ITEM",
    intervieweeIndex,
    storyItemIndex,
    storyIndex
  };
}

export function signInUser(payload) {
  return {
    type: "SIGNIN_USER",
    payload
  };
}

export function signOutUser() {
  return {
    type: "SIGNOUT_USER"
  };
}

export function noop() {
  return {
    type: "NOOP"
  };
}

export function syncRemoteStories() {
  return (dispatch) => {
    dispatch(noop());

    Storage.list('stories/', {
      bucket: "data.interviewjs.io",
      level: "private",
    })
      .then(async stories => {
        // console.log("AWS", stories);
        stories.forEach(({key}) => {
          Storage.get(key, {
            bucket: "data.interviewjs.io",
            level: "private"
          })
            .then(url => {
              axios.get(url)
                .then(response => {
                  // console.log('AWS', response.data);
                  if (response.data.ignore) {
                    dispatch(noop());
                  } else {
                    dispatch(syncStory(response.data));
                  }
                })
                .catch(error => Raven.captureException(error));
            })
            .catch(error => Raven.captureException(error));
        });
      })
    .catch(error => Raven.captureException(error));

    return {
      type: "NOOP"
    };
  };
}
