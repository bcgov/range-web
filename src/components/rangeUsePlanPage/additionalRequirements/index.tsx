import React, { useState } from 'react';
import AdditionalRequirementRow from './AdditionalRequirementRow';
import { InfoTip } from '../../common';
import { IfEditable } from '../../common/PermissionsField';
import { ADDITIONAL_REQUIREMENTS } from '../../../constants/fields';
import * as strings from '../../../constants/strings';
import { FieldArray } from 'formik';
import { Button, Confirm } from 'semantic-ui-react';
import uuid from 'uuid-v4';
import { deleteAdditionalRequirement } from '../../../api';
import { resetAdditionalRequirementId } from '../../../utils/helper/additionalRequirement';

interface AdditionalRequirementsProps {
  additionalRequirements: any[];
  planId?: any;
}

const AdditionalRequirements: React.FC<AdditionalRequirementsProps> = ({ additionalRequirements, planId: _planId }) => {
  const [indexToRemove, setIndexToRemove] = useState<number | null>(null);

  return (
    <FieldArray
      name="additionalRequirements"
      validateOnChange={false}
      render={({ push, remove }) => (
        <div className="rup__a-requirements">
          <div className="rup__content-title--editable">
            <div className="rup__popup-header">
              <div className="rup__content-title">{strings.ADDITIONAL_REQUIREMENTS}</div>
              <InfoTip header={strings.ADDITIONAL_REQUIREMENTS} content={strings.ADDITIONAL_REQUIREMENTS_TIP} />
            </div>
            <IfEditable permission={ADDITIONAL_REQUIREMENTS.CATEGORY}>
              <Button
                type="button"
                basic
                primary
                onClick={() => {
                  push({
                    id: uuid(),
                    detail: '',
                    url: '',
                    categoryId: undefined,
                  });
                }}
                className="icon labeled rup__pastures__add-button"
              >
                <i className="add circle icon" />
                Add Requirement
              </Button>
            </IfEditable>
          </div>
          <div className="rup__divider" />
          <div className="rup__a-requirements__note">
            Other direction or agreements with which this Range Use Plan must be consistent. Contact a range staff
            member if you need more information.
          </div>
          <div className="rup__a-requirements__box">
            {additionalRequirements.length === 0 ? (
              <div className="rup__a-requirements__no-content">No additional requirements provided</div>
            ) : (
              additionalRequirements.map((additionalRequirement, i) => (
                <AdditionalRequirementRow
                  key={additionalRequirement.id}
                  additionalRequirement={additionalRequirement}
                  onDelete={() => setIndexToRemove(i)}
                  onCopy={() => push(resetAdditionalRequirementId(additionalRequirements[i]))}
                  namespace={`additionalRequirements.${i}`}
                />
              ))
            )}
          </div>

          <Confirm
            header="Delete additional requirement"
            content="Are you sure?"
            open={indexToRemove !== null}
            onCancel={() => {
              setIndexToRemove(null);
            }}
            onConfirm={async () => {
              const requirement = additionalRequirements[indexToRemove!];

              if (!uuid.isUUID(requirement.id)) {
                deleteAdditionalRequirement(requirement.planId, requirement.id);
              }

              remove(indexToRemove!);
              setIndexToRemove(null);
            }}
          />
        </div>
      )}
    />
  );
};

export default AdditionalRequirements;
