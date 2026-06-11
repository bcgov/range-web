import { EMPTY_PASTURES } from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';

interface ValidationError {
  error: boolean;
  message: string;
  elementId: string;
}

export const handlePastureValidation = (pastures: any[]): ValidationError[] => {
  if (pastures.length === 0) {
    return [
      {
        error: true,
        message: EMPTY_PASTURES,
        elementId: ELEMENT_ID.PASTURES,
      },
    ];
  }

  return [];
};
