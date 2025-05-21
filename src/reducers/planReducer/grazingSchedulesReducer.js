import * as actionTypes from '../../constants/actionTypes';

const storeSchedules = (state, action) => {
  const { schedules } = action.payload.entities;

  return {
    ...state,
    ...schedules,
  };
};

const addSchedule = (state, action) => {
  const { grazingSchedule } = action.payload;

  return {
    ...state,
    [grazingSchedule.id]: grazingSchedule,
  };
};

const updateSchedule = (state, action) => {
  const { grazingSchedule } = action.payload;

  return {
    ...state,
    [grazingSchedule.id]: grazingSchedule,
  };
};

const deleteSchedule = (state, action) => {
  const { grazingScheduleId } = action.payload;
  const newState = { ...state };
  delete newState[grazingScheduleId];

  return newState;
};

const schedulesReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.STORE_PLAN:
      return storeSchedules(state, action);
    case actionTypes.SCHEDULE_ADDED:
      return addSchedule(state, action);
    case actionTypes.SCHEDULE_UPDATED:
      return updateSchedule(state, action);
    case actionTypes.SCHEDULE_DELETED:
      return deleteSchedule(state, action);
    default:
      return state;
  }
};

export default schedulesReducer;
