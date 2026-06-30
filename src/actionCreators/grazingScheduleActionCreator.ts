import * as API from '../constants/api';
import { axios, createConfigWithHeader } from '../utils';
import type { AppThunk } from '../configureStore';

export const createRUPSchedule =
  (planId: string | number, schedule: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const makeRequest = async () => {
      const { data: newSchedule } = await axios.post(
        API.CREATE_RUP_SCHEDULE(planId),
        { ...schedule, plan_id: planId },
        createConfigWithHeader(getState),
      );

      return {
        ...newSchedule,
      };
    };
    return makeRequest();
  };
