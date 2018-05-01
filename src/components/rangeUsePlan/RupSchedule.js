import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { formatDateFromServer, presentNullValue, calcDateDiff } from '../../handlers';
import {
  PASTURE, LIVESTOCK_TYPE, DATE_IN, DATE_OUT,
  DAYS, NUM_OF_ANIMALS, GRACE_DAYS, PLD,
  CROWN_AUMS, NOT_PROVIDED,
} from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
};

class RupSchedule extends Component {
  renderSchedule = (schedule) => {
    const { id, year, grazingScheduleEntries = [] } = schedule;

    return (
      <div key={id} className="rup__schedule">
        <div className="rup__schedule__header">
          {year} Grazing Schedule
        </div>
        <div className="rup__schedule__table">
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
        </div>
      </div>
    );
  }

  renderScheduleEntry = (entry) => {
    const {
      id,
      pasture,
      livestockType,
      livestockCount,
      dateIn,
      dateOut,
      graceDays,
    } = entry;
    const days = calcDateDiff(dateOut, dateIn);
    const pastureName = pasture && pasture.name;
    const pldPercent = pasture && pasture.pldPercent;
    const allowableAum = pasture && pasture.allowableAum;
    const livestockTypeName = livestockType && livestockType.name;

    return (
      <Table.Row key={id}>
        <Table.Cell>{presentNullValue(pastureName, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(livestockTypeName, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(livestockCount, false)}</Table.Cell>
        <Table.Cell>{formatDateFromServer(dateIn)}</Table.Cell>
        <Table.Cell>{formatDateFromServer(dateOut)}</Table.Cell>
        <Table.Cell>{presentNullValue(days, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(graceDays, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(pldPercent, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(allowableAum, false)}</Table.Cell>
      </Table.Row>
    );
  }
  render() {
    const { className, plan } = this.props;
    const grazingSchedules = (plan && plan.grazingSchedules) || [];

    return (
      <div className={className}>
        <div className="rup__title">Schedules</div>
        <div className="rup__divider" />
        {
          grazingSchedules.length === 0 ? (
            <div className="rup__section-not-found">{NOT_PROVIDED}</div>
          ) : (
            grazingSchedules.map(this.renderSchedule)
          )
        }
      </div>
    );
  }
}

RupSchedule.propTypes = propTypes;
export default RupSchedule;
