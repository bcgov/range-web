import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Checkbox } from 'semantic-ui-react';
import { ASPECT, ELEVATION, APPROVED_BY_MINISTER, PLANT_COMMUNITY_NOTES, COMMUNITY_URL, PURPOSE_OF_ACTION } from '../../../constants/strings';
import { PURPOSE_OF_ACTION as PurposeOfAction, IMAGE_SRC } from '../../../constants/variables';
import { handleNullValue, capitalize } from '../../../utils';
import PlantCommunityActionsBox from './PlantCommunityActionsBox';
import MonitoringAreas from './MonitoringAreas';
import RangeReadinessBox from './RangeReadinessBox';
import StubbleHeightBox from './StubbleHeightBox';
import ShrubUseBox from './ShrubUseBox';

class PlantCommunityModal extends Component {
  static propTypes = {
    plantCommunity: PropTypes.shape({}).isRequired,
    pasture: PropTypes.shape({}).isRequired,
  }

  renderPlantCommunityActions = (pcClass, purposeOfAction, plantCommunityActions = []) => {
    if (
      purposeOfAction === PurposeOfAction.NONE ||
      plantCommunityActions.length === 0
    ) return <Fragment />;

    return (
      <Fragment>
        <div className={`${pcClass}__modal__content-title`}>
          Pasture Actions
        </div>
        <PlantCommunityActionsBox
          plantCommunityActions={plantCommunityActions}
        />
      </Fragment>
    );
  }

  renderMonitoringAreas = (pcClass, monitoringAreas = []) => {
    if (monitoringAreas.length === 0) return <Fragment />;

    return (
      <Fragment>
        <div className={`${pcClass}__modal__content-title`}>
          Monitoring Areas
        </div>
        <MonitoringAreas
          monitoringAreas={monitoringAreas}
        />
      </Fragment>
    );
  }

  render() {
    const { plantCommunity, pasture } = this.props;
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
      monitoringAreas,
    } = plantCommunity;
    const communityTypeName = (communityType && communityType.name) || name;
    const pastureName = pasture && pasture.name;
    const pcClass = 'rup__plant-community';
    const elevationName = elevation && elevation.name;
    const purposeOfAction = capitalize(poa);

    return (
      <Modal
        dimmer="blurring"
        closeIcon
        trigger={
          <div className={`${pcClass}__box`}>
            <div className={`${pcClass}__box__left`}>
              <img src={IMAGE_SRC.PLANT_COMMUNITY_ICON} alt="community icon" />
              Plant Community: {communityTypeName}
            </div>
            <div className={`${pcClass}__box__right`}>
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
          <div className={`${pcClass}__modal__header`}>
            <img src={IMAGE_SRC.PLANT_COMMUNITY_ICON} alt="community icon" />
            Plant Community: {communityTypeName}
          </div>
          <div className={`${pcClass}__modal__pasture`}>Pasture: {pastureName}</div>
          <div className={`${pcClass}__modal__content-title`}>
            Basic Plant Community Information
          </div>
          <div className="rup__row">
            <div className="rup__cell-4">
              <div className={`${pcClass}__modal__label`}>{ASPECT}</div>
              <div className={`${pcClass}__modal__text`}>{handleNullValue(aspect)}</div>
            </div>
            <div className="rup__cell-4">
              <div className={`${pcClass}__modal__label`}>{ELEVATION}</div>
              <div className={`${pcClass}__modal__text`}>{handleNullValue(elevationName)}</div>
            </div>
            <div className="rup__cell-4">
              <div className={`${pcClass}__modal__label`}>{APPROVED_BY_MINISTER}</div>
              <div className={`${pcClass}__modal__text`}>
                <Checkbox checked={approved} toggle />
              </div>
            </div>
          </div>
          <div className={`${pcClass}__modal__label`}>{PLANT_COMMUNITY_NOTES}</div>
          <div className={`${pcClass}__modal__text`}>{handleNullValue(notes)}</div>
          <div className={`${pcClass}__modal__label`}>{COMMUNITY_URL}</div>
          <div className={`${pcClass}__modal__text`}>{handleNullValue(url)}</div>
          <div className={`${pcClass}__modal__label`}>{PURPOSE_OF_ACTION}</div>
          <div className={`${pcClass}__modal__text`}>{handleNullValue(purposeOfAction)}</div>

          {this.renderPlantCommunityActions(pcClass, purposeOfAction, plantCommunityActions)}

          <div className={`${pcClass}__modal__content-title`}>
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

          {this.renderMonitoringAreas(pcClass, monitoringAreas)}
        </Modal.Content>
      </Modal>
    );
  }
}

export default PlantCommunityModal;
