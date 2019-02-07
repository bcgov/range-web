import { AMENDMENT_TYPE } from '../../constants/variables';

export const copyPlantCommunitiesToCreateAmendment = (plantCommunities, newPastureIdsMap) => {
  return plantCommunities.map((pc) => {
    const {
      id,
      pastureId: pId,
      ...plantCommunity } = pc;
    // get the newly created pasture id
    const newPastureId = newPastureIdsMap[pId];

    return {
      ...plantCommunity,
      pastureId: newPastureId,
    };
  });
};

export const copyPlanToCreateAmendment = (plan = {}, statusId, amendmentTypeId) => {
  const copied = {
    ...plan,
    statusId,
    amendmentTypeId,
    uploaded: false, // set it to false because it still need to create more contents
    effectiveAt: null,
    submittedAt: null,
  };
  delete copied.id;
  delete copied.createdAt;
  delete copied.updatedAt;

  return copied;
};

export const copyPasturesToCreateAmendment = (plan, pasturesMap) => {
  // extract all plantCommunities from pastures
  let plantCommunities = [];

  const pastures = plan.pastures.map((pId) => {
    const { id: oldId, planId, ...pasture } = pasturesMap[pId] || {};

    const { plantCommunities: pcs } = pasture;
    if (pcs && pcs.length) {
      plantCommunities = [...plantCommunities, ...pcs];
    }

    // oldId will be used to match the relationships between
    // copied pastures and other contents referecing to those pastures
    // such as grazing schedule entries and minister issues
    return { ...pasture, oldId };
  });

  return {
    pastures,
    plantCommunities,
  };
};

export const normalizePasturesWithOldId = (pastures) => {
  const pastureIdsMap = {};
  pastures.map((p) => {
    pastureIdsMap[p.oldId] = p.id;
    return null;
  });
  return pastureIdsMap;
};

export const copyGrazingSchedulesToCreateAmendment = (
  plan,
  grazingSchedulesMap,
  newPastureIdsMap,
) => {
  return plan.grazingSchedules.map((gsId) => {
    const {
      id,
      planId,
      grazingScheduleEntries,
      ...grazingSchedule
    } = grazingSchedulesMap[gsId];
    const newGrazingScheduleEntries = grazingScheduleEntries.map((gse) => {
      const { id, pastureId: oldPastureId, ...newGrazingScheduleEntry } = gse;
      // replace the original pastureId with the newly created pastureId
      const pastureId = newPastureIdsMap[oldPastureId];
      return { ...newGrazingScheduleEntry, pastureId };
    });

    return {
      ...grazingSchedule,
      grazingScheduleEntries: newGrazingScheduleEntries,
    };
  });
};

export const copyMinisterIssuesToCreateAmendment = (
  plan,
  ministerIssuesMap,
  newPastureIdsMap,
) => {
  return plan.ministerIssues.map((miId) => {
    const {
      id,
      planId,
      pastures: oldPastureIds,
      ...ministerIssue
    } = ministerIssuesMap[miId];
    // replace the pasture ids with the newly created pasture ids
    const pastures = oldPastureIds.map(opId => newPastureIdsMap[opId]);
    return { ...ministerIssue, pastures };
  });
};

export const copyInvasivePlantChecklistToCreateAmendment = (plan) => {
  if (!plan || !plan.invasivePlantChecklist) return null;

  const { id, planId, ...invasivePlantChecklist } = plan.invasivePlantChecklist;
  return invasivePlantChecklist;
};

export const copyManagementConsiderationsToCreateAmendment = (
  plan,
  managementConsiderationsMap,
) => {
  return plan.managementConsiderations.map((mcId) => {
    const {
      id,
      planId,
      considerationType,
      ...managementConsideration
    } = managementConsiderationsMap[mcId];

    return managementConsideration;
  });
};

export const copyAdditionalRequirementsToCreateAmendment = (
  plan,
  additionalRequirementsMap,
) => {
  return plan.additionalRequirements.map((arId) => {
    const {
      id,
      planId,
      category,
      ...additionalRequirement
    } = additionalRequirementsMap[arId];

    return additionalRequirement;
  });
};

export const isAmendment = amendmentTypeId => (
  amendmentTypeId > 0
);

export const isSubmittedAsMinor = (amendmentTypeId, amendmentTypes) => {
  const amendmentType = amendmentTypes.find(at => at.id === amendmentTypeId);
  return amendmentType && (amendmentType.code === AMENDMENT_TYPE.MINOR);
};

export const isSubmittedAsMandatory = (amendmentTypeId, amendmentTypes) => {
  const amendmentType = amendmentTypes.find(at => at.id === amendmentTypeId);
  return amendmentType && (amendmentType.code === AMENDMENT_TYPE.MANDATORY);
};

export const isMinorAmendment = (amendmentTypeId, amendmentTypes, amendmentTypeCode) => (
  isSubmittedAsMinor(amendmentTypeId, amendmentTypes)
    || amendmentTypeCode === AMENDMENT_TYPE.MINOR
);

export const isMandatoryAmendment = (amendmentTypeId, amendmentTypes, amendmentTypeCode) => (
  isSubmittedAsMandatory(amendmentTypeId, amendmentTypes)
    || amendmentTypeCode === AMENDMENT_TYPE.MANDATORY
);
