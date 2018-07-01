import { STORE_PLAN, ADD_GRAZING_SCHEDULE, ADD_GRAZING_SCHEDULE_ENTRY, UPDATE_GRAZING_SCHEDULE } from '../constants/actionTypes';

const storeGrazingSchedules = (state, action) => {
  const { grazingSchedules } = action.payload.entities;

  return {
    byId: {
      ...state.byId,
      ...grazingSchedules,
    },
  };
};

const addGrazingSchedule = (state, action) => {
  const grazingSchedule = action.payload;
  return {
    byId: {
      ...state.byId,
      [grazingSchedule.id]: grazingSchedule,
    },
  };
};

const updateGrazingSchedule = (state, action) => {
  const grazingSchedule = { ...action.payload };
  return {
    byId: {
      ...state.byId,
      [grazingSchedule.id]: grazingSchedule,
    },
  };
};

const addGrazingScheduleEntry = (state, action) => {
  const { grazingScheduleId, grazingScheduleEntry } = action.payload;
  const grazingSchedule = { ...state.byId[grazingScheduleId] };
  // add the new grazing schedule entry id
  grazingSchedule.grazingScheduleEntries = [
    ...grazingSchedule.grazingScheduleEntries || [],
    grazingScheduleEntry.id,
  ];
  return {
    byId: {
      ...state.byId,
      [grazingScheduleId]: grazingSchedule,
    },
  };
};

const grazingSchedulesReducer = (state = {
  byId: {},
}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeGrazingSchedules(state, action);
    case ADD_GRAZING_SCHEDULE:
      return addGrazingSchedule(state, action);
    case ADD_GRAZING_SCHEDULE_ENTRY:
      return addGrazingScheduleEntry(state, action);
    case UPDATE_GRAZING_SCHEDULE:
      return updateGrazingSchedule(state, action);
    default:
      return state;
  }
};

export default grazingSchedulesReducer;
