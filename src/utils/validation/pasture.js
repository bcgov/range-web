import { EMPTY_PASTURES } from '../../constants/strings';
import { ELEMENT_ID } from '../../constants/variables';

export const handlePastureValidation = (pastures) => {
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
