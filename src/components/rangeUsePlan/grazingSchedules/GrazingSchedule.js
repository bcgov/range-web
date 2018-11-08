import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Table, Icon } from 'semantic-ui-react';
import * as utils from '../../../utils';
import * as strings from '../../../constants/strings';
import { REFERENCE_KEY } from '../../../constants/variables';
import GrazingScheduleEntryRow from './GrazingScheduleEntryRow';

class GrazingSchedule extends Component {
  static propTypes = {
    schedule: PropTypes.shape({}).isRequired,
    scheduleIndex: PropTypes.number.isRequired,
    activeScheduleIndex: PropTypes.number.isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
    onScheduleClicked: PropTypes.func.isRequired,
  };

  renderScheduleEntry = (entry) => {
    return (
      <GrazingScheduleEntryRow
        key={entry.id}
        entry={entry}
        {...this.props}
      />
    );
  }

  render() {
    const {
      schedule,
      scheduleIndex,
      activeScheduleIndex,
      onScheduleClicked,
      usage,
      references,
      pasturesMap,
    } = this.props;
    const grazingScheduleEntries = schedule.grazingScheduleEntries || [];
    const { id, year, narative } = schedule;
    const yearUsage = usage.find(u => u.year === year);
    const authorizedAUMs = yearUsage && yearUsage.authorizedAum;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const crownTotalAUMs = utils.roundTo1Decimal(utils.calcCrownTotalAUMs(grazingScheduleEntries, pasturesMap, livestockTypes));
    const isScheduleActive = activeScheduleIndex === scheduleIndex;

    return (
      <li key={id} className="rup__grazing-schedule">
        <div className="rup__grazing-schedule__header">
          <button
            className="rup__grazing-schedule__header__title"
            onClick={onScheduleClicked(scheduleIndex)}
          >
            <div>
              {`${year} Grazing Schedule`}
            </div>
            {isScheduleActive &&
              <Icon name="chevron up" />
            }
            {!isScheduleActive &&
              <Icon name="chevron down" />
            }
          </button>
        </div>
        <div className={classnames('rup__grazing-schedule__content', { 'rup__grazing-schedule__content__hidden': !isScheduleActive })}>
          <Table unstackable>
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
          <div className="rup__grazing-schedule__content__AUMs" style={{ marginTop: '10px' }}>
            <div className="rup__grazing-schedule__content__AUM-label">Authorized AUMs</div>
            <div className="rup__grazing-schedule__content__AUM-number">{authorizedAUMs}</div>
            <div className="rup__grazing-schedule__content__AUM-label">Total AUMs</div>
            <div className="rup__grazing-schedule__content__AUM-number">{crownTotalAUMs}</div>
          </div>
          <div>
            <div className="rup__grazing-schedule__content__narative__title">Schedule Description</div>
            {utils.handleNullValue(narative)}
          </div>
        </div>
      </li>
    );
  }
}

export default GrazingSchedule;
