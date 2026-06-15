import React from 'react';
import AdditionalRequirementRow from './AdditionalRequirementRow';
import { InfoTip, PrimaryButton, MuiIcon } from '../../common';
import { IfEditable } from '../../common/PermissionsField';
import { ADDITIONAL_REQUIREMENTS } from '../../../constants/fields';
import * as strings from '../../../constants/strings';
import { FieldArray } from 'formik';
import uuid from 'uuid-v4';
import { deleteAdditionalRequirement } from '../../../api';
import { resetAdditionalRequirementId } from '../../../utils/helper/additionalRequirement';
import useConfirm from '../../../providers/ConfrimationModalProvider';

interface AdditionalRequirementsProps {
  additionalRequirements: any[];
  planId?: any;
}

function AdditionalRequirements({ additionalRequirements, planId: _planId }: AdditionalRequirementsProps) {
  const confirm = useConfirm()!;

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
              <PrimaryButton
                type="button"
                onClick={() => {
                  push({
                    id: uuid(),
                    detail: '',
                    url: '',
                    categoryId: undefined,
                  });
                }}
                className="icon labeled rup__pastures__add-button"
                startIcon={<MuiIcon name="add circle" />}
              >
                Add Requirement
              </PrimaryButton>
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
                  onDelete={async () => {
                    const choice = await confirm({
                      titleText: 'Delete additional requirement',
                      contentText: 'Are you sure?',
                    });
                    if (!choice) return;
                    const requirement = additionalRequirements[i];
                    if (!uuid.isUUID(requirement.id)) {
                      deleteAdditionalRequirement(requirement.planId, requirement.id);
                    }
                    remove(i);
                  }}
                  onCopy={() => push(resetAdditionalRequirementId(additionalRequirements[i]))}
                  namespace={`additionalRequirements.${i}`}
                />
              ))
            )}
          </div>
        </div>
      )}
    />
  );
}

export default AdditionalRequirements;
