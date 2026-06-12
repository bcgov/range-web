import React from 'react';
import { InfoTip } from '../../common';
import { CONDITIONS } from '../../../constants/fields';
import * as strings from '../../../constants/strings';
import PermissionsField from '../../common/PermissionsField';
import { useUser } from '../../../providers/UserProvider';
import EditableProvider from '../../../providers/EditableProvider';
import { isStatusSubmittedForFD, isUserAgreementHolder } from '../../../utils';

interface ConditionsProps {
  plan: any;
}

function Conditions({ plan }: ConditionsProps) {
  const user = useUser();
  const { conditions = '', proposedConditions = '' } = plan || {};

  return (
    <div className="rup__conditions">
      <div className="rup__popup-header">
        <div className="rup__content-title">{strings.CONDITIONS}</div>
      </div>
      <div className="rup__divider" style={{ marginBottom: 10 }} />
      <div>
        Consistent with FRPA section 112 the following conditions are imposed and form part of the RUP approval:
      </div>
      <div className="rup__row">
        <div className="rup__cell-6" style={{ marginBottom: 40 }}>
          <div className="rup__info-title">
            <div className="rup__popup-header">
              Conditions
              <InfoTip header={strings.CONDITIONS} content={strings.CONDITIONS_TIP} size="tiny" />
            </div>
          </div>
          <PermissionsField
            permission={CONDITIONS.CONDITIONS}
            name="conditions"
            displayValue={conditions !== '' && conditions !== null ? '\n' + conditions : '\nNo conditions'}
            multiline
            minRows={3}
            fast
          />
        </div>
        {!isUserAgreementHolder(user) && (
          <div className="rup__cell-6" style={{ marginBottom: 40 }}>
            <div className="rup__info-title" style={{ width: 500 }}>
              <div className="rup__popup-header">
                Staff Recommended Conditions
                <InfoTip header={strings.RECOMENDATIONS} content={strings.PROPOSED_CONDITIONS_TIP} size="tiny" />
              </div>
            </div>
            <EditableProvider editable={isStatusSubmittedForFD(plan?.status)}>
              <PermissionsField
                permission={CONDITIONS.PROPOSED_CONDITIONS}
                name="proposedConditions"
                displayValue={
                  proposedConditions !== '' && proposedConditions !== null
                    ? '\n' + proposedConditions
                    : '\nNo conditions'
                }
                multiline
                minRows={3}
                fast
              />
            </EditableProvider>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conditions;
