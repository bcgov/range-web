interface AgreementTypeLike {
  code: string;
  [key: string]: any;
}

export const isGrazingSchedule = (agreementType: AgreementTypeLike | null | undefined): boolean =>
  !!(agreementType && agreementType.code.startsWith('E'));

export const isHayCuttingSchedule = (agreementType: AgreementTypeLike | null | undefined): boolean =>
  !!(agreementType && agreementType.code.startsWith('H'));
