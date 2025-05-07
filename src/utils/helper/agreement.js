export const isGrazingSchedule = (agreementType) => agreementType && agreementType.code.startsWith('E');
export const isHayCuttingSchedule = (agreementType) => agreementType && agreementType.code.startsWith('H');
