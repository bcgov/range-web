import * as API from '../constants/api';
import { getAuthHeaderConfig, axios } from '../utils';

const saveDeleteQueue = (deleteQueue) => {
  localStorage.setItem('delete-queue', JSON.stringify(deleteQueue));
};

const loadDeleteQueue = () => {
  return JSON.parse(localStorage.getItem('delete-queue'));
};

const loadOrInitDeleteQueue = () => {
  const queue = loadDeleteQueue();
  if (!queue) {
    saveDeleteQueue({});
    return {};
  }
  return queue;
};

const deleteHandlers = {};

const addDeleteHandler = (key, handler) => {
  deleteHandlers[key] = handler;
};

export const deleteFromQueue = async () => {
  const deleteQueue = loadOrInitDeleteQueue();

  const deletePromises = Object.entries(deleteQueue).map(async ([key, queue]) => {
    const handler = deleteHandlers[key];

    return Promise.all(queue.map((args) => handler(...args)));
  });

  await deletePromises;
};

export const createDeleteHandler = (key, cb) => {
  const handler = async (...args) => {
    const deleteQueue = loadOrInitDeleteQueue();

    if (!Array.isArray(deleteQueue[key])) {
      deleteQueue[key] = [];
    }

    deleteQueue[key] = deleteQueue[key].filter((queuedArgs) => queuedArgs !== args);

    try {
      await cb(...args);
    } catch (e) {
      deleteQueue[key].push(args);
    }

    saveDeleteQueue(deleteQueue);
  };

  addDeleteHandler(key, handler);

  return handler;
};

export const deleteMinisterIssueAction = createDeleteHandler(
  'ministerIssueAction',
  async (planId, issueId, actionId) => {
    await axios.delete(API.DELETE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, actionId), getAuthHeaderConfig());
  },
);

export const deletePasture = createDeleteHandler('pasture', async (planId, pastureId) => {
  await axios.delete(API.DELETE_RUP_PASTURE(planId, pastureId), getAuthHeaderConfig());
});

export const deletePlantCommunity = createDeleteHandler('plantCommunity', async (planId, pastureId, communityId) => {
  await axios.delete(API.DELETE_RUP_PLANT_COMMUNITY(planId, pastureId, communityId), getAuthHeaderConfig());
});

export const deleteMinisterIssue = createDeleteHandler('ministerIssue', async (planId, issueId) => {
  await axios.delete(API.DELETE_RUP_MINISTER_ISSUE(planId, issueId), getAuthHeaderConfig());
});

export const deleteMonitoringArea = createDeleteHandler(
  'monitoringArea',
  async (planId, pastureId, communityId, areaId) => {
    await axios.delete(API.DELETE_RUP_MONITORING_AREA(planId, pastureId, communityId, areaId), getAuthHeaderConfig());
  },
);

export const deletePlantCommunityAction = createDeleteHandler(
  'plantCommunityAction',
  async (planId, pastureId, communityId, actionId) => {
    await axios.delete(
      API.DELETE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId, actionId),
      getAuthHeaderConfig(),
    );
  },
);

export const deleteAdditionalRequirement = createDeleteHandler(
  'additionalRequirement',
  async (planId, requirementId) => {
    await axios.delete(API.DELETE_RUP_ADDITIONAL_REQUIREMENT(planId, requirementId), getAuthHeaderConfig());
  },
);

export const deleteManagementConsideration = createDeleteHandler(
  'managementConsideration',
  async (planId, considerationId) => {
    await axios.delete(API.DELETE_RUP_MANAGEMENT_CONSIDERATION(planId, considerationId), getAuthHeaderConfig());
  },
);

export const deleteSchedule = createDeleteHandler('schedule', async (planId, scheduleId) => {
  await axios.delete(API.DELETE_RUP_SCHEDULE(planId, scheduleId), getAuthHeaderConfig());
});

export const deleteScheduleEntry = createDeleteHandler('scheduleEntry', async (planId, scheduleId, entryId) => {
  await axios.delete(API.DELETE_RUP_SCHEDULE_ENTRY(planId, scheduleId, entryId), getAuthHeaderConfig());
});

export const deleteIndicatorPlant = createDeleteHandler(
  'indicatorPlant',
  async (planId, pastureId, communityId, plantId) => {
    await axios.delete(API.DELETE_RUP_INDICATOR_PLANT(planId, pastureId, communityId, plantId), getAuthHeaderConfig());
  },
);

export const deleteAttachment = async (planId, attachmentId) => {
  await axios.delete(API.DELETE_RUP_ATTACHMENT(planId, attachmentId), getAuthHeaderConfig());
};
