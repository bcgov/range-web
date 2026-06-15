import { AMENDMENT_TYPE } from '../../constants/variables';

interface PlanLike {
  pastures?: { id: number | string; [key: string]: any }[];
  schedules?: { id: number | string; [key: string]: any }[];
  ministerIssues?: { id: number | string; [key: string]: any }[];
  managementConsiderations?: { id: number | string; [key: string]: any }[];
  additionalRequirements?: { id: number | string; [key: string]: any }[];
  invasivePlantChecklist?: any;
  [key: string]: any;
}

interface AmendmentTypeLike {
  id: number;
  code: string;
  description?: string;
  [key: string]: any;
}

export const copyPlantCommunitiesToCreateAmendment = (
  plantCommunityIds: (number | string)[],
  plantCommunitiesMap: Record<string | number, any>,
  newPastureIdsMap: Record<string | number, number | string>,
): any[] => {
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

export const copyPlanToCreateAmendment = (plan: any = {}, statusId: number, amendmentTypeId: number): any => {
  const copied: any = {
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

export const copyPasturesToCreateAmendment = (
  plan: PlanLike,
  pasturesMap: Record<string | number, any>,
): { pastures: any[]; plantCommunities: any[] } => {
  // extract all plantCommunities from pastures
  let plantCommunities: any[] = [];

  const pastures = (plan.pastures || []).map((p) => {
    const { id: oldId, ...pasture } = pasturesMap[p.id] || {};

    const { plantCommunities: pcs } = pasture;
    if (pcs && pcs.length) {
      plantCommunities = [...plantCommunities, ...pcs];
    }

    // oldId will be used to match the relationships between
    // copied pastures and other contents referencing to those pastures
    // such as grazing schedule entries and minister issues
    return { ...pasture, oldId };
  });

  return {
    pastures,
    plantCommunities,
  };
};

export const normalizePasturesWithOldId = (
  oldPastures: { oldId?: number | string; name?: string; [key: string]: any }[],
  newPastures: { id: number | string; name?: string; [key: string]: any }[],
): Record<string | number, number | string> => {
  const pastureIdsMap: Record<string | number, number | string> = {};
  newPastures.forEach((p) => {
    const match = oldPastures.find((old) => p.name === old.name);
    pastureIdsMap[match!.oldId!] = p.id;
  });
  return pastureIdsMap;
};

export const copySchedulesToCreateAmendment = (
  plan: PlanLike,
  schedulesMap: Record<string | number, any>,
  newPastureIdsMap: Record<string | number, number | string>,
): any[] => {
  return (plan.schedules || []).map((gs) => {
    const { scheduleEntries, ...schedule } = schedulesMap[gs.id];
    const newScheduleEntries = scheduleEntries.map((gse: any) => {
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

export const copyMinisterIssuesToCreateAmendment = (
  plan: PlanLike,
  ministerIssuesMap: Record<string | number, any>,
  newPastureIdsMap: Record<string | number, number | string>,
): any[] => {
  return (plan.ministerIssues || []).map((mi) => {
    const { pastures: oldPastureIds, ...ministerIssue } = ministerIssuesMap[mi.id];
    // replace the pasture ids with the newly created pasture ids
    const pastures = oldPastureIds.map((opId: string | number) => newPastureIdsMap[opId]);
    return { ...ministerIssue, pastures };
  });
};

export const copyInvasivePlantChecklistToCreateAmendment = (plan: PlanLike | null | undefined): any => {
  if (!plan || !plan.invasivePlantChecklist) return null;

  const { ...invasivePlantChecklist } = plan.invasivePlantChecklist;
  return invasivePlantChecklist;
};

export const copyManagementConsiderationsToCreateAmendment = (
  plan: PlanLike,
  managementConsiderationsMap: Record<string | number, any>,
): any[] => {
  return (plan.managementConsiderations || []).map((mc) => {
    const { ...managementConsideration } = managementConsiderationsMap[mc.id];

    return managementConsideration;
  });
};

export const copyAdditionalRequirementsToCreateAmendment = (
  plan: PlanLike,
  additionalRequirementsMap: Record<string | number, any>,
): any[] => {
  return (plan.additionalRequirements || []).map((ar) => {
    const { ...additionalRequirement } = additionalRequirementsMap[ar.id];

    return additionalRequirement;
  });
};

export const isAmendment = (amendmentTypeId: number | null | undefined): boolean =>
  !!(amendmentTypeId && amendmentTypeId > 0);

export const isSubmittedAsMinor = (
  amendmentTypeId: number | null | undefined,
  amendmentTypes: AmendmentTypeLike[],
): boolean => {
  const amendmentType = amendmentTypes.find((at) => at.id === amendmentTypeId);
  if (!amendmentType) {
    return false;
  }
  return amendmentType && amendmentType.code === AMENDMENT_TYPE.MINOR;
};

export const isSubmittedAsMandatory = (
  amendmentTypeId: number | null | undefined,
  amendmentTypes: AmendmentTypeLike[],
): boolean => {
  const amendmentType = amendmentTypes.find((at) => at.id === amendmentTypeId);
  if (!amendmentType) {
    return false;
  }
  return amendmentType && amendmentType.code === AMENDMENT_TYPE.MANDATORY;
};

export const isMinorAmendment = (
  amendmentTypeId: number | null | undefined,
  amendmentTypes: AmendmentTypeLike[],
  amendmentTypeCode?: string,
): boolean => isSubmittedAsMinor(amendmentTypeId, amendmentTypes) || amendmentTypeCode === AMENDMENT_TYPE.MINOR;

export const isMandatoryAmendment = (
  amendmentTypeId: number | null | undefined,
  amendmentTypes: AmendmentTypeLike[],
  amendmentTypeCode?: string,
): boolean => isSubmittedAsMandatory(amendmentTypeId, amendmentTypes) || amendmentTypeCode === AMENDMENT_TYPE.MANDATORY;
