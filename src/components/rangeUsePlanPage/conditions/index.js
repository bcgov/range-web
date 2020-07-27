import React from 'react'
import PropTypes from 'prop-types'
import { InfoTip } from '../../common'
import { CONDITIONS } from '../../../constants/fields'
import * as strings from '../../../constants/strings'
import PermissionsField from '../../common/PermissionsField'
import { TextArea } from 'formik-semantic-ui'
import { useUser } from '../../../providers/UserProvider'

const Conditions = ({ plan }) => {
  const user = useUser()
  const { conditions = '', proposedConditions = '' } = plan || {}

  return (
    <div className="rup__conditions">
      <div className="rup__popup-header">
        <div className="rup__content-title">{strings.CONDITIONS}</div>
      </div>
      <div className="rup__divider" style={{ marginBottom: 10 }} />
      <div className="rup__row">
        <div className="rup__cell-6" style={{ marginBottom: 40 }}>
          <div className="rup__info-title">
            <div className="rup__popup-header">
              Decision Maker
              <InfoTip
                header={strings.CONDITIONS}
                content={strings.CONDITIONS_TIP_DECISION_MAKER}
                size="tiny"
              />
            </div>
          </div>
          <PermissionsField
            permission={CONDITIONS.DECISION_MAKER_CONDITIONS}
            name="conditions"
            component={TextArea}
            displayValue={conditions !== null ? '\n' + conditions : ''}
            label={
              'Consistent with FRPA 112 the following conditions are imposed and form part of the RUP approval:'
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
                  header={strings.CONDITIONS}
                  content={strings.CONDITIONS_TIP_RANGE_OFFICER}
                  size="tiny"
                />
              </div>
            </div>
            <PermissionsField
              permission={CONDITIONS.RANGE_OFFICER_CONDITIONS}
              name="proposedConditions"
              component={TextArea}
              displayValue={
                proposedConditions !== null ? '\n' + proposedConditions : ''
              }
              label={
                'Consistent with FRPA 112 the following conditions are imposed and form part of the RUP approval:'
              }
              fieldProps={{ required: false }}
              fast
            />
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
