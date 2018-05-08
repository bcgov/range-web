import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Table, Button, Icon, TextArea, Form } from 'semantic-ui-react';
import { calcCrownTotalAUMs } from '../../handlers';
import {
  PASTURE, LIVESTOCK_TYPE, DATE_IN, DATE_OUT,
  DAYS, NUM_OF_ANIMALS, GRACE_DAYS, PLD, CROWN_AUMS,
} from '../../constants/strings';
import EditRupScheduleEntry from './EditRupScheduleEntry';

const propTypes = {
  schedule: PropTypes.shape({ grazingScheduleEntries: PropTypes.array }).isRequired,
  scheduleIndex: PropTypes.number.isRequired,
  onScheduleClicked: PropTypes.func.isRequired,
  activeScheduleIndex: PropTypes.number.isRequired,
  usage: PropTypes.arrayOf(PropTypes.object).isRequired,
  pastures: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleScheduleChange: PropTypes.func.isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class EditRupSchedule extends Component {
  onNewRowClick = sIndex => () => {
    const grazingSchedule = this.props.schedule;
    grazingSchedule.grazingScheduleEntries.push({});

    this.props.handleScheduleChange(grazingSchedule, sIndex);
  }

  renderScheduleEntries = (grazingScheduleEntries = [], scheduleIndex) => {
    const { pastures, livestockTypes } = this.props;
    const pastureOptions = pastures.map((pasture) => {
      const { id, name } = pasture || {};
      return {
        key: id,
        value: id,
        text: name,
      };
    });
    const livestockTypeOptions = livestockTypes.map((lt) => {
      const { id, name } = lt || {};
      return {
        key: id,
        value: id,
        text: name,
      };
    });

    return grazingScheduleEntries.map((entry, entryIndex) => (
      <EditRupScheduleEntry
        entry={entry}
        entryIndex={entryIndex}
        pastureOptions={pastureOptions}
        livestockTypeOptions={livestockTypeOptions}
      />
    ));
  }

  render() {
    const {
      schedule,
      scheduleIndex,
      usage,
      activeScheduleIndex,
      onScheduleClicked,
    } = this.props;

    const { year, grazingScheduleEntries } = schedule;
    const key = `schedule${scheduleIndex}`;
    const yearUsage = usage.find(u => u.year === year);
    const authorizedAUMs = yearUsage && yearUsage.authorizedAum;
    const totalCrownTotalAUMs = calcCrownTotalAUMs(grazingScheduleEntries).toFixed(2);
    const isScheduleActive = activeScheduleIndex === scheduleIndex;
    const arrow = isScheduleActive
      ? (<Icon name="chevron up" />)
      : (<Icon name="chevron down" />);

    return (
      <li key={key} className="rup__schedule">
        <div
          className="rup__schedule__header"
          onClick={onScheduleClicked(scheduleIndex)}
          role="button"
        >
          <div>{year} Grazing Schedule</div>
          <div>
            {arrow}
          </div>
        </div>
        <div className={classNames('rup__schedule__content', { 'rup__schedule__content__hidden': !isScheduleActive })} >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{PASTURE}</Table.HeaderCell>
                <Table.HeaderCell>{LIVESTOCK_TYPE}</Table.HeaderCell>
                <Table.HeaderCell>{NUM_OF_ANIMALS}</Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__content__dates">{DATE_IN}</div></Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__content__dates">{DATE_OUT}</div></Table.HeaderCell>
                <Table.HeaderCell>{DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{GRACE_DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{PLD}</Table.HeaderCell>
                <Table.HeaderCell>{CROWN_AUMS}</Table.HeaderCell>
              </Table.Row>
              {this.renderScheduleEntries(grazingScheduleEntries, scheduleIndex)}
            </Table.Header>
          </Table>
          <Button style={{ margin: '10px 0' }} icon basic onClick={this.onNewRowClick(scheduleIndex)}><Icon name="add" /> Add row</Button>
          <div className="rup__schedule__content__AUMs">
            <div className="rup__schedule__content__AUM-label">Authorized AUMs</div>
            <div className="rup__schedule__content__AUM-number">{authorizedAUMs}</div>
            <div className="rup__schedule__content__AUM-label">Total AUMs</div>
            <div className="rup__schedule__content__AUM-number">{totalCrownTotalAUMs}</div>
          </div>
          <b>Schedule Description</b>
          <Form>
            <TextArea
              rows={2}
              onChange={this.onScheduleTextChanged}
            />
          </Form>
        </div>
      </li>
    );
  }
}

EditRupSchedule.propTypes = propTypes;
export default EditRupSchedule;
