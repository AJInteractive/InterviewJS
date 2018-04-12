// a reducer takes in two things:
// 1. action (info about what happened)
// 2. copy of current state

function stories(state = [], action) {
  const i = action.index ? action.index : -1;
  // console.log(state, action);

  switch (action.type) {
    case "INCREMENT_LIKES":
      return [
        ...state.slice(0, i), // before the one we’re updating
        { ...state[i], likes: state[i].likes + 1 },
        ...state.slice(i + 1), // after the one we’re updating
      ];

    case "SIGNIN_USER":
      // console.log("SIGNIN_USER", action, state);
      return action.payload;

    default:
      return state;
  }
}

export default stories;
