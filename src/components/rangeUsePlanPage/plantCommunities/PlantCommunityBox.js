import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Checkbox } from 'semantic-ui-react'
import { CollapsibleBox } from '../../common'

import {
  ASPECT,
  ELEVATION,
  APPROVED_BY_MINISTER,
  PLANT_COMMUNITY_NOTES,
  COMMUNITY_URL,
  PURPOSE_OF_ACTION
} from '../../../constants/strings'
import {
  PURPOSE_OF_ACTION as PurposeOfAction,
  IMAGE_SRC
} from '../../../constants/variables'
import {
  handleNullValue,
  capitalize,
  isUserAgreementHolder
} from '../../../utils'
import PlantCommunityActionsBox from './PlantCommunityActionsBox'
import MonitoringAreaList from './monitoringArea'
import RangeReadinessBox from './critera/RangeReadinessBox'
import StubbleHeightBox from './critera/StubbleHeightBox'
import ShrubUseBox from './critera/ShrubUseBox'
import { getUser } from '../../../reducers/rootReducer'

class PlantCommunityBox extends Component {
  static propTypes = {
    plantCommunity: PropTypes.shape({}).isRequired,
    activePlantCommunityId: PropTypes.number.isRequired,
    onPlantCommunityClicked: PropTypes.func.isRequired,
    user: PropTypes.shape({}).isRequired
  }

  renderPlantCommunityActions = (
    purposeOfAction,
    plantCommunityActions = []
  ) => {
    if (
      purposeOfAction === PurposeOfAction.NONE ||
      plantCommunityActions.length === 0
    ) {
      return null
    }

    return (
      <Fragment>
        <div className="rup__plant-community__content-title">
          Plant Community Actions
        </div>
        <PlantCommunityActionsBox
          plantCommunityActions={plantCommunityActions}
        />
      </Fragment>
    )
  }

  render() {
    const {
      plantCommunity,
      activePlantCommunityId,
      onPlantCommunityClicked
    } = this.props
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

    return (
      <CollapsibleBox
        key={communityType}
        contentIndex={communityTypeId}
        activeContentIndex={activePlantCommunityId}
        onContentClicked={onPlantCommunityClicked}
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
          <Fragment>
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
              {!isUserAgreementHolder(this.props.user) && (
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

            {this.renderPlantCommunityActions(
              purposeOfAction,
              plantCommunityActions
            )}

            <div className="rup__plant-community__content-title">Criteria</div>

            <RangeReadinessBox plantCommunity={plantCommunity} />

            <StubbleHeightBox plantCommunity={plantCommunity} />

            <ShrubUseBox plantCommunity={plantCommunity} />

            <div className="rup__plant-community__content-title">
              Monitoring Areas
            </div>
            <MonitoringAreaList monitoringAreas={monitoringAreas} />
          </Fragment>
        }
      />
    )
  }
}

const mapStateToProps = state => ({
  user: getUser(state)
})
export default connect(
  mapStateToProps,
  null
)(PlantCommunityBox)
