import uuid from 'uuid-v4';
import * as API from '../constants/api';
import { success, request, error } from '../actions';
import { axios, createConfigWithHeader } from '../utils';
import * as reducerTypes from '../constants/reducerTypes';

export const createRUPMinisterIssueAction = (planId, issueId, action) => (dispatch, getState) => {
  return axios.post(
    API.CREATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId),
    action,
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

export const createRUPMinisterIssueAndActions = (planId, issue) => (dispatch, getState) => {
  dispatch(request(reducerTypes.CREATE_RUP_MINISTER_ISSUE_AND_ACTIONS));
  const makeRequest = async () => {
    try {
      const { data: newIssue } = await axios.post(
        API.CREATE_RUP_MINISTER_ISSUE(planId),
        issue,
        createConfigWithHeader(getState),
      );
      const newActions = await Promise.all(issue.ministerIssueActions
        .map(mia => dispatch(createRUPMinisterIssueAction(planId, newIssue.id, mia))));
      const newIssueWithNewActions = {
        ...newIssue,
        ministerIssueActions: newActions,
      };
      dispatch(success(reducerTypes.CREATE_RUP_MINISTER_ISSUE_AND_ACTIONS, newIssueWithNewActions));

      return newIssueWithNewActions;
    } catch (err) {
      dispatch(error(reducerTypes.CREATE_RUP_MINISTER_ISSUE_AND_ACTIONS));
      throw err;
    }
  };

  return makeRequest();
};

export const updateRUPMinisterIssueAction = (planId, issueId, action) => (dispatch, getState) => {
  return axios.post(
    API.UPDATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, action.id),
    action,
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

export const createOrUpdateRUPMinisterIssueActions = (planId, issueId, actions) => (dispatch) => {
  const makeRequest = async () => {
    try {
      return await Promise.all(actions.map((action) => {
        if (uuid.isUUID(action.id)) {
          return dispatch(createRUPMinisterIssueAction(planId, issueId, action));
        }
        return dispatch(updateRUPMinisterIssueAction(planId, issueId, action));
      }));
    } catch (err) {
      throw err;
    }
  };

  return makeRequest();
};

export const updateRUPMinisterIssueAndActions = (planId, issue) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_RUP_MINISTER_ISSUE_AND_ACTIONS));
  const makeRequest = async () => {
    try {
      const { data: updatedIssue } = axios.put(
        API.UPDATE_RUP_MINISTER_ISSUE(planId, issue.id),
        issue,
        createConfigWithHeader(getState),
      );
      const createdOrUpdatedActions = await dispatch(createOrUpdateRUPMinisterIssueActions(planId, issue.id, issue.ministerIssueActions));
      const updatedIssueWithCreatedOrUpdatedActions = {
        ...updatedIssue,
        ministerIssueActions: createdOrUpdatedActions,
      };
      dispatch(success(reducerTypes.UPDATE_RUP_MINISTER_ISSUE_AND_ACTIONS, updatedIssueWithCreatedOrUpdatedActions));

      return updatedIssueWithCreatedOrUpdatedActions;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_RUP_MINISTER_ISSUE_AND_ACTIONS));
      throw err;
    }
  };

  return makeRequest();
};

export const createOrUpdateRUPMinisterIssueAndActions = (planId, issue) => (dispatch) => {
  if (uuid.isUUID(issue.id)) {
    return dispatch(createRUPMinisterIssueAndActions(planId, issue));
  }

  return dispatch(updateRUPMinisterIssueAndActions(planId, issue));
};

export const deleteRUPMinisterIssue = (planId, issueId) => (dispatch, getState) => {
  return axios.delete(
    API.DELETE_RUP_MINISTER_ISSUE(planId, issueId),
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

export const deleteRUPMinisterIssueAction = (planId, issueId, actionId) => (dispatch, getState) => {
  return axios.delete(
    API.DELETE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, actionId),
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
