/* eslint no-case-declarations: 0 */
/* eslint no-console: 0 */

function stories(state = [], action) {
  switch (action.type) {
    case "CREATE_STORY":
      console.log("creating a story");
      return [action.payload, ...state];
    case "UPDATE_STORY":
      console.log("updating a story");
      return [
        ...state.slice(0, action.i),
        { ...state[action.i], ...action.payload },
        ...state.slice(action.i + 1)
      ];
    case "DELETE_STORY":
      console.log("deleting a story");
      return [...state.slice(0, action.i), ...state.slice(action.i + 1)];
    case "CREATE_INTERVIEWEE":
      console.log("creating interviewee");
      console.log("storyIndex:", action.storyIndex);
      console.log("payload:", action.payload);
      return [
        ...state.slice(0, action.storyIndex),
        {
          ...state[action.storyIndex],
          interviewees: [
            action.payload,
            ...state[action.storyIndex].interviewees
          ]
        },
        ...state.slice(action.i + 1)
      ];
    case "UPDATE_INTERVIEWEE":
      console.log("updating interviewee");
      console.log("storyIndex:", action.storyIndex);
      console.log("i:", action.i);
      console.log("payload:", action.payload);
      const storyInterviewees = state[action.storyIndex].interviewees;
      return [
        ...state.slice(0, action.storyIndex),
        {
          ...state[action.storyIndex],
          interviewees: [
            ...storyInterviewees.slice(0, action.i),
            { ...storyInterviewees, ...action.payload },
            ...storyInterviewees.slice(action.i + 1)
          ]
        },
        ...state.slice(action.i + 1)
      ];
    case "DELETE_INTERVIEWEE":
      console.log("deleting interviewee");
      console.log("storyIndex:", action.storyIndex);
      console.log("i:", action.i);
      return state;
    default:
      return state;
  }
}

export default stories;
