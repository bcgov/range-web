import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { formatDate, presentNullValue } from '../../handlers';

import {
  PASTURE, LIVESTOCK_TYPE, DATE_IN, DATE_OUT,
  DAYS, NUM_OF_ANIMALS, GRACE_DAYS, PLD,
  CROWN_AUMS, NOT_PROVIDED,
} from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
};

class RupSchedules extends Component {
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
        <div className="rup__sub-divider" />
      </div>
    );
  }

  renderScheduleEntry = (entry) => {
    const {
      id,
      pasture = {},
      livestockType = {},
      livestockCount,
      dateIn,
      dateOut,
      graceDays,
    } = entry;
    const days = 0;
    return (
      <Table.Row key={id}>
        <Table.Cell>{presentNullValue(pasture.name, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(livestockType.name, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(livestockCount, false)}</Table.Cell>
        <Table.Cell>{formatDate(dateIn)}</Table.Cell>
        <Table.Cell>{formatDate(dateOut)}</Table.Cell>
        <Table.Cell>{presentNullValue(days, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(graceDays, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(pasture.pldPercent, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(pasture.allowableAum, false)}</Table.Cell>
      </Table.Row>
    );
  }
  render() {
    const { className, plan } = this.props;
    const { grazingSchedules = [] } = plan;
    // const grazingSchedules = [
    //   {
    //     id: 1,
    //     year: 2017,
    //     grazingScheduleEntries: [
    //         {
    //           dateIn: "2018-03-15T16:52:37.658Z",
    //           dateOut: "2018-03-17T16:52:37.658Z",
    //           pastureId: 3,
    //           livestockCount: 1,
    //           livestockTypeId: 1,
    //         },
    //     ],
    //   },
    // ];
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

RupSchedules.propTypes = propTypes;
export default RupSchedules;
