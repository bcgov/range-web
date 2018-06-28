import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Table, Icon } from 'semantic-ui-react';
import * as utils from '../../../utils';
import * as strings from '../../../constants/strings';
import { REFERENCE_KEY } from '../../../constants/variables';

const propTypes = {
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  grazingScheduleEntriesMap: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  // plan: PropTypes.shape({}).isRequired,
  status: PropTypes.shape({}).isRequired,
  usages: PropTypes.arrayOf(PropTypes.object).isRequired,
  // livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class RupGrazingSchedules extends Component {
  state = {
    activeScheduleIndex: 0,
  }

  onScheduleClicked = scheduleIndex => () => {
    const newIndex = this.state.activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;
    this.setState({ activeScheduleIndex: newIndex });
  }

  renderSchedules = (grazingSchedules) => {
    if (utils.isStatusDraft(this.props.status)) {
      return (
        <div className="rup__schedule__draft-container">
          <div className="rup__schedule__in-draft">
            <Icon name="lock" size="big" />
            <div style={{ marginLeft: '10px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}> RUP Awaiting Input from Agreement Holder </div>
              <div style={{ opacity: '0.7' }}> This section will remain hidden until the agreement holder submits for staff reviews. </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      grazingSchedules.length === 0 ? (
        <div className="rup__section-not-found">{strings.NOT_PROVIDED}</div>
      ) : (
        grazingSchedules.map(this.renderSchedule)
      )
    );
  }

  renderSchedule = (schedule, scheduleIndex) => {
    const { usages, references, pasturesMap, grazingScheduleEntriesMap } = this.props;
    const grazingScheduleEntries = utils.getObjValues(grazingScheduleEntriesMap);
    const { id, year } = schedule;
    const yearUsage = usages.find(u => u.year === year);
    const authorizedAUMs = yearUsage && yearUsage.authorizedAum;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const crownTotalAUMs = utils.roundTo1Decimal(utils.calcCrownTotalAUMs(grazingScheduleEntries, pasturesMap, livestockTypes));
    const isScheduleActive = this.state.activeScheduleIndex === scheduleIndex;

    return (
      <li key={id} className="rup__schedule">
        <div className="rup__schedule__header">
          <button
            className="rup__schedule__header__title"
            onClick={this.onScheduleClicked(scheduleIndex)}
          >
            <div>{year} Grazing Schedule</div>
            {isScheduleActive &&
              <Icon name="chevron up" />
            }
            {!isScheduleActive &&
              <Icon name="chevron down" />
            }
          </button>
        </div>
        <div className={classnames('rup__schedule__content', { 'rup__schedule__content__hidden': !isScheduleActive })} >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{strings.PASTURE}</Table.HeaderCell>
                <Table.HeaderCell>{strings.LIVESTOCK_TYPE}</Table.HeaderCell>
                <Table.HeaderCell>{strings.NUM_OF_ANIMALS}</Table.HeaderCell>
                <Table.HeaderCell>{strings.DATE_IN}</Table.HeaderCell>
                <Table.HeaderCell>{strings.DATE_OUT}</Table.HeaderCell>
                <Table.HeaderCell>{strings.DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{strings.GRACE_DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{strings.PLD}</Table.HeaderCell>
                <Table.HeaderCell>{strings.CROWN_AUMS}</Table.HeaderCell>
              </Table.Row>
              {grazingScheduleEntries.map(this.renderScheduleEntry)}
            </Table.Header>
          </Table>
          <div className="rup__schedule__content__AUMs" style={{ marginTop: '10px' }}>
            <div className="rup__schedule__content__AUM-label">Authorized AUMs</div>
            <div className="rup__schedule__content__AUM-number">{authorizedAUMs}</div>
            <div className="rup__schedule__content__AUM-label">Total AUMs</div>
            <div className="rup__schedule__content__AUM-number">{crownTotalAUMs}</div>
          </div>
        </div>
      </li>
    );
  }

  renderScheduleEntry = (entry) => {
    const { references, pasturesMap } = this.props;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const {
      id,
      pastureId,
      livestockTypeId,
      livestockCount,
      dateIn,
      dateOut,
      graceDays,
    } = entry || {};

    const days = utils.calcDateDiff(dateOut, dateIn, false);
    const pasture = pasturesMap[pastureId];
    const pldPercent = pasture && pasture.pldPercent;
    const pastureName = pasture && pasture.name;
    const livestockType = livestockTypes.find(lt => lt.id === livestockTypeId);
    const livestockTypeName = livestockType && livestockType.name;
    const auFactor = livestockType && livestockType.auFactor;

    const totalAUMs = utils.calcTotalAUMs(livestockCount, days, auFactor);
    const pldAUMs = utils.roundTo1Decimal(utils.calcPldAUMs(totalAUMs, pldPercent));
    const crownAUMs = utils.roundTo1Decimal(utils.calcCrownAUMs(totalAUMs, pldAUMs));

    return (
      <Table.Row key={id}>
        <Table.Cell>{utils.presentNullValue(pastureName, false)}</Table.Cell>
        <Table.Cell>{utils.presentNullValue(livestockTypeName, false)}</Table.Cell>
        <Table.Cell collapsing>{utils.presentNullValue(livestockCount, false)}</Table.Cell>
        <Table.Cell>{utils.formatDateFromServer(dateIn, false)}</Table.Cell>
        <Table.Cell>{utils.formatDateFromServer(dateOut, false)}</Table.Cell>
        <Table.Cell collapsing>{utils.presentNullValue(days, false)}</Table.Cell>
        <Table.Cell collapsing>{utils.presentNullValue(graceDays, false)}</Table.Cell>
        <Table.Cell collapsing>{utils.presentNullValue(pldAUMs, false)}</Table.Cell>
        <Table.Cell collapsing>{utils.presentNullValue(crownAUMs, false)}</Table.Cell>
      </Table.Row>
    );
  }
  render() {
    const { grazingSchedulesMap } = this.props;
    const grazingSchedules = utils.getObjValues(grazingSchedulesMap) || [];

    return (
      <div className="rup__schedules__container">
        <div className="rup__title">Schedules</div>
        <div className="rup__divider" />
        <ul className={classnames('rup__schedules', { 'rup__schedules--empty': grazingSchedules.length === 0 })}>
          {this.renderSchedules(grazingSchedules)}
        </ul>
      </div>
    );
  }
}

RupGrazingSchedules.propTypes = propTypes;
export default RupGrazingSchedules;
