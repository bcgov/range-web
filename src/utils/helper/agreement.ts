import { AgreementType } from '../../types';

export const isGrazingSchedule = (agreementType: AgreementType | null | undefined): boolean =>
  !!(agreementType && agreementType.code.startsWith('E'));

export const isHayCuttingSchedule = (agreementType: AgreementType | null | undefined): boolean =>
  !!(agreementType && agreementType.code.startsWith('H'));
