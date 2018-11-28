import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Checkbox } from 'semantic-ui-react';
import { ASPECT, ELEVATION, APPROVED_BY_MINISTER, PLANT_COMMUNITY_NOTES, COMMUNITY_URL, PURPOSE_OF_ACTION } from '../../../constants/strings';
import { PURPOSE_OF_ACTION as PurposeOfAction } from '../../../constants/variables';
import { handleNullValue, capitalize } from '../../../utils';
import PlantCommunityActionsBox from './PlantCommunityActionsBox';
import MonitoringAreasBox from './MonitoringAreasBox';
import RangeReadinessBox from './RangeReadinessBox';
import StubbleHeightBox from './StubbleHeightBox';
import ShrubUseBox from './ShrubUseBox';

class PlantCommunityModal extends Component {
  static propTypes = {
    plantCommunity: PropTypes.shape({}).isRequired,
    pasture: PropTypes.shape({}).isRequired,
  }

  renderPlantCommunityActions = (modalClass, purposeOfAction, plantCommunityActions = []) => {
    if (
      purposeOfAction === PurposeOfAction.NONE ||
      plantCommunityActions.length === 0
    ) return <Fragment />;

    return (
      <Fragment>
        <div className={`${modalClass}__content-title`}>
          Pasture Actions
        </div>
        <PlantCommunityActionsBox
          plantCommunityActions={plantCommunityActions}
        />
      </Fragment>
    );
  }

  renderMonitoringAreas = (modalClass, monitoringAreas = []) => {
    if (monitoringAreas.length === 0) return <Fragment />;

    return (
      <Fragment>
        <div className={`${modalClass}__content-title`}>
          Monitoring Areas
        </div>
        <MonitoringAreasBox
          monitoringAreas={monitoringAreas}
        />
      </Fragment>
    );
  }

  render() {
    const { plantCommunity, pasture } = this.props;
    const {
      name,
      monitoringAreas,
      plantCommunityActions,
      purposeOfAction: poa,
      aspect,
      elevation,
      url,
      approved,
      notes,
      communityType,
    } = plantCommunity;
    const communityTypeName = communityType && communityType.name;
    const pastureName = pasture && pasture.name;
    const modalClass = 'rup__plant-community__modal';
    const elevationName = elevation && elevation.name;
    const purposeOfAction = capitalize(poa);
    console.log(plantCommunity);

    return (
      <Modal
        dimmer="blurring"
        closeIcon
        trigger={
          <div className="rup__plant-community__box">
            <div>Plant Community: {communityTypeName}</div>
            <div className="rup__plant-community__box__right">
              <div>
                {'Minister approval for inclusion obtained: '}
                { approved
                  ? <Icon name="check circle" color="green" />
                  : <Icon name="remove circle" color="red" />
                }
              </div>
              <Icon size="large" name="angle right" />
            </div>
          </div>
        }
      >
        <Modal.Content>
          <div className={`${modalClass}__header`}>Plant Community: {communityTypeName}</div>
          <div className={`${modalClass}__pasture`}>Pasture: {pastureName}</div>
          <div className={`${modalClass}__content-title`}>
            Basic Plant Community Information
          </div>
          <div className="rup__row">
            <div className="rup__cell-4">
              <div className={`${modalClass}__label`}>{ASPECT}</div>
              <div className={`${modalClass}__text`}>{handleNullValue(aspect)}</div>
            </div>
            <div className="rup__cell-4">
              <div className={`${modalClass}__label`}>{ELEVATION}</div>
              <div className={`${modalClass}__text`}>{handleNullValue(elevationName)}</div>
            </div>
            <div className="rup__cell-4">
              <div className={`${modalClass}__label`}>{APPROVED_BY_MINISTER}</div>
              <div className={`${modalClass}__text`}>
                <Checkbox checked={approved} toggle />
              </div>
            </div>
          </div>
          <div className={`${modalClass}__label`}>{PLANT_COMMUNITY_NOTES}</div>
          <div className={`${modalClass}__text`}>{handleNullValue(notes)}</div>
          <div className={`${modalClass}__label`}>{COMMUNITY_URL}</div>
          <div className={`${modalClass}__text`}>{handleNullValue(url)}</div>
          <div className={`${modalClass}__label`}>{PURPOSE_OF_ACTION}</div>
          <div className={`${modalClass}__text`}>{handleNullValue(purposeOfAction)}</div>

          {this.renderPlantCommunityActions(modalClass, purposeOfAction, plantCommunityActions)}

          {/* {this.renderMonitoringAreas(modalClass, monitoringAreas)} */}

          <div className={`${modalClass}__content-title`}>
            Criteria
          </div>

          <RangeReadinessBox
            plantCommunity={plantCommunity}
          />

          <StubbleHeightBox
            plantCommunity={plantCommunity}
          />

          <ShrubUseBox
            plantCommunity={plantCommunity}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default PlantCommunityModal;
