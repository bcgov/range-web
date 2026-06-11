import * as API from '../constants/api';
import { getAuthHeaderConfig, axios } from '../utils';
import { deleteFile } from './upload';

type DeleteQueue = Record<string, unknown[][]>;
type DeleteHandler = (...args: unknown[]) => Promise<void>;

const saveDeleteQueue = (deleteQueue: DeleteQueue): void => {
  localStorage.setItem('delete-queue', JSON.stringify(deleteQueue));
};

const loadDeleteQueue = (): DeleteQueue | null => {
  const raw = localStorage.getItem('delete-queue');
  if (!raw) return null;
  return JSON.parse(raw) as DeleteQueue;
};

const loadOrInitDeleteQueue = (): DeleteQueue => {
  const queue = loadDeleteQueue();
  if (!queue) {
    saveDeleteQueue({});
    return {};
  }
  return queue;
};

const deleteHandlers: Record<string, DeleteHandler> = {};

const addDeleteHandler = (key: string, handler: DeleteHandler): void => {
  deleteHandlers[key] = handler;
};

export const deleteFromQueue = async (): Promise<void> => {
  const deleteQueue = loadOrInitDeleteQueue();

  const deletePromises = Object.entries(deleteQueue).map(async ([key, queue]) => {
    const handler = deleteHandlers[key];

    return Promise.all(queue.map((args) => handler(...args)));
  });

  await Promise.all(deletePromises);
};

export const createDeleteHandler = (key: string, cb: (...args: any[]) => Promise<void>): ((...args: unknown[]) => Promise<void>) => {
  const handler = async (...args: unknown[]): Promise<void> => {
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
  async (planId: any, issueId: any, actionId: any) => {
    await axios.delete(API.DELETE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, actionId), getAuthHeaderConfig());
  },
);

export const deletePasture = createDeleteHandler('pasture', async (planId: any, pastureId: any) => {
  await axios.delete(API.DELETE_RUP_PASTURE(planId, pastureId), getAuthHeaderConfig());
});

export const deletePlantCommunity = createDeleteHandler('plantCommunity', async (planId: any, pastureId: any, communityId: any) => {
  await axios.delete(API.DELETE_RUP_PLANT_COMMUNITY(planId, pastureId, communityId), getAuthHeaderConfig());
});

export const deleteMinisterIssue = createDeleteHandler('ministerIssue', async (planId: any, issueId: any) => {
  await axios.delete(API.DELETE_RUP_MINISTER_ISSUE(planId, issueId), getAuthHeaderConfig());
});

export const deleteMonitoringArea = createDeleteHandler(
  'monitoringArea',
  async (planId: any, pastureId: any, communityId: any, areaId: any) => {
    await axios.delete(API.DELETE_RUP_MONITORING_AREA(planId, pastureId, communityId, areaId), getAuthHeaderConfig());
  },
);

export const deletePlantCommunityAction = createDeleteHandler(
  'plantCommunityAction',
  async (planId: any, pastureId: any, communityId: any, actionId: any) => {
    await axios.delete(
      API.DELETE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId, actionId),
      getAuthHeaderConfig(),
    );
  },
);

export const deleteAdditionalRequirement = createDeleteHandler(
  'additionalRequirement',
  async (planId: any, requirementId: any) => {
    await axios.delete(API.DELETE_RUP_ADDITIONAL_REQUIREMENT(planId, requirementId), getAuthHeaderConfig());
  },
);

export const deleteManagementConsideration = createDeleteHandler(
  'managementConsideration',
  async (planId: any, considerationId: any) => {
    await axios.delete(API.DELETE_RUP_MANAGEMENT_CONSIDERATION(planId, considerationId), getAuthHeaderConfig());
  },
);

export const deleteSchedule = createDeleteHandler('schedule', async (planId: any, scheduleId: any) => {
  await axios.delete(API.DELETE_RUP_SCHEDULE(planId, scheduleId), getAuthHeaderConfig());
});

export const deleteScheduleEntry = createDeleteHandler('scheduleEntry', async (planId: any, scheduleId: any, entryId: any) => {
  await axios.delete(API.DELETE_RUP_SCHEDULE_ENTRY(planId, scheduleId, entryId), getAuthHeaderConfig());
});

export const deleteIndicatorPlant = createDeleteHandler(
  'indicatorPlant',
  async (planId: any, pastureId: any, communityId: any, plantId: any) => {
    await axios.delete(API.DELETE_RUP_INDICATOR_PLANT(planId, pastureId, communityId, plantId), getAuthHeaderConfig());
  },
);

export const deleteAttachment = async (planId: string | number, attachmentId: string | number): Promise<void> => {
  // The server endpoint handles both cloud storage and database deletion
  // First try to delete the file directly (which includes cloud storage + database)
  try {
    await deleteFile(attachmentId);
  } catch (error) {
    console.warn('Failed to delete file via file endpoint, trying attachment endpoint:', error);
    // Fall back to the attachment-specific endpoint if file deletion fails
    await axios.delete(API.DELETE_RUP_ATTACHMENT(planId, attachmentId), getAuthHeaderConfig());
  }
};
