import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Table, Icon } from 'semantic-ui-react';
import {
  formatDateFromServer,
  presentNullValue,
  calcDateDiff,
  calcCrownAUMs,
  calcPldAUMs,
  calcTotalAUMs,
  calcCrownTotalAUMs,
  roundTo1Decimal,
} from '../../../handlers';
import {
  PASTURE, LIVESTOCK_TYPE, DATE_IN, DATE_OUT,
  DAYS, NUM_OF_ANIMALS, GRACE_DAYS, PLD,
  CROWN_AUMS, NOT_PROVIDED,
} from '../../../constants/strings';
import { PlanStatus } from '../../../models';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  status: PropTypes.shape({}).isRequired,
  usages: PropTypes.arrayOf(PropTypes.object).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class RupSchedules extends Component {
  state = {
    activeScheduleIndex: 0,
  }

  onScheduleClicked = scheduleIndex => () => {
    const newIndex = this.state.activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;

    this.setState({ activeScheduleIndex: newIndex });
  }

  renderSchedules = (grazingSchedules) => {
    const status = new PlanStatus(this.props.status);

    if (status.isInDraft) {
      return (
        <div className="rup__schedule__draft-container">
          <div className="rup__schedule__in-draft">
            <Icon name="lock" size="big" />
            <div style={{ marginLeft: '10px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}> RUP Awaiting Input from Agreement Holder </div>
              <div style={{ opacity: '0.7' }}> RUP will remain hidden until the agreement holder submits for staff reviews. </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      grazingSchedules.length === 0 ? (
        <div className="rup__section-not-found">{NOT_PROVIDED}</div>
      ) : (
        grazingSchedules.map(this.renderSchedule)
      )
    );
  }

  renderSchedule = (schedule, scheduleIndex) => {
    const { usages, plan, livestockTypes } = this.props;
    const { id, year, grazingScheduleEntries = [] } = schedule;
    const yearUsage = usages.find(u => u.year === year);
    const authorizedAUMs = yearUsage && yearUsage.authorizedAum;
    const pastures = plan && plan.pastures;
    const crownTotalAUMs = roundTo1Decimal(calcCrownTotalAUMs(grazingScheduleEntries, pastures, livestockTypes));
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
                <Table.HeaderCell>{PASTURE}</Table.HeaderCell>
                <Table.HeaderCell>{LIVESTOCK_TYPE}</Table.HeaderCell>
                <Table.HeaderCell>{NUM_OF_ANIMALS}</Table.HeaderCell>
                <Table.HeaderCell>{DATE_IN}</Table.HeaderCell>
                <Table.HeaderCell>{DATE_OUT}</Table.HeaderCell>
                <Table.HeaderCell>{DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{GRACE_DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{PLD}</Table.HeaderCell>
                <Table.HeaderCell>{CROWN_AUMS}</Table.HeaderCell>
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
    const { livestockTypes, plan } = this.props;
    const pastures = plan && plan.pastures;
    const {
      id,
      pastureId,
      livestockTypeId,
      livestockCount,
      dateIn,
      dateOut,
    } = entry || {};

    const days = calcDateDiff(dateOut, dateIn, false);
    const pasture = pastures.find(p => p.id === pastureId);
    const graceDays = pasture && pasture.graceDays;
    const pldPercent = pasture && pasture.pldPercent;
    const pastureName = pasture && pasture.name;
    const livestockType = livestockTypes.find(lt => lt.id === livestockTypeId);
    const livestockTypeName = livestockType && livestockType.name;
    const auFactor = livestockType && livestockType.auFactor;

    const totalAUMs = calcTotalAUMs(livestockCount, days, auFactor);
    const pldAUMs = roundTo1Decimal(calcPldAUMs(totalAUMs, pldPercent));
    const crownAUMs = roundTo1Decimal(calcCrownAUMs(totalAUMs, pldAUMs));

    return (
      <Table.Row key={id}>
        <Table.Cell>{presentNullValue(pastureName, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(livestockTypeName, false)}</Table.Cell>
        <Table.Cell collapsing>{presentNullValue(livestockCount, false)}</Table.Cell>
        <Table.Cell>{formatDateFromServer(dateIn, false)}</Table.Cell>
        <Table.Cell>{formatDateFromServer(dateOut, false)}</Table.Cell>
        <Table.Cell collapsing>{presentNullValue(days, false)}</Table.Cell>
        <Table.Cell collapsing>{presentNullValue(graceDays, false)}</Table.Cell>
        <Table.Cell collapsing>{presentNullValue(pldAUMs, false)}</Table.Cell>
        <Table.Cell collapsing>{presentNullValue(crownAUMs, false)}</Table.Cell>
      </Table.Row>
    );
  }
  render() {
    const { plan } = this.props;
    const grazingSchedules = (plan && plan.grazingSchedules) || [];

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

RupSchedules.propTypes = propTypes;
export default RupSchedules;
