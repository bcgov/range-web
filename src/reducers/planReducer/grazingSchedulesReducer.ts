import * as actionTypes from '../../constants/actionTypes';
import { Schedule, EntityMap } from '../../types';

export type SchedulesState = EntityMap<Schedule>;

interface ScheduleAction {
  type: string;
  payload: {
    entities?: { schedules?: EntityMap<Schedule> };
    grazingSchedule?: Schedule;
    grazingScheduleId?: string | number;
  };
}

const storeSchedules = (state: SchedulesState, action: ScheduleAction): SchedulesState => {
  const schedules = action.payload.entities?.schedules ?? {};

  return {
    ...state,
    ...schedules,
  };
};

const addSchedule = (state: SchedulesState, action: ScheduleAction): SchedulesState => {
  const { grazingSchedule } = action.payload;

  return {
    ...state,
    [grazingSchedule!.id]: grazingSchedule!,
  };
};

const updateSchedule = (state: SchedulesState, action: ScheduleAction): SchedulesState => {
  const { grazingSchedule } = action.payload;

  return {
    ...state,
    [grazingSchedule!.id]: grazingSchedule!,
  };
};

const deleteSchedule = (state: SchedulesState, action: ScheduleAction): SchedulesState => {
  const { grazingScheduleId } = action.payload;
  const newState = { ...state };
  delete newState[grazingScheduleId!];

  return newState;
};

const schedulesReducer = (state: SchedulesState = {}, action: ScheduleAction): SchedulesState => {
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
