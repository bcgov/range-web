import React from 'react'
import PropTypes from 'prop-types'
import { InfoTip } from '../../common'
import { CONDITIONS } from '../../../constants/fields'
import * as strings from '../../../constants/strings'
import PermissionsField from '../../common/PermissionsField'
import { TextArea } from 'formik-semantic-ui'
import { useUser } from '../../../providers/UserProvider'
import EditableProvider from '../../../providers/EditableProvider'
import { isStatusSubmittedForFD } from '../../../utils'

const Conditions = ({ plan }) => {
  const user = useUser()
  const { conditions = '', proposedConditions = '' } = plan || {}

  return (
    <div className="rup__conditions">
      <div className="rup__popup-header">
        <div className="rup__content-title">{strings.CONDITIONS}</div>
      </div>
      <div className="rup__divider" style={{ marginBottom: 10 }} />
      <div>
        Consistent with FRPA section 112 the following conditions are imposed
        and form part of the RUP approval:
      </div>
      <div className="rup__row">
        <div className="rup__cell-6" style={{ marginBottom: 40 }}>
          <div className="rup__info-title">
            <div className="rup__popup-header">
              Conditions
              <InfoTip
                header={strings.CONDITIONS}
                content={strings.CONDITIONS_TIP}
                size="tiny"
              />
            </div>
          </div>
          <PermissionsField
            permission={CONDITIONS.CONDITIONS}
            name="conditions"
            component={TextArea}
            displayValue={
              conditions !== '' && conditions !== null
                ? '\n' + conditions
                : '\nNo conditions'
            }
            fieldProps={{ required: false }}
            fast
          />
        </div>
        {!user.roles.includes('myra_client') && (
          <div className="rup__cell-6" style={{ marginBottom: 40 }}>
            <div className="rup__info-title" style={{ width: 500 }}>
              <div className="rup__popup-header">
                Range Officer Recommendations
                <InfoTip
                  header={strings.RECOMENDATIONS}
                  content={strings.PROPOSED_CONDITIONS_TIP}
                  size="tiny"
                />
              </div>
            </div>
            <EditableProvider editable={isStatusSubmittedForFD(plan?.status)}>
              <PermissionsField
                permission={CONDITIONS.PROPOSED_CONDITIONS}
                name="proposedConditions"
                component={TextArea}
                displayValue={
                  proposedConditions !== '' && proposedConditions !== null
                    ? '\n' + proposedConditions
                    : '\nNo conditions'
                }
                fieldProps={{ required: false }}
                fast
              />
            </EditableProvider>
          </div>
        )}
      </div>
    </div>
  )
}

Conditions.propTypes = {
  plan: PropTypes.shape({}).isRequired
}

export default Conditions
