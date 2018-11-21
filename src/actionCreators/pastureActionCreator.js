import * as API from '../constants/api';
import { axios, createConfigWithHeader } from '../utils';

export const createRUPPasture = (planId, pasture) => (dispatch, getState) => {
  const { id, ...data } = pasture;

  return axios.post(
    API.CREATE_RUP_PASTURE(planId),
    data,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      const newPasture = response.data;
      const { oldId } = pasture;

      // this is when creating amendment to keep track of the old ids
      if (oldId) {
        return { ...newPasture, oldId };
      }
      return newPasture;
    },
    (err) => {
      throw err;
    },
  );
};

export const createRUPPlantCommunityAction = (planId, pastureId, communityId, action) => (
  dispatch, getState,
) => {
  const { id, plantCommunityId, ...data } = action;

  return axios.post(
    API.CREATE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId),
    data,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      throw err;
    },
  );
};

export const createRUPIndicatorPlant = (planId, pastureId, communityId, plant) => (
  dispatch, getState,
) => {
  const { id, plantCommunityId, ...data } = plant;

  return axios.post(
    API.CREATE_RUP_INDICATOR_PLANT(planId, pastureId, communityId),
    data,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      throw err;
    },
  );
};

export const createRUPMonitoringArea = (planId, pastureId, communityId, area) => (
  dispatch, getState,
) => {
  const { id, plantCommunityId, purposes, ...data } = area;

  return axios.post(
    API.CREATE_RUP_MONITERING_AREA(planId, pastureId, communityId),
    data,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      throw err;
    },
  );
};

export const createRUPPlantCommunityAndOthers = (planId, pastureId, community) => (dispatch, getState) => {
  const makeRequest = async () => {
    try {
      const { id, pastureId: pId, ...data } = community;

      const { data: newPlantCommunity } = await axios.post(
        API.CREATE_RUP_PLANT_COMMUNITY(planId, pastureId),
        data,
        createConfigWithHeader(getState),
      );

      const newPcas = await Promise.all(community.plantCommunityActions
        .map(pca => dispatch(createRUPPlantCommunityAction(planId, pastureId, newPlantCommunity.id, pca))));
      const newIps = await Promise.all(community.indicatorPlants
        .map(ip => dispatch(createRUPIndicatorPlant(planId, pastureId, newPlantCommunity.id, ip))));
      const newMas = await Promise.all(community.monitoringAreas
        .map(ma => dispatch(createRUPMonitoringArea(planId, pastureId, newPlantCommunity.id, ma))));

      return {
        ...newPlantCommunity,
        plantCommunityActions: newPcas,
        indicatorPlants: newIps,
        monitoringAreas: newMas,
      };
    } catch (err) {
      throw err;
    }
  };

  return makeRequest();
};
