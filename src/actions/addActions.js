import * as actionTypes from '../constants/actionTypes';

export const addGrazingSchedule = payload => (
  {
    type: actionTypes.ADD_GRAZING_SCHEDULE,
    payload,
  }
);

export const addGrazingScheduleEntry = payload => (
  {
    type: actionTypes.ADD_GRAZING_SCHEDULE_ENTRY,
    payload,
  }
);
