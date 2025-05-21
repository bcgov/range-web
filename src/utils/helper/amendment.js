import { AMENDMENT_TYPE } from '../../constants/variables';

export const copyPlantCommunitiesToCreateAmendment = (plantCommunityIds, plantCommunitiesMap, newPastureIdsMap) => {
  const plantCommunities = plantCommunityIds.map((id) => plantCommunitiesMap[id]);

  return plantCommunities.map((pc) => {
    const { pastureId: oldPastureId, ...plantCommunity } = pc;
    // get the newly created pasture id
    const pastureId = newPastureIdsMap[oldPastureId];

    return {
      ...plantCommunity,
      pastureId,
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

  const pastures = plan.pastures.map((p) => {
    const { id: oldId, ...pasture } = pasturesMap[p.id] || {};

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

export const normalizePasturesWithOldId = (oldPastures, newPastures) => {
  const pastureIdsMap = {};
  newPastures.forEach((p) => {
    const match = oldPastures.find((old) => p.name === old.name);
    pastureIdsMap[match.oldId] = p.id;
  });
  return pastureIdsMap;
};

export const copySchedulesToCreateAmendment = (plan, schedulesMap, newPastureIdsMap) => {
  return plan.schedules.map((gs) => {
    const { scheduleEntries, ...schedule } = schedulesMap[gs.id];
    const newScheduleEntries = scheduleEntries.map((gse) => {
      const { pastureId: oldPastureId, ...newScheduleEntry } = gse;
      // replace the original pastureId with the newly created pastureId
      const pastureId = newPastureIdsMap[oldPastureId];
      return { ...newScheduleEntry, pastureId };
    });

    return {
      ...schedule,
      scheduleEntries: newScheduleEntries,
    };
  });
};

export const copyMinisterIssuesToCreateAmendment = (plan, ministerIssuesMap, newPastureIdsMap) => {
  return plan.ministerIssues.map((mi) => {
    const { pastures: oldPastureIds, ...ministerIssue } = ministerIssuesMap[mi.id];
    // replace the pasture ids with the newly created pasture ids
    const pastures = oldPastureIds.map((opId) => newPastureIdsMap[opId]);
    return { ...ministerIssue, pastures };
  });
};

export const copyInvasivePlantChecklistToCreateAmendment = (plan) => {
  if (!plan || !plan.invasivePlantChecklist) return null;

  const { ...invasivePlantChecklist } = plan.invasivePlantChecklist;
  return invasivePlantChecklist;
};

export const copyManagementConsiderationsToCreateAmendment = (plan, managementConsiderationsMap) => {
  return plan.managementConsiderations.map((mc) => {
    const { ...managementConsideration } = managementConsiderationsMap[mc.id];

    return managementConsideration;
  });
};

export const copyAdditionalRequirementsToCreateAmendment = (plan, additionalRequirementsMap) => {
  return plan.additionalRequirements.map((ar) => {
    const { ...additionalRequirement } = additionalRequirementsMap[ar.id];

    return additionalRequirement;
  });
};

export const isAmendment = (amendmentTypeId) => amendmentTypeId > 0;

export const isSubmittedAsMinor = (amendmentTypeId, amendmentTypes) => {
  const amendmentType = amendmentTypes.find((at) => at.id === amendmentTypeId);
  if (!amendmentType) {
    return false;
  }
  return amendmentType && amendmentType.code === AMENDMENT_TYPE.MINOR;
};

export const isSubmittedAsMandatory = (amendmentTypeId, amendmentTypes) => {
  const amendmentType = amendmentTypes.find((at) => at.id === amendmentTypeId);
  if (!amendmentType) {
    return false;
  }
  return amendmentType && amendmentType.code === AMENDMENT_TYPE.MANDATORY;
};

export const isMinorAmendment = (amendmentTypeId, amendmentTypes, amendmentTypeCode) =>
  isSubmittedAsMinor(amendmentTypeId, amendmentTypes) || amendmentTypeCode === AMENDMENT_TYPE.MINOR;

export const isMandatoryAmendment = (amendmentTypeId, amendmentTypes, amendmentTypeCode) =>
  isSubmittedAsMandatory(amendmentTypeId, amendmentTypes) || amendmentTypeCode === AMENDMENT_TYPE.MANDATORY;
