import uuid from 'uuid-v4';
import {
  axios,
  getAuthHeaderConfig,
  findStatusWithCode,
  isUserAgrologist,
  canUserAddAttachments,
  isUserAdmin,
} from '../utils';
import * as API from '../constants/api';
import RUPSchema from '../components/rangeUsePlanPage/schema';
import { getNetworkStatus } from '../utils/helper/network';
import { deleteFromQueue } from './delete';
import {
  saveSchedules as saveSchedules,
  saveInvasivePlantChecklist,
  saveManagementConsiderations,
  saveMinisterIssues,
  saveAdditionalRequirements,
  savePlantCommunities,
  savePastures,
  saveAttachments,
} from '.';
import { REFERENCE_KEY, AMENDMENT_TYPE, PLAN_STATUS } from '../constants/variables';

/**
 * Syncs plan and then returns locally stored record
 * @param {number} planId
 */
export const getPlan = async (planId: string | number, user: any = {}): Promise<any> => {
  if (!uuid.isUUID(planId)) {
    await syncPlan(planId, user);
  }
  const plan = getPlanFromLocalStorage(planId);

  return plan;
};

/**
 * If online, first updates any unsynced plan changes and then fetches and then
 * stores the latest version of the plan into local storage
 * @param {number} planId
 * @returns {void}
 */

const syncPlan = async (planId: string | number, user: any): Promise<void> => {
  const isOnline = await getNetworkStatus();
  const localPlan = getPlanFromLocalStorage(planId);

  if (isOnline) {
    if (localPlan && !localPlan.synced) {
      await savePlan(localPlan, user);
    }

    const { data: serverPlan } = await axios.get(API.GET_RUP(planId), getAuthHeaderConfig());
    savePlanToLocalStorage(serverPlan, true);
  }
};

/**
 * If online, uploads the plan to the API. Otherwise, saves the plan to local storage
 * @param {object} plan
 */
export const savePlan = async (plan: any, user: any = {}): Promise<string | number> => {
  const isOnline = await getNetworkStatus();

  if (!isOnline) {
    savePlanToLocalStorage(plan, false);
    return plan.id;
  }

  await deleteFromQueue();

  const {
    pastures,
    schedules,
    invasivePlantChecklist,
    managementConsiderations,
    ministerIssues,
    additionalRequirements,
    files,
  } = RUPSchema.cast(plan) as any;

  const config = getAuthHeaderConfig();

  let planId = plan.id;

  if (uuid.isUUID(planId)) {
    delete plan.id;
    const { ...planData } = plan;
    const { data } = await axios.post(API.CREATE_RUP, planData, config);
    removePlanFromLocalStorage(planId);
    planId = data.id;
  } else {
    await axios.put(API.UPDATE_RUP(plan.id), plan, config);
  }

  const newPastures = await savePastures(planId, pastures);

  await Promise.all(
    newPastures.map(async (pasture: any) => {
      await savePlantCommunities(planId, pasture.id, pasture.plantCommunities);
    }),
  );

  await saveSchedules(planId, schedules, newPastures);
  await saveInvasivePlantChecklist(planId, invasivePlantChecklist);
  await saveManagementConsiderations(planId, managementConsiderations);
  await saveMinisterIssues(planId, ministerIssues, newPastures);
  await saveAdditionalRequirements(planId, additionalRequirements);

  if (files && files.length > 0) {
    // Only save attachments that haven't been saved individually
    // (attachments with UUID ids haven't been saved to database yet)
    if ((isUserAgrologist(user) && canUserAddAttachments(plan, user)) || isUserAdmin(user)) {
      const unsavedAttachments = files.filter((file: any) => uuid.isUUID(file.id));
      if (unsavedAttachments.length > 0) {
        await saveAttachments(planId, unsavedAttachments);
      }
    }
  }

  return planId;
};

/**
 * Saves the plan to local storage, with the key corresponding to its id
 * @param {object} plan -
 * @param {boolean} synced - If the stored plan is to be marked as synced
 */
export const savePlanToLocalStorage = (plan: any, synced = false): void => {
  localStorage.setItem(`plan-${plan.id}`, JSON.stringify({ ...plan, synced }));
};

/**
 * Get a plan from local storage
 * @param {number} planId - ID of the plan
 */
export const getPlanFromLocalStorage = (planId: string | number): any => {
  return JSON.parse(localStorage.getItem(`plan-${planId}`)!);
};

const removePlanFromLocalStorage = (planId: string | number): void => {
  localStorage.removeItem(`plan-${planId}`);
};

export const getPlans = (): any[] =>
  Object.entries(localStorage)
    .filter(([key]) => key.match(/(plan-)(.*)/g))
    .map((entry) => JSON.parse(entry[1]));

export const createNewPlan = (agreement: any): any => {
  const newPlan = {
    id: uuid(),
    agreementId: agreement.id,
    rangeName: '',
    statusId: 6,
    status: { code: PLAN_STATUS.STAFF_DRAFT },
    agreement,
    planStatusHistory: [],
    pastures: [],
    ministerIssues: [],
    attachments: [],
    invasivePlantChecklist: {
      beginInUninfestedArea: false,
      equipmentAndVehiclesParking: false,
      other: null,
      revegetate: false,
      undercarrigesInspected: false,
    },
    schedules: [],
    managementConsiderations: [],
    additionalRequirements: [],
    uploaded: true,
  };

  savePlanToLocalStorage(newPlan);

  return newPlan;
};

export const updatePlan = async (planId: string | number, data: any): Promise<any> => {
  return await axios.put(API.UPDATE_RUP(planId), data, getAuthHeaderConfig());
};

export const createAmendment = async (plan: any, references: any, staffInitiated = false): Promise<any> => {
  const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
  const initialAmendment = amendmentTypes.find((at: any) => at.code === AMENDMENT_TYPE.INITIAL);
  const ahAmendmentStatus = findStatusWithCode(references, PLAN_STATUS.AMENDMENT_AH);
  const staffAmendmentStatus = findStatusWithCode(references, PLAN_STATUS.MANDATORY_AMENDMENT_STAFF);

  await axios.put(
    API.UPDATE_RUP(plan.id),
    {
      amendmentTypeId: initialAmendment.id,
    },
    getAuthHeaderConfig(),
  );

  await axios.put(
    API.UPDATE_PLAN_STATUS(plan.id),
    {
      statusId: staffInitiated ? staffAmendmentStatus.id : ahAmendmentStatus.id,
    },
    getAuthHeaderConfig(),
  );

  return getPlan(plan.id);
};

export const updateStatus = async ({
  planId,
  note,
  statusId,
}: {
  planId: string | number;
  note: string;
  statusId: string | number;
}): Promise<void> => {
  await axios.put(API.UPDATE_PLAN_STATUS(planId), { note, statusId }, getAuthHeaderConfig());
};

export const createReplacementPlan = async (planId: string | number): Promise<any> => {
  return (await axios.put(API.REPLACEMENT_PLAN(planId), getAuthHeaderConfig())).data.replacementPlan;
};

export const updateConfirmation = async ({
  user,
  planId,
  confirmationId,
  confirmed,
  isMinorAmendment = false,
  isOwnSignature = true,
}: {
  user: any;
  planId: string | number;
  confirmationId: string | number;
  confirmed: boolean;
  isMinorAmendment?: boolean;
  isOwnSignature?: boolean;
}): Promise<any> => {
  const config = {
    ...getAuthHeaderConfig(),
    params: {
      isMinorAmendment,
    },
  };
  return axios.put(
    API.UPDATE_CONFIRMATION(planId, confirmationId),
    { confirmed, userId: user.id, isOwnSignature },
    config,
  );
};

export const getMostRecentLegalPlan = async (planId: string | number): Promise<any> => {
  const {
    data: { versions },
  } = await axios.get(API.GET_RUP_VERSIONS(planId), getAuthHeaderConfig());
  const legalVersion = versions.find((v: any) => v.isCurrentLegalVersion);

  if (!legalVersion) {
    throw new Error('Could not find legal version');
  }

  const { data } = await axios.get(API.GET_RUP_VERSION(planId, legalVersion.version), getAuthHeaderConfig());

  return data;
};

export const discardAmendment = async (planId: string | number): Promise<any> => {
  return axios.post(API.DISCARD_AMENDMENT(planId), {}, getAuthHeaderConfig());
};

export const amendFromLegal = async (plan: any, references: any, staffInitiated: boolean): Promise<void> => {
  const { version } = await getMostRecentLegalPlan(plan.id);

  await axios.post(API.RESTORE_RUP_VERSION(plan.id, version), {}, getAuthHeaderConfig());
  await createAmendment(plan, references, staffInitiated);
};

export const generatePDF = async (planId: string | number): Promise<any> => {
  return await axios.get(API.GET_RUP_PDF(planId), {
    ...getAuthHeaderConfig(),
    responseType: 'blob',
  });
};

export const updateSortOrder = async (
  planId: string | number,
  scheduleId: string | number,
  sortBy: string,
  sortOrder: string,
): Promise<any> => {
  return axios.put(
    API.UPDATE_SCHEDULE_SORT_ORDER(planId, scheduleId),
    {
      sortBy: sortBy,
      sortOrder: sortOrder,
    },
    getAuthHeaderConfig(),
  );
};
