import * as actionTypes from '../../constants/actionTypes';

const storeGrazingSchedules = (state, action) => {
  const { grazingSchedules } = action.payload.entities;

  return {
    ...state,
    ...grazingSchedules,
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

const grazingSchedulesReducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.STORE_PLAN:
      return storeGrazingSchedules(state, action);
    case actionTypes.ADD_GRAZING_SCHEDULE:
      return addSchedule(state, action);
    case actionTypes.UPDATE_GRAZING_SCHEDULE:
      return updateSchedule(state, action);
    case actionTypes.DELETE_GRAZING_SCHEDULE:
      return deleteSchedule(state, action);
    default:
      return state;
  }
};

export default grazingSchedulesReducer;
