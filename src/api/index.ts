// TODO: need to enable eslint and check what is causing plan creation issues
/* eslint-disable */
import uuid from 'uuid-v4';
import { axios, getAuthHeaderConfig, sequentialAsyncMap } from '../utils';
import * as API from '../constants/api';

export const createVersion = async (planId: string | number): Promise<void> => {
  await axios.post(API.CREATE_RUP_VERSION(planId), {}, getAuthHeaderConfig());
};

export const saveSchedules = (planId: string | number, schedules: any[], newPastures: any[]): any => {
  return sequentialAsyncMap(schedules, async (schedule: any) => {
    const scheduleEntries = schedule.scheduleEntries.map(
      ({ id: entryId, grazingScheduleId, haycuttingScheduleId, ...entry }: any) => ({
        ...entry,
        ...(!uuid.isUUID(entryId) && { id: entryId }),
        pastureId: newPastures.find((p: any) => p.oldId === entry.pastureId).id,
      }),
    );

    if (uuid.isUUID(schedule.id)) {
      const { data } = await axios.post(
        API.CREATE_RUP_SCHEDULE(planId),
        { ...schedule, scheduleEntries, plan_id: planId },
        getAuthHeaderConfig(),
      );

      return {
        ...schedule,
        id: data.id,
      };
    } else {
      await axios.put(
        API.UPDATE_RUP_SCHEDULE(planId, schedule.id),
        { ...schedule, scheduleEntries },
        getAuthHeaderConfig(),
      );

      return schedule;
    }
  });
};

export const saveInvasivePlantChecklist = async (
  planId: string | number,
  invasivePlantChecklist: any,
): Promise<any> => {
  if (invasivePlantChecklist && invasivePlantChecklist.id) {
    await axios.put(
      API.UPDATE_RUP_INVASIVE_PLANT_CHECKLIST(planId, invasivePlantChecklist.id),
      invasivePlantChecklist,
      getAuthHeaderConfig(),
    );

    return invasivePlantChecklist;
  } else {
    const { id, ...values } = invasivePlantChecklist;
    const { data } = await axios.post(API.CREATE_RUP_INVASIVE_PLANT_CHECKLIST(planId), values, getAuthHeaderConfig());

    return {
      ...invasivePlantChecklist,
      id: data.id,
    };
  }
};

export const saveAttachments = async (planId: string | number, attachments: any[]): Promise<any> => {
  return sequentialAsyncMap(attachments, async (attachment: any) => {
    if (uuid.isUUID(attachment.id)) {
      const { id, ...values } = attachment;
      const { data } = await axios.post(API.CREATE_RUP_ATTACHMENT(planId), values, getAuthHeaderConfig());

      return {
        ...attachment,
        id: data.id,
      };
    } else {
      await axios.put(API.UPDATE_RUP_ATTACHMENT(planId, attachment.id), attachment, getAuthHeaderConfig());

      return attachment;
    }
  });
};

export const saveManagementConsiderations = (planId: string | number, managementConsiderations: any[]): any => {
  return sequentialAsyncMap(managementConsiderations, async (consideration: any) => {
    if (uuid.isUUID(consideration.id)) {
      const { id, ...values } = consideration;
      const { data } = await axios.post(API.CREATE_RUP_MANAGEMENT_CONSIDERATION(planId), values, getAuthHeaderConfig());

      return {
        ...consideration,
        id: data.id,
      };
    } else {
      await axios.put(
        API.UPDATE_RUP_MANAGEMENT_CONSIDERATION(planId, consideration.id),
        consideration,
        getAuthHeaderConfig(),
      );

      return consideration;
    }
  });
};

export const saveAdditionalRequirements = (planId: string | number, additionalRequirements: any[]): any => {
  return sequentialAsyncMap(additionalRequirements, async (requirement: any) => {
    if (uuid.isUUID(requirement.id)) {
      const { id, ...values } = requirement;
      const { data } = await axios.post(API.CREATE_RUP_ADDITIONAL_REQUIREMENT(planId), values, getAuthHeaderConfig());

      return {
        ...requirement,
        id: data.id,
      };
    } else {
      await axios.put(
        API.UPDATE_RUP_ADDITIONAL_REQUIREMENT(planId, requirement.id),
        requirement,
        getAuthHeaderConfig(),
      );

      return requirement;
    }
  });
};

export const saveMinisterIssues = (planId: string | number, ministerIssues: any[], newPastures: any[]): any => {
  const pastureMap = newPastures.reduce(
    (map: any, p: any) => ({
      ...map,
      [p.oldId]: p.id,
    }),
    {},
  );

  return sequentialAsyncMap(ministerIssues, async (issue: any) => {
    const { id, ...issueBody } = issue;

    if (uuid.isUUID(issue.id)) {
      const { data: newIssue } = await axios.post(
        API.CREATE_RUP_MINISTER_ISSUE(planId),
        {
          ...issueBody,
          pastures: issueBody.pastures.map((p: any) => pastureMap[p]),
        },
        getAuthHeaderConfig(),
      );

      const newActions = await saveMinisterIssueActions(planId, newIssue.id, issue.ministerIssueActions);

      return {
        ...issue,
        ministerIssueActions: newActions,
        id: newIssue.id,
      };
    } else {
      await axios.put(
        API.UPDATE_RUP_MINISTER_ISSUE(planId, issue.id),
        {
          ...issueBody,
          pastures: issueBody.pastures.map((p: any) => pastureMap[p]),
        },
        getAuthHeaderConfig(),
      );

      const newActions = await saveMinisterIssueActions(planId, issue.id, issue.ministerIssueActions);

      return {
        ...issue,
        ministerIssueActions: newActions,
      };
    }
  });
};

const saveMinisterIssueActions = (planId: string | number, issueId: string | number, actions: any[]): any => {
  return sequentialAsyncMap(actions, async (action: any) => {
    const { id, ...actionBody } = action;
    if (uuid.isUUID(action.id)) {
      const { data } = await axios.post(
        API.CREATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId),
        actionBody,
        getAuthHeaderConfig(),
      );

      return {
        ...action,
        id: data.id,
      };
    } else {
      await axios.put(
        API.UPDATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, action.id),
        actionBody,
        getAuthHeaderConfig(),
      );

      return action;
    }
  });
};

export const savePastures = async (planId: string | number, pastures: any[]): Promise<any> => {
  // Sequentially save pastures to keep order
  return sequentialAsyncMap(pastures, async (pasture: any) => {
    if (Number(pasture.id)) {
      await axios.put(API.UPDATE_RUP_PASTURE(planId, pasture.id), pasture, getAuthHeaderConfig());

      return { ...pasture, oldId: pasture.id };
    } else {
      const { id, ...values } = pasture;
      const { data } = await axios.post(API.CREATE_RUP_PASTURE(planId), values, getAuthHeaderConfig());

      return {
        ...pasture,
        oldId: pasture.id,
        id: data.id,
      };
    }
  });
};

export const savePlantCommunities = async (
  planId: string | number,
  pastureId: string | number,
  plantCommunities: any[],
): Promise<any> => {
  // Sequentially save plant communities (to keep order)
  return sequentialAsyncMap(plantCommunities, async (plantCommunity: any) => {
    let { id: communityId, ...values } = plantCommunity;
    if (uuid.isUUID(communityId)) {
      communityId = (await axios.post(API.CREATE_RUP_PLANT_COMMUNITY(planId, pastureId), values, getAuthHeaderConfig()))
        .data.id;
    } else {
      await axios.put(API.UPDATE_RUP_PLANT_COMMUNITY(planId, pastureId, communityId), values, getAuthHeaderConfig());
    }

    await savePlantCommunityActions(planId, pastureId, communityId, plantCommunity.plantCommunityActions);
    await saveIndicatorPlants(planId, pastureId, communityId, plantCommunity.indicatorPlants);
    await saveMonitoringAreas(planId, pastureId, communityId, plantCommunity.monitoringAreas);
  });
};

const savePlantCommunityActions = (
  planId: string | number,
  pastureId: string | number,
  communityId: string | number,
  plantCommunityActions: any[],
): any => {
  return sequentialAsyncMap(plantCommunityActions, (action: any) => {
    let { id: actionId, ...values } = action;
    if (uuid.isUUID(actionId)) {
      return axios.post(
        API.CREATE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId),
        values,
        getAuthHeaderConfig(),
      );
    } else {
      return axios.put(
        API.UPDATE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId, actionId),
        values,
        getAuthHeaderConfig(),
      );
    }
  });
};

const saveIndicatorPlants = (
  planId: string | number,
  pastureId: string | number,
  communityId: string | number,
  indicatorPlants: any[],
): any => {
  return sequentialAsyncMap(indicatorPlants, (plant: any) => {
    let { id: plantId, ...values } = plant;
    if (uuid.isUUID(plantId)) {
      return axios.post(API.CREATE_RUP_INDICATOR_PLANT(planId, pastureId, communityId), values, getAuthHeaderConfig());
    } else {
      return axios.put(
        API.UPDATE_RUP_INDICATOR_PLANT(planId, pastureId, communityId, plantId),
        values,
        getAuthHeaderConfig(),
      );
    }
  });
};

const saveMonitoringAreas = (
  planId: string | number,
  pastureId: string | number,
  communityId: string | number,
  monitoringAreas: any[],
): any => {
  return sequentialAsyncMap(monitoringAreas, (area: any) => {
    let { id: areaId, ...values } = area;
    if (uuid.isUUID(areaId)) {
      return axios.post(API.CREATE_RUP_MONITERING_AREA(planId, pastureId, communityId), values, getAuthHeaderConfig());
    } else {
      return axios.put(
        API.UPDATE_RUP_MONITORING_AREA(planId, pastureId, communityId, areaId),
        values,
        getAuthHeaderConfig(),
      );
    }
  });
};

export * from './delete';
export * from './plan';
export * from './user';
export * from './upload';
export * from './emailtemplate';
