/* eslint no-case-declarations: 0 */
/* eslint no-console: 0 */
/* eslint prefer-destructuring: 0 */
/* eslint no-plusplus: 0 */
/* eslint no-param-reassign: 0 */

// import shortUuid from "short-uuid";
import Raven from 'raven-js';
import { Storage } from 'aws-amplify';

// const uuidv4 = () => shortUuid().fromUUID(shortUuid.uuid());

function stories(state = [], action) {
  const {
    type,
    storyIndex,
    payload,
    intervieweeIndex,
    storyItemIndex
  } = action;

  // console.log(action);

  switch (type) {
    case 'CREATE_STORY':
      console.log('creating a story');
      return [payload, ...state];

    case 'UPDATE_STORY':
      console.log('updating a story');
      return [
        ...state.slice(0, storyIndex),
        { ...state[storyIndex], ...payload },
        ...state.slice(storyIndex + 1)
      ];

    case 'DELETE_STORY':
      console.log('deleting a story');
      return [...state.slice(0, storyIndex), ...state.slice(storyIndex + 1)];

    case 'SYNC_STORY':
      console.log('sync/update a story');
      if (!payload.poll) payload.poll = [];
      const prevStory = state.find((story) => story.id === payload.id);
      if (!prevStory) return [payload, ...state];

      return state.map((story) => {
        if (story.id === payload.id && payload.version > story.version)
          return payload;
        return story;
      });

    case 'SYNC_AND_SAVE_STORY':
      console.log('sync/update a story');
      if (!payload.poll) payload.poll = [];
      // if (!payload.version) payload.version = 0;
      // payload.version++;
      payload.imported = true;
      payload.importedVersion = payload.version;

      const prevStory2 = state.find((story) => story.id === payload.id);
      if (!prevStory2) return [payload, ...state];

      return state.map((story) => {
        if (story.id === payload.id && payload.version > story.version)
          return payload;
        return story;
      });

    case 'CREATE_INTERVIEWEE':
      console.log('creating interviewee');
      return [
        ...state.slice(0, storyIndex),
        {
          ...state[storyIndex],
          interviewees: [...state[storyIndex].interviewees, payload]
        },
        ...state.slice(storyIndex + 1)
      ];

    case 'UPDATE_INTERVIEWEE':
      console.log('updating interviewee');
      const updateStoryInterviewees = state[storyIndex].interviewees;
      return [
        ...state.slice(0, storyIndex),
        {
          ...state[storyIndex],
          interviewees: [
            ...updateStoryInterviewees.slice(0, intervieweeIndex),
            { ...updateStoryInterviewees[intervieweeIndex], ...payload },
            ...updateStoryInterviewees.slice(intervieweeIndex + 1)
          ]
        },
        ...state.slice(storyIndex + 1)
      ];

    case 'DELETE_INTERVIEWEE':
      console.log('deleting interviewee');
      const deleteStoryInterviewees = state[storyIndex].interviewees;
      return [
        ...state.slice(0, storyIndex),
        {
          ...state[storyIndex],
          interviewees: [
            ...deleteStoryInterviewees.slice(0, intervieweeIndex),
            ...deleteStoryInterviewees.slice(intervieweeIndex + 1)
          ]
        },
        ...state.slice(storyIndex + 1)
      ];

    case 'ADD_STORYLINE_ITEM':
      console.log('adding storyline item');
      if (!state[storyIndex].interviewees[intervieweeIndex].storyline) {
        state[storyIndex].interviewees[intervieweeIndex].storyline = [];
      }
      const ADD_STORYLINE_ITEM_STATE = [
        ...state.slice(0, storyIndex),
        {
          ...state[storyIndex],
          interviewees: [
            ...state[storyIndex].interviewees.slice(0, intervieweeIndex),
            {
              ...state[storyIndex].interviewees[intervieweeIndex],
              storyline: [
                ...state[storyIndex].interviewees[intervieweeIndex].storyline,
                payload
              ]
            },
            ...state[storyIndex].interviewees.slice(intervieweeIndex + 1)
          ]
        },
        ...state.slice(storyIndex + 1)
      ];
      return ADD_STORYLINE_ITEM_STATE;

    case 'UPDATE_STORYLINE_ITEM':
      console.log('updating storyline item');
      if (!state[storyIndex].interviewees[intervieweeIndex].storyline) {
        state[storyIndex].interviewees[intervieweeIndex].storyline = [];
      }
      const UPDATE_STORYLINE_ITEM_STATE = [
        ...state.slice(0, storyIndex),
        {
          ...state[storyIndex],
          interviewees: [
            ...state[storyIndex].interviewees.slice(0, intervieweeIndex),
            {
              ...state[storyIndex].interviewees[intervieweeIndex],
              storyline: [
                ...state[storyIndex].interviewees[
                  intervieweeIndex
                ].storyline.slice(0, storyItemIndex),
                payload,
                ...state[storyIndex].interviewees[
                  intervieweeIndex
                ].storyline.slice(storyItemIndex + 1)
              ]
            },
            ...state[storyIndex].interviewees.slice(intervieweeIndex + 1)
          ]
        },
        ...state.slice(storyIndex + 1)
      ];
      return UPDATE_STORYLINE_ITEM_STATE;

    case 'MOVE_STORYLINE_ITEM':
      console.log('moving storyline item');
      const { to, from } = payload;
      const moveStorylineArr =
        state[storyIndex].interviewees[intervieweeIndex].storyline;
      const newArr = moveStorylineArr.slice();
      newArr.splice(to, 0, newArr.splice(from, 1)[0]);
      const MOVE_STORYLINE_ITEM_STATE = [
        ...state.slice(0, storyIndex),
        {
          ...state[storyIndex],
          interviewees: [
            ...state[storyIndex].interviewees.slice(0, intervieweeIndex),
            {
              ...state[storyIndex].interviewees[intervieweeIndex],
              storyline: newArr
            },
            ...state[storyIndex].interviewees.slice(intervieweeIndex + 1)
          ]
        },
        ...state.slice(storyIndex + 1)
      ];
      return MOVE_STORYLINE_ITEM_STATE;

    case 'DELETE_STORYLINE_ITEM':
      console.log('deleting storyline item');
      const deleteStorylineArr =
        state[storyIndex].interviewees[intervieweeIndex].storyline;
      const DELETE_STORYLINE_ITEM_STATE = [
        ...state.slice(0, storyIndex),
        {
          ...state[storyIndex],
          interviewees: [
            ...state[storyIndex].interviewees.slice(0, intervieweeIndex),
            {
              ...state[storyIndex].interviewees[intervieweeIndex],
              storyline: [
                ...deleteStorylineArr.slice(0, storyItemIndex),
                ...deleteStorylineArr.slice(storyItemIndex + 1)
              ]
            },
            ...state[storyIndex].interviewees.slice(intervieweeIndex + 1)
          ]
        },
        ...state.slice(storyIndex + 1)
      ];
      return DELETE_STORYLINE_ITEM_STATE;

    default:
      return state;
  }
}

function storiesWrapper(state = [], action) {
  const { type, storyIndex, payload } = action;

  console.log(action);
  const newState = stories(state, action);

  try {
    if (typeof storyIndex !== 'number') {
      console.log('no storyIndex');
      // return newState;
    }

    let storyId = null;

    if (typeof storyIndex === 'number' && state[storyIndex])
      storyId = state[storyIndex].id;
    if (type === 'CREATE_STORY') storyId = payload.id;
    if (type === 'SYNC_AND_SAVE_STORY') storyId = payload.id;

    if (!storyId) return newState; // storyId = `s0_tmp_${uuidv4()}`;

    let currentStory = newState.find((story) => story.id === storyId);
    if (type === 'DELETE_STORY')
      currentStory = state.find((story) => story.id === storyId);
    console.log(currentStory);

    if (!currentStory) return newState;
    if (currentStory.ignore) return newState;

    if (!currentStory.created) currentStory.created = new Date();
    currentStory.lastUpdated = new Date();
    if (!currentStory.version) currentStory.version = 0;
    currentStory.version++;

    if (type === 'SYNC_AND_SAVE_STORY') currentStory.version--;

    if (type === 'CREATE_STORY' || type === 'SYNC_AND_SAVE_STORY') {
      Storage.put(
        `stories/${storyId}/story.json`,
        JSON.stringify(currentStory),
        {
          bucket: 'data.interviewjs.io',
          level: 'private',
          contentType: 'application/json'
        }
      )
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    } else if (type === 'SYNC_STORY') {
      // NOOP;
    } else if (type === 'DELETE_STORY') {
      Storage.put(
        `stories-deleted/${storyId}/story.json`,
        JSON.stringify(currentStory),
        {
          bucket: 'data.interviewjs.io',
          level: 'private',
          contentType: 'application/json'
        }
      )
        .then((result) => {
          console.log(result);
          // now delete
          Storage.remove(`stories/${storyId}/story.json`, {
            bucket: 'data.interviewjs.io',
            level: 'private'
          })
            .then((result2) => console.log(result2))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      Storage.put(
        `stories/${storyId}/story.json`,
        JSON.stringify(currentStory),
        {
          bucket: 'data.interviewjs.io',
          level: 'private',
          contentType: 'application/json'
        }
      )
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
    }
  } catch (exception) {
    Raven.captureException(exception);
  }

  return newState;
}

export default storiesWrapper; // stories
