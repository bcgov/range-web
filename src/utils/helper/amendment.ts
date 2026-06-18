import { AMENDMENT_TYPE } from '../../constants/variables';
import { Plan } from '../../types';

interface AmendmentTypeLike {
  id: number;
  code: string;
  description?: string;
}

export const copyPlantCommunitiesToCreateAmendment = (
  plantCommunityIds: (number | string)[],
  plantCommunitiesMap: Record<string, unknown>,
  newPastureIdsMap: Record<string | number, number | string>,
): Record<string, unknown>[] => {
  const plantCommunities = plantCommunityIds.map((id) => plantCommunitiesMap[id] as Record<string, unknown>);

  return plantCommunities.map((pc) => {
    const { pastureId: oldPastureId, ...plantCommunity } = pc;
    const pastureId = newPastureIdsMap[oldPastureId as string | number];

    return {
      ...plantCommunity,
      pastureId,
    };
  });
};

export const copyPlanToCreateAmendment = (
  plan: Partial<Plan> = {},
  statusId: number,
  amendmentTypeId: number,
): Record<string, unknown> => {
  const copied: Record<string, unknown> = {
    ...plan,
    statusId,
    amendmentTypeId,
    uploaded: false,
    effectiveAt: null,
    submittedAt: null,
  };
  delete copied.id;
  delete copied.createdAt;
  delete copied.updatedAt;

  return copied;
};

export const copyPasturesToCreateAmendment = (
  plan: Partial<Plan>,
  pasturesMap: Record<string, unknown>,
): { pastures: Record<string, unknown>[]; plantCommunities: Record<string, unknown>[] } => {
  let plantCommunities: Record<string, unknown>[] = [];

  const pastures = (plan.pastures || []).map((p) => {
    const { id: oldId, ...pasture } = (pasturesMap[p.id] as Record<string, unknown>) || {};

    const { plantCommunities: pcs } = pasture;
    if (pcs && Array.isArray(pcs)) {
      plantCommunities = [...plantCommunities, ...pcs];
    }

    return { ...pasture, oldId };
  });

  return {
    pastures,
    plantCommunities,
  };
};

export const normalizePasturesWithOldId = (
  oldPastures: { oldId?: number | string; name?: string }[],
  newPastures: { id: number | string; name?: string }[],
): Record<string | number, number | string> => {
  const pastureIdsMap: Record<string | number, number | string> = {};
  newPastures.forEach((p) => {
    const match = oldPastures.find((old) => p.name === old.name);
    if (match && match.oldId != null) {
      pastureIdsMap[match.oldId] = p.id;
    }
  });
  return pastureIdsMap;
};

export const copySchedulesToCreateAmendment = (
  plan: Partial<Plan>,
  schedulesMap: Record<string, unknown>,
  newPastureIdsMap: Record<string | number, number | string>,
): Record<string, unknown>[] => {
  return (plan.schedules || []).map((gs) => {
    const entry = schedulesMap[gs.id] as Record<string, unknown> | undefined;
    const { scheduleEntries, ...schedule } = entry || {};
    const newScheduleEntries = ((scheduleEntries as Record<string, unknown>[]) || []).map((gse) => {
      const { pastureId: oldPastureId, ...newScheduleEntry } = gse;
      const pastureId = newPastureIdsMap[oldPastureId as string | number];
      return { ...newScheduleEntry, pastureId };
    });

    return {
      ...schedule,
      scheduleEntries: newScheduleEntries,
    };
  });
};

export const copyMinisterIssuesToCreateAmendment = (
  plan: Partial<Plan>,
  ministerIssuesMap: Record<string, unknown>,
  newPastureIdsMap: Record<string | number, number | string>,
): Record<string, unknown>[] => {
  return (plan.ministerIssues || []).map((mi) => {
    const entry = ministerIssuesMap[mi.id] as Record<string, unknown> | undefined;
    const { pastures: oldPastureIds, ...ministerIssue } = entry || {};
    const oldIds = (oldPastureIds as (string | number)[] | undefined) || [];
    const pastures = oldIds.map((opId: string | number) => newPastureIdsMap[opId]);
    return { ...ministerIssue, pastures };
  });
};

export const copyInvasivePlantChecklistToCreateAmendment = (
  plan: Partial<Plan> | null | undefined,
): Record<string, unknown> | null => {
  if (!plan || !plan.invasivePlantChecklist) return null;

  const { ...invasivePlantChecklist } = plan.invasivePlantChecklist;
  return invasivePlantChecklist;
};

export const copyManagementConsiderationsToCreateAmendment = (
  plan: Partial<Plan>,
  managementConsiderationsMap: Record<string, unknown>,
): Record<string, unknown>[] => {
  return (plan.managementConsiderations || []).map((mc) => {
    const managementConsideration = (managementConsiderationsMap[mc.id] as Record<string, unknown>) || {};

    return managementConsideration;
  });
};

export const copyAdditionalRequirementsToCreateAmendment = (
  plan: Partial<Plan>,
  additionalRequirementsMap: Record<string, unknown>,
): Record<string, unknown>[] => {
  return (plan.additionalRequirements || []).map((ar) => {
    const additionalRequirement = (additionalRequirementsMap[ar.id] as Record<string, unknown>) || {};

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
