import { ELEMENT_ID } from '../../constants/variables';
import { UNAPPROVED_PLANT_COMMUNITIES } from '../../constants/strings';

interface ValidationError {
  error: boolean;
  message: string;
  elementId: string;
}

interface PlantCommunityLike {
  approved?: boolean;
}

export const handlePlantCommunityValidation = (plantCommunities: PlantCommunityLike[]): ValidationError[] => {
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
