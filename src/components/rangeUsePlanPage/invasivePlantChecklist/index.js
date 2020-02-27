import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Checkbox as PlainCheckbox } from 'semantic-ui-react'
import { connect } from 'formik'
import { InfoTip } from '../../common'
import PermissionsField, { canUserEdit } from '../../common/PermissionsField'
import * as strings from '../../../constants/strings'
import { INVASIVE_PLANTS } from '../../../constants/fields'
import { Checkbox, TextArea } from 'formik-semantic-ui'
import { useUser } from '../../../providers/UserProvider'
import { useEditable } from '../../../providers/EditableProvider'
import MultiParagraphDisplay from '../../common/MultiParagraphDisplay'

const InvasivePlantChecklist = ({
  namespace,
  invasivePlantChecklist,
  formik
}) => {
  const {
    equipmentAndVehiclesParking,
    beginInUninfestedArea,
    undercarrigesInspected,
    revegetate,
    other
  } = invasivePlantChecklist

  const [otherChecked, setOtherChecked] = useState(!!other)
  const globalIsEditable = useEditable()

  const user = useUser()
  const canEdit = canUserEdit(INVASIVE_PLANTS.ITEMS, user) && globalIsEditable

  return (
    <div className="rup__ip-checklist">
      <div className="rup__popup-header">
        <div className="rup__content-title">{strings.INVASIVE_PLANTS}</div>
        <InfoTip
          header={strings.INVASIVE_PLANTS}
          content={strings.INVASIVE_PLANTS_TIP}
        />
      </div>
      <div className="rup__divider" />
      <div className="rup__ip-checklist__header">
        I commit to carry out the following measures to prevent the introduction
        or spread of invasive plants that are likely the result of my range
        practices:
      </div>
      <div className="rup__ip-checklist__form">
        <Form.Group grouped>
          <Checkbox
            name={`${namespace}.equipmentAndVehiclesParking`}
            component={Checkbox}
            label="Equipment and vehicles will not be parked on invasive plant infestations"
            displayValue={equipmentAndVehiclesParking}
            inputProps={{
              disabled: !canEdit
            }}
          />

          <Checkbox
            name={`${namespace}.beginInUninfestedArea`}
            component={Checkbox}
            label="Any work will begin in un-infested areas before moving to infested locations"
            displayValue={beginInUninfestedArea}
            inputProps={{
              disabled: !canEdit
            }}
          />
          <Checkbox
            name={`${namespace}.undercarrigesInspected`}
            component={Checkbox}
            label="Clothing and vehicle/equipment undercarriages will be regularly inspected for plant parts or propagules if working in an area known to contain invasive plants"
            displayValue={undercarrigesInspected}
            inputProps={{
              disabled: !canEdit
            }}
          />
          <Checkbox
            name={`${namespace}.revegetate`}
            component={Checkbox}
            label="Revegetate disturbed areas that have exposed mineral soil within one year of disturbance by seeding using Common #1 Forage Mixture or better. The certificate of seed analysis will be requested and seed that contains weed seeds of listed invasive plants and/or invasive plants that are high priority to the area will be rejected. Seeding will occur around range developments and areas of cattle congregation where bare soil is exposed. Revegetated areas will be monitored and revegetated as necessary until exposed soil is eliminated."
            displayValue={revegetate}
            inputProps={{
              disabled: !canEdit
            }}
          />

          <PlainCheckbox
            checked={otherChecked}
            label="Other: (Please Describe)"
            disabled={!canEdit}
            onChange={() => {
              setOtherChecked(!otherChecked)
              formik.setFieldValue(`${namespace}.other`, '')
            }}
          />

          {otherChecked && (
            <div className="rup__ip-checklist__form__textarea">
              <PermissionsField
                permission={INVASIVE_PLANTS.ITEMS}
                name={`${namespace}.other`}
                displayValue={other}
                component={TextArea}
                displayComponent={MultiParagraphDisplay}
              />
            </div>
          )}
        </Form.Group>
      </div>
    </div>
  )
}

InvasivePlantChecklist.propTypes = {
  namespace: PropTypes.string.isRequired,
  invasivePlantChecklist: PropTypes.shape({
    equipmentAndVehiclesParking: PropTypes.bool.isRequired,
    beginInUninfestedArea: PropTypes.bool.isRequired,
    undercarrigesInspected: PropTypes.bool.isRequired,
    revegetate: PropTypes.bool.isRequired,
    otherChecked: PropTypes.bool,
    other: PropTypes.string
  }),
  formik: PropTypes.object.isRequired
}

export default memo(connect(InvasivePlantChecklist))
