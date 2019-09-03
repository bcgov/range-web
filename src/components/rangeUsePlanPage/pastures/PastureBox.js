import React from 'react'
import PropTypes from 'prop-types'
import PermissionsField from '../../common/PermissionsField'
import { PASTURES } from '../../../constants/fields'
import { Input } from 'formik-semantic-ui'
import { Dropdown } from 'semantic-ui-react'
import { CollapsibleBox } from '../../common'
import * as strings from '../../../constants/strings'
import { IMAGE_SRC } from '../../../constants/variables'
import PlantCommunities from '../plantCommunities'

const dropdownOptions = [{ key: 'copy', value: 'copy', text: 'Copy' }]

const PastureBox = ({
  pasture,
  index,
  activeIndex,
  onClick,
  onCopy,
  namespace
}) => {
  return (
    <CollapsibleBox
      key={pasture.id}
      contentIndex={index}
      activeContentIndex={activeIndex}
      onContentClick={onClick}
      header={
        <div className="rup__pasture">
          <div className="rup__pasture__title">
            <img src={IMAGE_SRC.PASTURE_ICON} alt="pasture icon" />
            Pasture:
            {activeIndex === index ? (
              <PermissionsField
                name={`${namespace}.name`}
                permission={PASTURES.NAME}
                component={Input}
                displayValue={pasture.name}
                inputProps={{
                  onClick: e => e.stopPropagation()
                }}
              />
            ) : (
              ` ${pasture.name}`
            )}
          </div>

          <Dropdown
            className="rup__pasture__actions"
            trigger={<i className="ellipsis vertical icon" />}
            options={dropdownOptions}
            icon={null}
            pointing="right"
            onClick={e => e.stopPropagation()}
            onChange={(e, { value }) => {
              if (value === 'copy') onCopy()
            }}
            selectOnBlur={false}
          />
        </div>
      }
      collapsibleContent={
        <>
          <div className="rup__row">
            <div className="rup__cell-4">
              <PermissionsField
                name={`${namespace}.allowableAum`}
                permission={PASTURES.ALLOWABLE_AUMS}
                component={Input}
                displayValue={pasture.allowableAum}
                label={strings.ALLOWABLE_AUMS}
              />
            </div>
            <div className="rup__cell-4">
              <PermissionsField
                name={`${namespace}.pldPercent`}
                permission={PASTURES.PLD}
                component={Input}
                displayValue={pasture.pldPercent}
                label={strings.PRIVATE_LAND_DEDUCTION}
              />
            </div>
            <div className="rup__cell-4">
              <PermissionsField
                name={`${namespace}.graceDays`}
                permission={PASTURES.GRACE_DAYS}
                component={Input}
                displayValue={pasture.graceDays}
                label={strings.GRACE_DAYS}
              />
            </div>
          </div>
          <PermissionsField
            name={`${namespace}.notes`}
            permission={PASTURES.NOTES}
            displayValue={pasture.notes}
            component={Input}
            label={strings.PASTURE_NOTES}
            fluid
          />

          <PlantCommunities
            plantCommunities={pasture.plantCommunities}
            namespace={namespace}
            canEdit={true}
          />
        </>
      }
    />
  )
}

PastureBox.propTypes = {
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  pasture: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  namespace: PropTypes.string.isRequired
}

export default PastureBox
