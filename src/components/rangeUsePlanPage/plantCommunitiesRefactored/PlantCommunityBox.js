import React from 'react'
import PropTypes from 'prop-types'
import { CollapsibleBox } from '../../common'
import {
  IMAGE_SRC,
  PURPOSE_OF_ACTION as PurposeOfAction
} from '../../../constants/variables'
import {
  capitalize,
  isUserAgreementHolder,
  handleNullValue
} from '../../../utils'
import { Icon, Checkbox } from 'semantic-ui-react'
import RangeReadinessBox from './criteria/RangeReadinessBox'
import StubbleHeightBox from './criteria/StubbleHeightBox'
import ShrubUseBox from './criteria/ShrubUseBox'
import MonitoringAreaList from '../plantCommunities/monitoringArea'
import {
  ASPECT,
  ELEVATION,
  APPROVED_BY_MINISTER,
  PLANT_COMMUNITY_NOTES,
  COMMUNITY_URL,
  PURPOSE_OF_ACTION
} from '../../../constants/strings'
import { useUser } from '../../../providers/UserProvider'
import PlantCommunityActionsBox from './PlantCommunityActionsBox'

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
    communityTypeId,
    monitoringAreas
  } = plantCommunity
  const communityTypeName = (communityType && communityType.name) || name
  const elevationName = elevation && elevation.name
  const purposeOfAction = capitalize(poa)

  const user = useUser()

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
              <div className="rup__plant-community__content__label">
                {ASPECT}
              </div>
              <div className="rup__plant-community__content__text">
                {handleNullValue(aspect)}
              </div>
            </div>
            <div className="rup__cell-4">
              <div className="rup__plant-community__content__label">
                {ELEVATION}
              </div>
              <div className="rup__plant-community__content__text">
                {handleNullValue(elevationName)}
              </div>
            </div>
            {!isUserAgreementHolder(user) && (
              <div className="rup__cell-4">
                <div className="rup__plant-community__content__label">
                  {APPROVED_BY_MINISTER}
                </div>
                <div className="rup__plant-community__content__text">
                  <Checkbox checked={approved} toggle />
                </div>
              </div>
            )}
          </div>
          <div className="rup__plant-community__content__label">
            {PLANT_COMMUNITY_NOTES}
          </div>
          <div className="rup__plant-community__content__text">
            {handleNullValue(notes)}
          </div>
          <div className="rup__plant-community__content__label">
            {COMMUNITY_URL}
          </div>
          <div className="rup__plant-community__content__text">
            {handleNullValue(url)}
          </div>
          <div className="rup__plant-community__content__label">
            {PURPOSE_OF_ACTION}
          </div>
          <div className="rup__plant-community__content__text">
            {handleNullValue(purposeOfAction)}
          </div>

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
          <MonitoringAreaList monitoringAreas={monitoringAreas} />
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
    aspect: PropTypes.number.isRequired,
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
