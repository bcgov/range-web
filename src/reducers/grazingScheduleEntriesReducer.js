import { STORE_PLAN, ADD_GRAZING_SCHEDULE_ENTRY, UPDATE_GRAZING_SCHEDULE_ENTRY, DELETE_GRAZING_SCHEDULE_ENTRY } from '../constants/actionTypes';

const storeGrazingScheduleEntries = (state, action) => {
  const { grazingScheduleEntries } = action.payload.entities;

  return {
    byId: {
      ...state.byId,
      ...grazingScheduleEntries,
    },
  };
};

const addGrazingScheduleEntry = (state, action) => {
  const { grazingScheduleEntry } = action.payload;

  return {
    byId: {
      ...state.byId,
      [grazingScheduleEntry.id]: grazingScheduleEntry,
    },
  };
};

const updateGrazingScheduleEntry = (state, action) => {
  const { grazingScheduleEntry } = action.payload;

  return {
    byId: {
      ...state.byId,
      [grazingScheduleEntry.id]: grazingScheduleEntry,
    },
  };
};

const deleteGrazingScheduleEntry = (state, action) => {
  const { grazingScheduleEntryId } = action.payload;
  const byId = { ...state.byId };
  delete byId[grazingScheduleEntryId];

  return {
    byId,
  };
};

const grazingScheduleEntriesReducer = (state = {
  byId: {},
}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeGrazingScheduleEntries(state, action);
    case ADD_GRAZING_SCHEDULE_ENTRY:
      return addGrazingScheduleEntry(state, action);
    case UPDATE_GRAZING_SCHEDULE_ENTRY:
      return updateGrazingScheduleEntry(state, action);
    case DELETE_GRAZING_SCHEDULE_ENTRY:
      return deleteGrazingScheduleEntry(state, action);
    default:
      return state;
  }
};

export default grazingScheduleEntriesReducer;
