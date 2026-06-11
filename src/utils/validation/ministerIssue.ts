import { UNIDENTIFIED_MINISTER_ISSUES } from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';

interface ValidationError {
  error: boolean;
  message: string;
  elementId: string;
}

interface MinisterIssueLike {
  identified?: boolean;
}

export const handleMinisterIssueValidation = (ministerIssues: MinisterIssueLike[]): ValidationError[] => {
  if (ministerIssues.find((issue) => !issue.identified)) {
    return [
      {
        error: true,
        message: UNIDENTIFIED_MINISTER_ISSUES,
        elementId: ELEMENT_ID.MINISTER_ISSUES,
      },
    ];
  }

  return [];
};
