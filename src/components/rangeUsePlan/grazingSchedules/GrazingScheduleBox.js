import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { roundTo1Decimal, calcCrownTotalAUMs, handleNullValue } from '../../../utils';
import * as strings from '../../../constants/strings';
import { REFERENCE_KEY } from '../../../constants/variables';
import { CollapsibleBox } from '../../common';
import GrazingScheduleEntryRow from './GrazingScheduleEntryRow';

class GrazingScheduleBox extends Component {
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
    const crownTotalAUMs = roundTo1Decimal(calcCrownTotalAUMs(grazingScheduleEntries, pasturesMap, livestockTypes));

    return (
      <CollapsibleBox
        key={id}
        contentIndex={scheduleIndex}
        activeContentIndex={activeScheduleIndex}
        onContentClicked={onScheduleClicked}
        header={`${year} Grazing Schedule`}
        collapsibleContent={
          <Fragment>
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
            <div className="rup__grazing-schedule__AUMs" style={{ marginTop: '10px' }}>
              <div className="rup__grazing-schedule__AUM-label">Authorized AUMs</div>
              <div className="rup__grazing-schedule__AUM-number">{authorizedAUMs}</div>
              <div className="rup__grazing-schedule__AUM-label">Total AUMs</div>
              <div className="rup__grazing-schedule__AUM-number">{crownTotalAUMs}</div>
            </div>
            <div>
              <div className="rup__grazing-schedule__narative__title">Schedule Description</div>
              {handleNullValue(narative)}
            </div>
          </Fragment>
        }
      />
    );
  }
}

export default GrazingScheduleBox;
