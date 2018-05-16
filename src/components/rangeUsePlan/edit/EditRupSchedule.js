import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Table, Button, Icon, TextArea, Form, Dropdown } from 'semantic-ui-react';
import { calcCrownTotalAUMs, roundTo1Decimal } from '../../../handlers';
import {
  PASTURE, LIVESTOCK_TYPE, DATE_IN, DATE_OUT,
  DAYS, NUM_OF_ANIMALS, GRACE_DAYS, PLD, CROWN_AUMS,
} from '../../../constants/strings';
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
  onScheduleClicked = () => {
    const { scheduleIndex, onScheduleClicked } = this.props;
    onScheduleClicked(scheduleIndex);
  }

  onNarativeChanged = (e, { value }) => {
    const { schedule, scheduleIndex, handleScheduleChange } = this.props;
    schedule.narative = value;

    handleScheduleChange(schedule, scheduleIndex);
  }

  onNewRowClick = scheduleIndex => () => {
    const { schedule, handleScheduleChange } = this.props;
    const { year, grazingScheduleEntries } = schedule;
    grazingScheduleEntries.push({
      livestockCount: 0,
      dateIn: new Date(`${year}-01-02`),
      dateOut: new Date(`${year}-01-02`),
    });

    handleScheduleChange(schedule, scheduleIndex);
  }

  handleScheduleDelete = () => {
    const { scheduleIndex, handleScheduleChange } = this.props;
    const schedule = null;
    handleScheduleChange(schedule, scheduleIndex);
  }

  handleScheduleEntryChange = (entry, entryIndex) => {
    const { schedule, scheduleIndex, handleScheduleChange } = this.props;
    schedule.grazingScheduleEntries[entryIndex] = entry;

    handleScheduleChange(schedule, scheduleIndex);
  }

  renderScheduleEntries = (grazingScheduleEntries = [], scheduleIndex) => {
    const { schedule, pastures, livestockTypes } = this.props;
    const { year } = schedule;
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

    return grazingScheduleEntries.map((entry, entryIndex) => {
      const key = `entry${scheduleIndex}${entryIndex}`;
      return (
        <EditRupScheduleEntry
          key={key}
          year={year}
          entry={entry}
          entryIndex={entryIndex}
          scheduleIndex={scheduleIndex}
          pastures={pastures}
          pastureOptions={pastureOptions}
          livestockTypes={livestockTypes}
          livestockTypeOptions={livestockTypeOptions}
          handleScheduleEntryChange={this.handleScheduleEntryChange}
        />
      );
    });
  }

  render() {
    const {
      schedule,
      scheduleIndex,
      usage,
      activeScheduleIndex,
    } = this.props;

    const { year, grazingScheduleEntries } = schedule;
    const narative = (schedule && schedule.narative) || '';
    const yearUsage = usage.find(u => u.year === year);
    const authorizedAUMs = yearUsage && yearUsage.authorizedAum;
    const totalCrownTotalAUMs = roundTo1Decimal(calcCrownTotalAUMs(grazingScheduleEntries));
    const isScheduleActive = activeScheduleIndex === scheduleIndex;
    // const scheduleOptions = [
    //   { key: `${scheduleIndex}`, text: 'Delete', onClick: this.handleScheduleDelete },
    // ];

    return (
      <li className="rup__schedule">
        <div className="rup__schedule__header">
          <button
            className="rup__schedule__header__title"
            onClick={this.onScheduleClicked}
          >
            <div>{year} Grazing Schedule</div>
            {isScheduleActive &&
              <Icon name="chevron up" />
            }
            {!isScheduleActive &&
              <Icon name="chevron down" />
            }
          </button>
          <div className="rup__schedule__header__action">
            {/* <Dropdown
              trigger={<Icon name="ellipsis vertical" />}
              options={scheduleOptions}
              icon={null}
            /> */}
          </div>
        </div>
        <div className={classnames('rup__schedule__content', { 'rup__schedule__content__hidden': !isScheduleActive })} >
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
          <div className="rup__schedule__content__narrative">Schedule Description</div>
          <Form>
            <TextArea
              rows={2}
              onChange={this.onNarativeChanged}
              value={narative}
            />
          </Form>
        </div>
      </li>
    );
  }
}

EditRupSchedule.propTypes = propTypes;
export default EditRupSchedule;
