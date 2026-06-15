import * as API from '../constants/api';
import { axios, createConfigWithHeader } from '../utils';
import { request, success, error, pastureUpdated, pastureSubmitted } from '../actions';
import { toastErrorMessage } from './toastActionCreator';
import { CREATE_PASTURE, UPDATE_PASTURE } from '../constants/reducerTypes';
import type { AppThunk, AppDispatch } from '../configureStore';

export const createRUPPasture =
  (planId: string | number, pasture: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(request(CREATE_PASTURE));

    const { id, ...values } = pasture;

    const makeRequest = async () => {
      try {
        const { data } = await axios.post(API.CREATE_RUP_PASTURE(planId), values, createConfigWithHeader(getState));
        dispatch(success(CREATE_PASTURE, data));
        dispatch(pastureSubmitted({ id, pasture: data }));
        return data;
      } catch (err) {
        dispatch(error(CREATE_PASTURE, err));
        dispatch(toastErrorMessage(err));
        throw err;
      }
    };

    return makeRequest();
  };

export const updateRUPPasture =
  (planId: string | number, pasture: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(request(UPDATE_PASTURE));

    const makeRequest = async () => {
      try {
        const { data } = await axios.put(
          API.UPDATE_RUP_PASTURE(planId, pasture.id),
          pasture,
          createConfigWithHeader(getState),
        );
        dispatch(success(UPDATE_PASTURE, data));
        dispatch(pastureUpdated({ pasture: data }));
        return data;
      } catch (err) {
        dispatch(error(UPDATE_PASTURE, err));
        dispatch(toastErrorMessage(err));
        throw err;
      }
    };

    return makeRequest();
  };

export const createOrUpdateRUPPasture =
  (planId: string | number, pasture: any): AppThunk<void> =>
  (dispatch: AppDispatch) => {
    const isEditing = Number.isInteger(pasture.id);

    if (isEditing) dispatch(updateRUPPasture(planId, pasture));
    else {
      dispatch(createRUPPasture(planId, pasture));
    }
  };

export const createRUPPlantCommunityAction =
  (
    planId: string | number,
    pastureId: string | number,
    communityId: string | number,
    action: any,
  ): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const { ...data } = action;

    return axios
      .post(
        API.CREATE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId),
        data,
        createConfigWithHeader(getState),
      )
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const createRUPIndicatorPlant =
  (
    planId: string | number,
    pastureId: string | number,
    communityId: string | number,
    plant: any,
  ): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const { ...data } = plant;

    return axios
      .post(API.CREATE_RUP_INDICATOR_PLANT(planId, pastureId, communityId), data, createConfigWithHeader(getState))
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const createRUPMonitoringArea =
  (
    planId: string | number,
    pastureId: string | number,
    communityId: string | number,
    area: any,
  ): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const { ...data } = area;

    return axios
      .post(API.CREATE_RUP_MONITERING_AREA(planId, pastureId, communityId), data, createConfigWithHeader(getState))
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const createRUPPlantCommunityAndOthers =
  (planId: string | number, pastureId: string | number, community: any): AppThunk<Promise<any>> =>
  (dispatch: AppDispatch, getState) => {
    const makeRequest = async () => {
      const { id, ...data } = community;
      let plantCommunity = community;

      if (!Number(id)) {
        const { data: newPlantCommunity } = await axios.post(
          API.CREATE_RUP_PLANT_COMMUNITY(planId, pastureId),
          data,
          createConfigWithHeader(getState),
        );
        plantCommunity = newPlantCommunity;
      }

      const newPcas = await Promise.all(
        community.plantCommunityActions.map((pca: any) =>
          dispatch(createRUPPlantCommunityAction(planId, pastureId, plantCommunity.id, pca)),
        ),
      );
      const newIps = await Promise.all(
        community.indicatorPlants.map((ip: any) => {
          if (!ip.id) {
            return dispatch(createRUPIndicatorPlant(planId, pastureId, plantCommunity.id, ip));
          }
          return Promise.resolve();
        }),
      );
      const newMas = await Promise.all(
        community.monitoringAreas.map((ma: any) =>
          dispatch(createRUPMonitoringArea(planId, pastureId, plantCommunity.id, ma)),
        ),
      );

      return {
        ...plantCommunity,
        plantCommunityActions: newPcas,
        indicatorPlants: newIps,
        monitoringAreas: newMas,
      };
    };

    return makeRequest();
  };
