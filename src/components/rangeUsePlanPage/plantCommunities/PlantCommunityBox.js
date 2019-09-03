import React from 'react'
import PropTypes from 'prop-types'
import { CollapsibleBox } from '../../common'
import {
  IMAGE_SRC,
  PURPOSE_OF_ACTION as PurposeOfAction,
  REFERENCE_KEY
} from '../../../constants/variables'
import { capitalize } from '../../../utils'
import { Icon } from 'semantic-ui-react'
import RangeReadinessBox from './criteria/RangeReadinessBox'
import StubbleHeightBox from './criteria/StubbleHeightBox'
import ShrubUseBox from './criteria/ShrubUseBox'
import MonitoringAreaList from './monitoringArea'
import {
  ASPECT,
  ELEVATION,
  APPROVED_BY_MINISTER,
  PLANT_COMMUNITY_NOTES,
  COMMUNITY_URL,
  PURPOSE_OF_ACTION
} from '../../../constants/strings'
import PlantCommunityActionsBox from './PlantCommunityActionsBox'
import PermissionsField from '../../common/PermissionsField'
import { PLANT_COMMUNITY } from '../../../constants/fields'
import { Input, Dropdown, Checkbox, TextArea } from 'formik-semantic-ui'
import { useReferences } from '../../../providers/ReferencesProvider'

const PlantCommunityBox = ({
  plantCommunity,
  activeIndex,
  index,
  onClick,
  namespace
}) => {
  const {
    name,
    plantCommunityActions,
    purposeOfAction: poa,
    aspect,
    elevation,
    url,
    approved,
    notes,
    communityType,
    monitoringAreas
  } = plantCommunity
  const communityTypeName = (communityType && communityType.name) || name
  const purposeOfAction = capitalize(poa)

  const elevationTypes = useReferences()[
    REFERENCE_KEY.PLANT_COMMUNITY_ELEVATION
  ]
  const elevationOptions = elevationTypes.map(type => ({
    key: type.id,
    value: type.id,
    text: type.name
  }))

  const purposeOptions = [
    {
      key: 'none',
      value: 'none',
      text: 'Clear'
    },
    {
      key: 'maintain',
      value: 'maintain',
      text: 'Maintain Plant Community'
    },
    {
      key: 'establish',
      value: 'establish',
      text: 'Establish Plant Community'
    }
  ]

  return (
    <CollapsibleBox
      key={communityType}
      contentIndex={index}
      activeContentIndex={activeIndex}
      onContentClick={onClick}
      scroll={true}
      header={
        <div className="rup__plant-community__title">
          <div className="rup__plant-community__title__left">
            <img src={IMAGE_SRC.PLANT_COMMUNITY_ICON} alt="community icon" />
            <div style={{ textAlign: 'left' }}>
              Plant Community: {communityTypeName}
            </div>
          </div>
          <div className="rup__plant-community__title__right">
            <div>
              {'Minister approval for inclusion obtained: '}
              {approved ? (
                <Icon name="check circle" color="green" />
              ) : (
                <Icon name="remove circle" color="red" />
              )}
            </div>
          </div>
        </div>
      }
      collapsibleContent={
        <>
          <div className="rup__plant-community__content-title">
            Basic Plant Community Information
          </div>
          <div className="rup__row">
            <div className="rup__cell-4">
              <PermissionsField
                name={`${namespace}.aspect`}
                permission={PLANT_COMMUNITY.ASPECT}
                component={Input}
                displayValue={aspect}
                label={ASPECT}
              />
            </div>
            <div className="rup__cell-4">
              <PermissionsField
                permission={PLANT_COMMUNITY.ELEVATION}
                name={`${namespace}.elevation`}
                component={Dropdown}
                options={elevationOptions}
                displayValue={elevationTypes[elevation].name}
                label={ELEVATION}
              />
            </div>
            <PermissionsField
              name={`${namespace}.approved`}
              permission={PLANT_COMMUNITY.APPROVED}
              component={Checkbox}
              displayValue={approved}
              label={APPROVED_BY_MINISTER}
              inputProps={{
                toggle: true
              }}
            />
          </div>
          <PermissionsField
            name={`${namespace}.notes`}
            permission={PLANT_COMMUNITY.NOTES}
            component={TextArea}
            displayValue={notes}
            label={PLANT_COMMUNITY_NOTES}
          />

          <PermissionsField
            name={`${namespace}.url`}
            permission={PLANT_COMMUNITY.COMMUNITY_URL}
            component={Input}
            displayValue={url}
            label={COMMUNITY_URL}
          />

          <PermissionsField
            permission={PLANT_COMMUNITY.PURPOSE_OF_ACTION}
            name={`${namespace}.purposeOfAction`}
            component={Dropdown}
            options={purposeOptions}
            displayValue={purposeOfAction}
            label={PURPOSE_OF_ACTION}
          />

          {!(
            purposeOfAction === PurposeOfAction.NONE ||
            plantCommunityActions.length === 0
          ) && (
            <>
              <div className="rup__plant-community__content-title">
                Plant Community Actions
              </div>
              <PlantCommunityActionsBox
                plantCommunityActions={plantCommunityActions}
              />
            </>
          )}

          <div className="rup__plant-community__content-title">Criteria</div>

          <RangeReadinessBox
            plantCommunity={plantCommunity}
            namespace={namespace}
          />

          <StubbleHeightBox
            plantCommunity={plantCommunity}
            namespace={namespace}
          />

          <ShrubUseBox plantCommunity={plantCommunity} />

          <div className="rup__plant-community__content-title">
            Monitoring Areas
          </div>
          <MonitoringAreaList
            monitoringAreas={monitoringAreas}
            namespace={`${namespace}.monitoringAreas`}
          />
        </>
      }
    />
  )
}

PlantCommunityBox.propTypes = {
  plantCommunity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    plantCommunityActions: PropTypes.array.isRequired,
    purposeOfAction: PropTypes.string.isRequired,
    aspect: PropTypes.string.isRequired,
    elevation: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    approved: PropTypes.bool.isRequired,
    notes: PropTypes.string.isRequired,
    communityType: PropTypes.object,
    communityTypeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    monitoringAreas: PropTypes.array.isRequired
  }),
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  namespace: PropTypes.string.isRequired
}

export default PlantCommunityBox
