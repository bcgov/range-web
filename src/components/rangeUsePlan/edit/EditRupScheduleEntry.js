import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import { Table, Dropdown, Input, Icon } from 'semantic-ui-react';
import {
  presentNullValue,
  calcDateDiff,
  calcTotalAUMs,
  calcCrownAUMs,
  calcPldAUMs,
  formatDateFromUTC,
  roundTo1Decimal,
} from '../../../handlers';
import { SCHEUDLE_ENTRY_DATE_FORMAT } from '../../../constants/variables';

const propTypes = {
  year: PropTypes.number.isRequired,
  entry: PropTypes.shape({}).isRequired,
  entryIndex: PropTypes.number.isRequired,
  pastures: PropTypes.arrayOf(PropTypes.object).isRequired,
  pastureOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  livestockTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleScheduleEntryChange: PropTypes.func.isRequired,
  handleScheduleEntryCopy: PropTypes.func.isRequired,
  handleScheduleEntryDelete: PropTypes.func.isRequired,
};

class EditRupScheduleEntry extends Component {
  componentDidMount() {
    const { entry, year } = this.props;
    const { dateIn, dateOut } = entry;
    const minDate = new Date(`${year}-01-02`);
    const maxDate = new Date(`${year + 1}-01-01`);

    new Pikaday({
      field: this.dateInRef,
      format: SCHEUDLE_ENTRY_DATE_FORMAT,
      minDate,
      maxDate,
      onSelect: this.handleDateChange('dateIn'),
    }).setDate(new Date(dateIn));

    new Pikaday({
      field: this.dateOutRef,
      format: SCHEUDLE_ENTRY_DATE_FORMAT,
      minDate,
      maxDate,
      onSelect: this.handleDateChange('dateOut'),
    }).setDate(new Date(dateOut));
  }

  onCopyEntryClicked = () => {
    const { handleScheduleEntryCopy, entryIndex } = this.props;
    handleScheduleEntryCopy(entryIndex);
  }

  onDeleteEntryClicked = () => {
    const { handleScheduleEntryDelete, entryIndex } = this.props;
    handleScheduleEntryDelete(entryIndex);
  }

  setDateInRef = (ref) => { this.dateInRef = ref; }
  setDateOutRef = (ref) => { this.dateOutRef = ref; }

  handleNumberOnly = (e) => {
    if (!(e.charCode >= 48 && e.charCode <= 57)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handleDateChange = key => (date) => {
    const { entry, entryIndex, handleScheduleEntryChange } = this.props;
    entry[key] = formatDateFromUTC(date);

    handleScheduleEntryChange(entry, entryIndex);
  }

  handleNumberInput = key => (e) => {
    const { value } = e.target;
    const { entry, entryIndex, handleScheduleEntryChange } = this.props;
    entry[key] = Number(value);

    handleScheduleEntryChange(entry, entryIndex);
  }

  handlePastureDropdown = (e, { value: pastureId }) => {
    const {
      entry,
      entryIndex,
      handleScheduleEntryChange,
    } = this.props;

    entry.pastureId = pastureId;
    handleScheduleEntryChange(entry, entryIndex);
  }

  handleLiveStockTypeDropdown = (e, { value: livestockTypeId }) => {
    const {
      entry,
      entryIndex,
      handleScheduleEntryChange,
    } = this.props;

    entry.livestockTypeId = livestockTypeId;
    handleScheduleEntryChange(entry, entryIndex);
  }

  render() {
    const {
      entry,
      entryIndex,
      pastures,
      pastureOptions,
      livestockTypes,
      livestockTypeOptions,
    } = this.props;

    const {
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
    const livestockType = livestockTypes.find(lt => lt.id === livestockTypeId);
    const auFactor = livestockType && livestockType.auFactor;

    const totalAUMs = calcTotalAUMs(livestockCount, days, auFactor);
    const pldAUMs = roundTo1Decimal(calcPldAUMs(totalAUMs, pldPercent));
    const crownAUMs = roundTo1Decimal(calcCrownAUMs(totalAUMs, pldAUMs));

    const entryOptions = [
      { key: `entry${entryIndex}option1`, text: 'copy', onClick: this.onCopyEntryClicked },
      { key: `entry${entryIndex}option2`, text: 'delete', onClick: this.onDeleteEntryClicked },
    ];
    return (
      <Table.Row>
        <Table.Cell>
          <Dropdown
            value={pastureId}
            options={pastureOptions}
            selectOnBlur={false}
            onChange={this.handlePastureDropdown}
            fluid
            search
            selection
          />
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            value={livestockTypeId}
            options={livestockTypeOptions}
            selectOnBlur={false}
            onChange={this.handleLiveStockTypeDropdown}
            fluid
            search
            selection
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Input fluid>
            <input
              type="text"
              onKeyPress={this.handleNumberOnly}
              value={livestockCount}
              onChange={this.handleNumberInput('livestockCount')}
            />
          </Input>
        </Table.Cell>
        <Table.Cell>
          <Input fluid>
            <input
              type="text"
              ref={this.setDateInRef}
            />
          </Input>
        </Table.Cell>
        <Table.Cell>
          <Input fluid>
            <input
              type="text"
              ref={this.setDateOutRef}
            />
          </Input>
        </Table.Cell>
        <Table.Cell collapsing>{presentNullValue(days, false)}</Table.Cell>
        <Table.Cell collapsing>{presentNullValue(graceDays, false)}</Table.Cell>
        <Table.Cell collapsing>{presentNullValue(pldAUMs, false)}</Table.Cell>
        <Table.Cell collapsing>{presentNullValue(crownAUMs, false)}</Table.Cell>
        <Table.Cell collapsing textAlign="center">
          <Dropdown
            trigger={<Icon name="ellipsis vertical" />}
            options={entryOptions}
            icon={null}
            pointing="right"
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

EditRupScheduleEntry.propTypes = propTypes;
export default EditRupScheduleEntry;
