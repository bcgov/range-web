// import { STORE_PLAN, CONFIRMATION_UPDATED } from '../constants/actionTypes';

// const storeConfirmations = (state, action) => {
//   const { confirmations } = action.payload.entities;

//   return {
//     ...state,
//     ...confirmations,
//   };
// };

// const updateConfirmation = (state, action) => {
//   const { confirmation } = action.payload;

//   return {
//     ...state,
//     [confirmation.id]: confirmation,
//   };
// };

const planStatusHistoryReducer = (state = {}, action) => {
  switch (action.type) {
//     case STORE_PLAN:
//       return storeConfirmations(state, action);
//     case CONFIRMATION_UPDATED:
//       return updateConfirmation(state, action);
    default:
      return state;
  }
};

export default planStatusHistoryReducer;
