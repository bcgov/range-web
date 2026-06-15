import React from 'react';
import uuid from 'uuid-v4';
import { NOT_PROVIDED } from '../../../constants/strings';
import { IfEditable } from '../../common/PermissionsField';
import { STUBBLE_HEIGHT } from '../../../constants/fields';
import { FieldArray, connect } from 'formik';
import IndicatorPlant from './IndicatorPlant';
import { deleteIndicatorPlant } from '../../../api';
import { PrimaryButton, MuiIcon } from '../../common';
import useConfirm from '../../../providers/ConfrimationModalProvider';

interface IndicatorPlantsFormProps {
  indicatorPlants: any[];
  valueLabel: string;
  valueType: string;
  criteria: string;
  planId: any;
  pastureId: any;
  communityId: any;
  namespace: string;
  formik?: any;
  fast?: boolean;
}

function IndicatorPlantsForm({
  indicatorPlants,
  valueLabel,
  valueType,
  criteria,
  planId,
  pastureId,
  communityId,
  namespace,
  formik,
}: IndicatorPlantsFormProps) {
  const confirm = useConfirm()!;

  return (
    <>
      <div className="rup__plant-community__i-plant__header">
        <div className="rup__plant-community__sh__label label--required">Indicator Plant</div>
        <div className="rup__plant-community__sh__label label--required">{valueLabel}</div>
      </div>

      <FieldArray
        name={`${namespace}.indicatorPlants`}
        validateOnChange={false}
        render={({ push, remove }) => (
          <>
            {indicatorPlants.length === 0 && (
              <IfEditable invert permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
                <div className="rup__plant-community__i-plants__not-provided">{NOT_PROVIDED}</div>
              </IfEditable>
            )}

            {indicatorPlants.map(
              (plant: any, index: number) =>
                plant.criteria === criteria && (
                  <IndicatorPlant
                    key={`indicatorPlant_${plant.id}`}
                    namespace={`${namespace}.indicatorPlants.${index}`}
                    plant={plant}
                    formik={formik}
                    valueType={valueType}
                    onDelete={async () => {
                      const choice = await confirm({
                        titleText: 'Delete Indicator Plant',
                        contentText: 'Are you sure you want to delete this indicator plant?',
                      });
                      if (!choice) return;
                      const indicatorPlant = indicatorPlants[index];
                      if (!uuid.isUUID(indicatorPlant.id)) {
                        deleteIndicatorPlant(planId, pastureId, communityId, indicatorPlant.id);
                      }
                      remove(index);
                    }}
                  />
                ),
            )}

            <IfEditable permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
              <PrimaryButton
                type="button"
                onClick={() => {
                  push({
                    plantSpeciesId: null,
                    value: '0.0',
                    name: null,
                    criteria,
                    id: uuid(),
                  });
                }}
                startIcon={<MuiIcon name="add circle" />}
                style={{ marginTop: '20px' }}
              >
                Add Indicator Plant
              </PrimaryButton>
            </IfEditable>
          </>
        )}
      />
    </>
  );
}

export default connect(IndicatorPlantsForm);
