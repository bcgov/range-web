import React from 'react';
import IndicatorPlantsForm from '../IndicatorPlantsForm';
import { PLANT_CRITERIA } from '../../../../constants/variables';

interface StubbleHeightBoxProps {
  plantCommunity: any;
  planId: any;
  pastureId: any;
  namespace: string;
}

function StubbleHeightBox({ plantCommunity, planId, pastureId, namespace }: StubbleHeightBoxProps) {
  return (
    <div className="rup__plant-community__sh">
      <div className="rup__plant-community__sh__title">
        {/* <img src={IMAGE_SRC.INFO_ICON} alt="info icon" /> */}
        Stubble Height
      </div>

      <IndicatorPlantsForm
        indicatorPlants={plantCommunity.indicatorPlants}
        namespace={namespace}
        valueLabel="Height After Grazing/Hay Cutting"
        valueType="stubbleHeight"
        planId={planId}
        pastureId={pastureId}
        criteria={PLANT_CRITERIA.STUBBLE_HEIGHT}
        communityId={plantCommunity.id}
      />
    </div>
  );
}

export default StubbleHeightBox;
