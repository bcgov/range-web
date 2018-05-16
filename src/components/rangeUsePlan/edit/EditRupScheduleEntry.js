import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import { Table, Dropdown, Input } from 'semantic-ui-react';
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

  handlePastureDropdown = (e, { value }) => {
    const {
      entry,
      entryIndex,
      handleScheduleEntryChange,
      pastures,
    } = this.props;

    const pasture = pastures.find(p => p.id === value);
    entry.pasture = pasture;
    entry.pastureId = pasture.id;
    entry.graceDays = pasture.graceDays;

    handleScheduleEntryChange(entry, entryIndex);
  }

  handleLiveStockTypeDropdown = (e, { value }) => {
    const {
      entry,
      entryIndex,
      handleScheduleEntryChange,
      livestockTypes,
    } = this.props;

    const livestockType = livestockTypes.find(p => p.id === value);
    entry.livestockType = livestockType;
    entry.livestockTypeId = livestockType.id;

    handleScheduleEntryChange(entry, entryIndex);
  }

  render() {
    const {
      entry,
      pastureOptions,
      livestockTypeOptions,
    } = this.props;

    const {
      pasture,
      livestockType,
      livestockCount,
      dateIn,
      dateOut,
    } = entry || {};

    const days = calcDateDiff(dateOut, dateIn, false);
    const pastureName = pasture && pasture.name;
    const auFactor = livestockType && livestockType.auFactor;
    const totalAUMs = calcTotalAUMs(livestockCount, days, auFactor);
    const pldAUMs = roundTo1Decimal(calcPldAUMs(totalAUMs, pasture && pasture.pldPercent));
    const crownAUMs = roundTo1Decimal(calcCrownAUMs(totalAUMs, pldAUMs));
    const livestockTypeName = livestockType && livestockType.name;
    const graceDays = pasture && pasture.graceDays;

    return (
      <Table.Row>
        <Table.Cell>
          <Dropdown
            placeholder={pastureName}
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
            placeholder={livestockTypeName}
            options={livestockTypeOptions}
            selectOnBlur={false}
            onChange={this.handleLiveStockTypeDropdown}
            fluid
            search
            selection
          />
        </Table.Cell>
        <Table.Cell>
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
        <Table.Cell>{presentNullValue(days, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(graceDays, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(pldAUMs, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(crownAUMs, false)}</Table.Cell>
      </Table.Row>
    );
  }
}

EditRupScheduleEntry.propTypes = propTypes;
export default EditRupScheduleEntry;
