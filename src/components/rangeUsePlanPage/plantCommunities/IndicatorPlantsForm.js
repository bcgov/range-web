import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid-v4';
import { NOT_PROVIDED } from '../../../constants/strings';
import { IfEditable } from '../../common/PermissionsField';
import { STUBBLE_HEIGHT } from '../../../constants/fields';
import { Button, Confirm } from 'semantic-ui-react';
import { FieldArray, connect } from 'formik';
import IndicatorPlant from './IndicatorPlant';
import { deleteIndicatorPlant } from '../../../api';

const IndicatorPlantsForm = ({
  indicatorPlants,
  valueLabel,
  valueType,
  criteria,
  planId,
  pastureId,
  communityId,
  namespace,
  formik,
}) => {
  const [toRemove, setToRemove] = useState();
  const [removeDialogOpen, setDialogOpen] = useState(false);

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
              (plant, index) =>
                plant.criteria === criteria && (
                  <IndicatorPlant
                    key={`indicatorPlant_${plant.id}`}
                    namespace={`${namespace}.indicatorPlants.${index}`}
                    plant={plant}
                    formik={formik}
                    valueType={valueType}
                    onDelete={() => {
                      setToRemove(index);
                      setDialogOpen(true);
                    }}
                  />
                ),
            )}

            <IfEditable permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
              <Button
                type="button"
                primary
                onClick={() => {
                  push({
                    plantSpeciesId: null,
                    value: '0.0',
                    name: null,
                    criteria,
                    id: uuid(),
                  });
                }}
                style={{ marginTop: '20px' }}
              >
                <i className="add circle icon" />
                Add Indicator Plant
              </Button>
            </IfEditable>

            <Confirm
              open={removeDialogOpen}
              onCancel={() => {
                setToRemove();
                setDialogOpen(false);
              }}
              onConfirm={async () => {
                const indicatorPlant = indicatorPlants[toRemove];

                if (!uuid.isUUID(indicatorPlant.id)) {
                  deleteIndicatorPlant(planId, pastureId, communityId, indicatorPlant.id);
                }

                remove(toRemove);
                setToRemove(null);
                setDialogOpen(false);
              }}
            />
          </>
        )}
      />
    </>
  );
};

IndicatorPlantsForm.propTypes = {
  indicatorPlants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      plantSpeciesId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      criteria: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  valueLabel: PropTypes.string.isRequired,
  valueType: PropTypes.string.isRequired,
  criteria: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  errors: PropTypes.object,
};

export default connect(IndicatorPlantsForm);
