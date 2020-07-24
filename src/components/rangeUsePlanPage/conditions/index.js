import React from 'react'
import PropTypes from 'prop-types'
import { InfoTip } from '../../common'
import { CONDITIONS } from '../../../constants/fields'
import * as strings from '../../../constants/strings'
import PermissionsField from '../../common/PermissionsField'
import { TextArea } from 'formik-semantic-ui'

const Conditions = ({ plan }) => {
  const { conditions = '' } = plan || {}

  return (
    <div className="rup__conditions">
      <div className="rup__popup-header">
        <div className="rup__content-title">{strings.CONDITIONS}</div>
        <InfoTip header={strings.CONDITIONS} content={strings.CONDITIONS_TIP} />
      </div>
      <div className="rup__divider" style={{ marginBottom: 10 }} />
      <div className="rup__row">
        <div className="rup__cell-6" style={{ marginBottom: 40 }}>
          <PermissionsField
            permission={CONDITIONS}
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
      </div>
    </div>
  )
}

Conditions.propTypes = {
  plan: PropTypes.shape({}).isRequired
}

export default Conditions
