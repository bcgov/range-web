export const copyPlanToCreateAmendment = (plan = {}, statusId, amendmentTypeId) => {
  const copied = {
    ...plan,
    statusId,
    amendmentTypeId,
    uploaded: false, // still need to create things like pastures and schedules
    effectiveAt: null,
    submittedAt: null,
  };
  delete copied.id;

  return copied;
};

export const copyPasturesToCreateAmendment = (plan, pasturesMap) => {
  return plan.pastures.map((pId) => {
    const { id: copiedId, planId, ...pasture } = pasturesMap[pId] || {};
    // copiedId will be used to find the relationship between
    // the copied pasture and the field that has a referece to the pasture id
    // such as grazing schedule entries and minister issues
    return { ...pasture, copiedId };
  });
};

export const normalizePasturesWithCopiedId = (pastures) => {
  const pastureIdsMap = {};
  pastures.map((p) => {
    pastureIdsMap[p.copiedId] = p.id;
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
      const { id, pastureId: copiedPastureId, ...newGrazingScheduleEntry } = gse;
      // replace the original pastureId with the newly created pastureId
      const pastureId = newPastureIdsMap[copiedPastureId];
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
      pastures: copiedPastureIds,
      ...ministerIssue
    } = ministerIssuesMap[miId];
    // replace the pastures(array of ids) with the newly created pasture ids
    const pastures = copiedPastureIds.map(cpId => newPastureIdsMap[cpId]);
    return { ...ministerIssue, pastures };
  });
};