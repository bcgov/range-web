import { ELEMENT_ID } from '../../constants/variables';
import { UNAPPROVED_PLANT_COMMUNITIES } from '../../constants/strings';

export const handlePlantCommunityValidation = (plantCommunities) => {
  if (plantCommunities.find((pc) => !pc.approved)) {
    return [
      {
        error: true,
        message: UNAPPROVED_PLANT_COMMUNITIES,
        elementId: ELEMENT_ID.PASTURES,
      },
    ];
  }

  return [];
};
