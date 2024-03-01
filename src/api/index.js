import uuid from 'uuid-v4';
import { axios, getAuthHeaderConfig, sequentialAsyncMap } from '../utils';
import * as API from '../constants/api';

export const createVersion = async (planId) => {
  await axios.post(API.CREATE_RUP_VERSION(planId), {}, getAuthHeaderConfig());
};

export const saveGrazingSchedules = (planId, grazingSchedules, newPastures) => {
  return sequentialAsyncMap(grazingSchedules, async (schedule) => {
    const grazingScheduleEntries = schedule.grazingScheduleEntries.map(
      ({ id: entryId, ...entry }) => ({
        ...entry,
        ...(!uuid.isUUID(entryId) && { id: entryId }),
        pastureId: newPastures.find((p) => p.oldId === entry.pastureId).id,
      }),
    );
    const { ...grazingSchedule } = schedule;

    if (uuid.isUUID(schedule.id)) {
      const { data } = await axios.post(
        API.CREATE_RUP_GRAZING_SCHEDULE(planId),
        { ...grazingSchedule, grazingScheduleEntries, plan_id: planId },
        getAuthHeaderConfig(),
      );

      return {
        ...grazingSchedule,
        id: data.id,
      };
    } else {
      await axios.put(
        API.UPDATE_RUP_GRAZING_SCHEDULE(planId, schedule.id),
        { ...grazingSchedule, grazingScheduleEntries },
        getAuthHeaderConfig(),
      );

      return schedule;
    }
  });
};

export const saveInvasivePlantChecklist = async (
  planId,
  invasivePlantChecklist,
) => {
  if (invasivePlantChecklist && invasivePlantChecklist.id) {
    await axios.put(
      API.UPDATE_RUP_INVASIVE_PLANT_CHECKLIST(
        planId,
        invasivePlantChecklist.id,
      ),
      invasivePlantChecklist,
      getAuthHeaderConfig(),
    );

    return invasivePlantChecklist;
  } else {
    const { ...values } = invasivePlantChecklist;
    const { data } = await axios.post(
      API.CREATE_RUP_INVASIVE_PLANT_CHECKLIST(planId),
      values,
      getAuthHeaderConfig(),
    );

    return {
      ...invasivePlantChecklist,
      id: data.id,
    };
  }
};

export const saveAttachments = async (planId, attachments) => {
  return sequentialAsyncMap(attachments, async (attachment) => {
    if (uuid.isUUID(attachment.id)) {
      const { ...values } = attachment;
      const { data } = await axios.post(
        API.CREATE_RUP_ATTACHMENT(planId),
        values,
        getAuthHeaderConfig(),
      );

      return {
        ...attachment,
        id: data.id,
      };
    } else {
      await axios.put(
        API.UPDATE_RUP_ATTACHMENT(planId, attachment.id),
        attachment,
        getAuthHeaderConfig(),
      );

      return attachment;
    }
  });
};

export const saveManagementConsiderations = (
  planId,
  managementConsiderations,
) => {
  return sequentialAsyncMap(managementConsiderations, async (consideration) => {
    if (uuid.isUUID(consideration.id)) {
      const { ...values } = consideration;
      const { data } = await axios.post(
        API.CREATE_RUP_MANAGEMENT_CONSIDERATION(planId),
        values,
        getAuthHeaderConfig(),
      );

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

export const saveAdditionalRequirements = (planId, additionalRequirements) => {
  return sequentialAsyncMap(additionalRequirements, async (requirement) => {
    if (uuid.isUUID(requirement.id)) {
      const { ...values } = requirement;
      const { data } = await axios.post(
        API.CREATE_RUP_ADDITIONAL_REQUIREMENT(planId),
        values,
        getAuthHeaderConfig(),
      );

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

export const saveMinisterIssues = (planId, ministerIssues, newPastures) => {
  const pastureMap = newPastures.reduce(
    (map, p) => ({
      ...map,
      [p.oldId]: p.id,
    }),
    {},
  );

  return sequentialAsyncMap(ministerIssues, async (issue) => {
    const { ...issueBody } = issue;

    if (uuid.isUUID(issue.id)) {
      const { data: newIssue } = await axios.post(
        API.CREATE_RUP_MINISTER_ISSUE(planId),
        {
          ...issueBody,
          pastures: issueBody.pastures.map((p) => pastureMap[p]),
        },
        getAuthHeaderConfig(),
      );

      const newActions = await saveMinisterIssueActions(
        planId,
        newIssue.id,
        issue.ministerIssueActions,
      );

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
          pastures: issueBody.pastures.map((p) => pastureMap[p]),
        },
        getAuthHeaderConfig(),
      );

      const newActions = await saveMinisterIssueActions(
        planId,
        issue.id,
        issue.ministerIssueActions,
      );

      return {
        ...issue,
        ministerIssueActions: newActions,
      };
    }
  });
};

const saveMinisterIssueActions = (planId, issueId, actions) => {
  return sequentialAsyncMap(actions, async (action) => {
    const { ...actionBody } = action;
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

export const savePastures = async (planId, pastures) => {
  // Sequentially save pastures to keep order
  return sequentialAsyncMap(pastures, async (pasture) => {
    if (Number.isInteger(pasture.id)) {
      await axios.put(
        API.UPDATE_RUP_PASTURE(planId, pasture.id),
        pasture,
        getAuthHeaderConfig(),
      );

      return { ...pasture, oldId: pasture.id };
    } else {
      const { ...values } = pasture;
      const { data } = await axios.post(
        API.CREATE_RUP_PASTURE(planId),
        values,
        getAuthHeaderConfig(),
      );

      return {
        ...pasture,
        oldId: pasture.id,
        id: data.id,
      };
    }
  });
};

export const savePlantCommunities = async (
  planId,
  pastureId,
  plantCommunities,
) => {
  // Sequentially save plant communities (to keep order)
  return sequentialAsyncMap(
    plantCommunities,
    async (plantCommunity) => {
      let { id: communityId, ...values } = plantCommunity;
      if (uuid.isUUID(communityId)) {
        communityId = (
          await axios.post(
            API.CREATE_RUP_PLANT_COMMUNITY(planId, pastureId),
            values,
            getAuthHeaderConfig(),
          )
        ).data.id;
      } else {
        await axios.put(
          API.UPDATE_RUP_PLANT_COMMUNITY(planId, pastureId, communityId),
          values,
          getAuthHeaderConfig(),
        );
      }

      await savePlantCommunityActions(
        planId,
        pastureId,
        communityId,
        plantCommunity.plantCommunityActions,
      );
      await saveIndicatorPlants(
        planId,
        pastureId,
        communityId,
        plantCommunity.indicatorPlants,
      );
      await saveMonitoringAreas(
        planId,
        pastureId,
        communityId,
        plantCommunity.monitoringAreas,
      );
    },
    Promise.resolve(),
  );
};

const savePlantCommunityActions = (
  planId,
  pastureId,
  communityId,
  plantCommunityActions,
) => {
  return sequentialAsyncMap(plantCommunityActions, (action) => {
    let { id: actionId, ...values } = action;
    if (uuid.isUUID(actionId)) {
      return axios.post(
        API.CREATE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId),
        values,
        getAuthHeaderConfig(),
      );
    } else {
      return axios.put(
        API.UPDATE_RUP_PLANT_COMMUNITY_ACTION(
          planId,
          pastureId,
          communityId,
          actionId,
        ),
        values,
        getAuthHeaderConfig(),
      );
    }
  });
};

const saveIndicatorPlants = (
  planId,
  pastureId,
  communityId,
  indicatorPlants,
) => {
  return sequentialAsyncMap(indicatorPlants, (plant) => {
    let { id: plantId, ...values } = plant;
    if (uuid.isUUID(plantId)) {
      return axios.post(
        API.CREATE_RUP_INDICATOR_PLANT(planId, pastureId, communityId),
        values,
        getAuthHeaderConfig(),
      );
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
  planId,
  pastureId,
  communityId,
  monitoringAreas,
) => {
  return sequentialAsyncMap(monitoringAreas, (area) => {
    let { id: areaId, ...values } = area;
    if (uuid.isUUID(areaId)) {
      return axios.post(
        API.CREATE_RUP_MONITERING_AREA(planId, pastureId, communityId),
        values,
        getAuthHeaderConfig(),
      );
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
