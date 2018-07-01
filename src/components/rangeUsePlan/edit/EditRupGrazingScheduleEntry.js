import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import { Table, Dropdown, Input, Icon } from 'semantic-ui-react';
import * as utils from '../../../utils';
import { DELETE_SCHEDULE_ENTRY_FOR_AH_CONTENT, DELETE_SCHEDULE_ENTRY_FOR_AH_HEADER } from '../../../constants/strings';

import { DATE_FORMAT } from '../../../constants/variables';
import { ConfirmationModal } from '../../common';

const propTypes = {
  year: PropTypes.number.isRequired,
  entry: PropTypes.shape({}).isRequired,
  entryIndex: PropTypes.number.isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  pastureOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  livestockTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  // handleScheduleEntryChange: PropTypes.func.isRequired,
  // handleScheduleEntryCopy: PropTypes.func.isRequired,
  // handleScheduleEntryDelete: PropTypes.func.isRequired,
  // isDeletingScheduleEntry: PropTypes.bool.isRequired,
};

class EditRupScheduleEntry extends Component {
  state = {
    isDeleteScheduleEntryModalOpen: false,
  }

  componentDidMount() {
    const { entry, year } = this.props;
    const { dateIn: din, dateOut: dout } = entry;
    const dateIn = din ? new Date(din) : null;
    const dateOut = dout ? new Date(dout) : null;
    const minDate = new Date(`${year}-01-02`);
    const maxDate = new Date(`${year + 1}-01-01`);

    this.pikaDayDateIn = new Pikaday({
      field: this.dateInRef,
      format: DATE_FORMAT.SCHEUDLE_ENTRY,
      minDate,
      maxDate: dateOut || maxDate,
      defaultDate: minDate, // the initial date to view when first opened
      onSelect: this.handleDateChange('dateIn'),
    });
    if (dateIn) this.pikaDayDateIn.setDate(dateIn);

    this.pikaDayDateOut = new Pikaday({
      field: this.dateOutRef,
      format: DATE_FORMAT.SCHEUDLE_ENTRY,
      minDate: dateIn || minDate,
      maxDate,
      defaultDate: minDate,
      onSelect: this.handleDateChange('dateOut'),
    });
    if (dateOut) this.pikaDayDateOut.setDate(dateOut);
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
    // const { entry, entryIndex, handleScheduleEntryChange } = this.props;
    // entry[key] = formatDateFromUTC(date);

    // // prevent users from inputting wrong dates
    // if (this.pikaDayDateIn && key === 'dateOut') {
    //   this.pikaDayDateIn.setMaxDate(date);
    // } else if (this.pikaDayDateOut && key === 'dateIn') {
    //   this.pikaDayDateOut.setMinDate(date);
    // }
    // handleScheduleEntryChange(entry, entryIndex);
  }

  handleNumberInput = key => (e) => {
    const { value } = e.target;
    const { entry, entryIndex, handleScheduleEntryChange } = this.props;
    entry[key] = Number(value);

    // handleScheduleEntryChange(entry, entryIndex);
  }

  handlePastureDropdown = (e, { value: pastureId }) => {
    const {
      entry,
      entryIndex,
      handleScheduleEntryChange,
      pastures,
    } = this.props;

    entry.pastureId = pastureId;
    const { graceDays } = pastures.find(p => p.id === pastureId);
    entry.graceDays = graceDays;
    // handleScheduleEntryChange(entry, entryIndex);
  }

  handleLiveStockTypeDropdown = (e, { value: livestockTypeId }) => {
    const {
      entry,
      entryIndex,
      handleScheduleEntryChange,
    } = this.props;

    entry.livestockTypeId = livestockTypeId;
    // handleScheduleEntryChange(entry, entryIndex);
  }

  render() {
    const {
      entry,
      entryIndex,
      pasturesMap,
      pastureOptions,
      livestockTypes,
      livestockTypeOptions,
      // isDeletingScheduleEntry,
    } = this.props;

    const {
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
    const livestockType = livestockTypes.find(lt => lt.id === livestockTypeId);
    const auFactor = livestockType && livestockType.auFactor;

    const totalAUMs = utils.calcTotalAUMs(livestockCount, days, auFactor);
    const pldAUMs = utils.roundTo1Decimal(utils.calcPldAUMs(totalAUMs, pldPercent));
    const crownAUMs = utils.roundTo1Decimal(utils.calcCrownAUMs(totalAUMs, pldAUMs));

    const entryOptions = [
      { key: `entry${entryIndex}option1`, text: 'Copy', onClick: this.onCopyEntryClicked },
      { key: `entry${entryIndex}option2`, text: 'Delete', onClick: this.openDeleteScheduleEntryConfirmationModal },
    ];

    const isPastureDropdownError = pastureId === undefined;
    const isLivestockTypeDropdownError = livestockTypeId === undefined;
    const isLivestockCountError = livestockCount <= 0;
    const isDateInError = dateIn === undefined;
    const isDateOutError = dateOut === undefined;

    return (
      <Table.Row>
        {/* <ConfirmationModal
          open={this.state.isDeleteScheduleEntryModalOpen}
          loading={isDeletingScheduleEntry}
          header={DELETE_SCHEDULE_ENTRY_FOR_AH_HEADER}
          content={DELETE_SCHEDULE_ENTRY_FOR_AH_CONTENT}
          onNoClicked={this.closeDeleteScheduleEntryConfirmationModal}
          onYesClicked={this.onDeleteEntryClicked}
        /> */}

        <Table.Cell>
          <Dropdown
            value={pastureId}
            options={pastureOptions}
            selectOnBlur={false}
            onChange={this.handlePastureDropdown}
            error={isPastureDropdownError}
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
            error={isLivestockTypeDropdownError}
            fluid
            search
            selection
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Input fluid error={isLivestockCountError}>
            <input
              type="text"
              onKeyPress={this.handleNumberOnly}
              value={livestockCount}
              onChange={this.handleNumberInput('livestockCount')}
            />
          </Input>
        </Table.Cell>
        <Table.Cell>
          <Input fluid error={isDateInError}>
            <input
              type="text"
              ref={this.setDateInRef}
            />
          </Input>
        </Table.Cell>
        <Table.Cell>
          <Input fluid error={isDateOutError}>
            <input
              type="text"
              ref={this.setDateOutRef}
            />
          </Input>
        </Table.Cell>
        <Table.Cell collapsing>{utils.presentNullValue(days, false)}</Table.Cell>
        <Table.Cell collapsing>
          <Input fluid>
            <input
              type="text"
              onKeyPress={this.handleNumberOnly}
              value={graceDays}
              onChange={this.handleNumberInput('graceDays')}
            />
          </Input>
        </Table.Cell>
        <Table.Cell collapsing>{utils.presentNullValue(pldAUMs, false)}</Table.Cell>
        <Table.Cell collapsing>{utils.presentNullValue(crownAUMs, false)}</Table.Cell>
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
