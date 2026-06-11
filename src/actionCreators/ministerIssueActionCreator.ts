import uuid from 'uuid-v4';
import * as API from '../constants/api';
import { success, request, error } from '../actions';
import { axios, createConfigWithHeader } from '../utils';
import * as reducerTypes from '../constants/reducerTypes';
import type { AppThunk, AppDispatch } from '../configureStore';

export const createRUPMinisterIssueAction =
  (planId: string | number, issueId: string | number, action: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    return axios
      .post(API.CREATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId), action, createConfigWithHeader(getState))
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const createRUPMinisterIssueAndActions =
  (planId: string | number, issue: any): AppThunk<Promise<any>> =>
  (dispatch: AppDispatch, getState) => {
    dispatch(request(reducerTypes.CREATE_MINISTER_ISSUE_AND_ACTIONS));
    const makeRequest = async () => {
      try {
        const { data: newIssue } = await axios.post(
          API.CREATE_RUP_MINISTER_ISSUE(planId),
          issue,
          createConfigWithHeader(getState),
        );
        const newActions = await Promise.all(
          issue.ministerIssueActions.map((mia: any) => dispatch(createRUPMinisterIssueAction(planId, newIssue.id, mia))),
        );
        const newIssueWithNewActions = {
          ...newIssue,
          ministerIssueActions: newActions,
        };
        dispatch(success(reducerTypes.CREATE_MINISTER_ISSUE_AND_ACTIONS, newIssueWithNewActions));

        return newIssueWithNewActions;
      } catch (err) {
        dispatch(error(reducerTypes.CREATE_MINISTER_ISSUE_AND_ACTIONS, err));
        throw err;
      }
    };

    return makeRequest();
  };

export const updateRUPMinisterIssueAction =
  (planId: string | number, issueId: string | number, action: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    return axios
      .put(API.UPDATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, action.id), action, createConfigWithHeader(getState))
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const createOrUpdateRUPMinisterIssueActions =
  (planId: string | number, issueId: string | number, actions: any[]): AppThunk<Promise<any[]>> =>
  (dispatch: AppDispatch) => {
    const makeRequest = async () => {
      return await Promise.all(
        actions.map((action: any) => {
          if (uuid.isUUID(action.id)) {
            return dispatch(createRUPMinisterIssueAction(planId, issueId, action));
          }
          return dispatch(updateRUPMinisterIssueAction(planId, issueId, action));
        }),
      );
    };

    return makeRequest();
  };

export const updateRUPMinisterIssueAndActions =
  (planId: string | number, issue: any): AppThunk<Promise<any>> =>
  (dispatch: AppDispatch, getState) => {
    dispatch(request(reducerTypes.UPDATE_MINISTER_ISSUE_AND_ACTIONS));
    const makeRequest = async () => {
      try {
        const { data: updatedIssue } = await axios.put(
          API.UPDATE_RUP_MINISTER_ISSUE(planId, issue.id),
          issue,
          createConfigWithHeader(getState),
        );
        const createdOrUpdatedActions = await dispatch(
          createOrUpdateRUPMinisterIssueActions(planId, issue.id, issue.ministerIssueActions),
        );
        const updatedIssueWithCreatedOrUpdatedActions = {
          ...updatedIssue,
          ministerIssueActions: createdOrUpdatedActions,
        };
        dispatch(success(reducerTypes.UPDATE_MINISTER_ISSUE_AND_ACTIONS, updatedIssueWithCreatedOrUpdatedActions));

        return updatedIssueWithCreatedOrUpdatedActions;
      } catch (err) {
        dispatch(error(reducerTypes.UPDATE_MINISTER_ISSUE_AND_ACTIONS, err));
        throw err;
      }
    };

    return makeRequest();
  };

export const createOrUpdateRUPMinisterIssueAndActions =
  (planId: string | number, issue: any): AppThunk<Promise<any>> =>
  (dispatch: AppDispatch) => {
    if (uuid.isUUID(issue.id)) {
      return dispatch(createRUPMinisterIssueAndActions(planId, issue));
    }

    return dispatch(updateRUPMinisterIssueAndActions(planId, issue));
  };

export const deleteRUPMinisterIssue =
  (planId: string | number, issueId: string | number): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    return axios.delete(API.DELETE_RUP_MINISTER_ISSUE(planId, issueId), createConfigWithHeader(getState)).then(
      (response: any) => {
        return response.data;
      },
      (err: any) => {
        throw err;
      },
    );
  };

export const deleteRUPMinisterIssueAction =
  (planId: string | number, issueId: string | number, actionId: string | number): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(request(reducerTypes.DELETE_MINISTER_ISSUE_ACTION));
    return axios
      .delete(API.DELETE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, actionId), createConfigWithHeader(getState))
      .then(
        (response: any) => {
          dispatch(success(reducerTypes.DELETE_MINISTER_ISSUE_ACTION, response.data));
          return response.data;
        },
        (err: any) => {
          dispatch(error(reducerTypes.DELETE_MINISTER_ISSUE_ACTION, err));
          throw err;
        },
      );
  };
