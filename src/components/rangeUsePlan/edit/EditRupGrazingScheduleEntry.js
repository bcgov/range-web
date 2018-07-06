import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import { Table, Dropdown, Input, Icon } from 'semantic-ui-react';
import * as utils from '../../../utils';
import { DATE_FORMAT } from '../../../constants/variables';
import { DELETE_SCHEDULE_ENTRY_FOR_AH_CONTENT, DELETE_SCHEDULE_ENTRY_FOR_AH_HEADER } from '../../../constants/strings';
import { ConfirmationModal } from '../../common';

const propTypes = {
  schedule: PropTypes.shape({}).isRequired,
  entry: PropTypes.shape({}).isRequired,
  entryIndex: PropTypes.number.isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  pastureOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  livestockTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleScheduleEntryChange: PropTypes.func.isRequired,
  handleScheduleEntryCopy: PropTypes.func.isRequired,
  handleScheduleEntryDelete: PropTypes.func.isRequired,
  isDeletingGrazingScheduleEntry: PropTypes.bool.isRequired,
};

/* eslint-disable object-curly-newline */
class EditRupGrazingScheduleEntry extends Component {
  state = {
    isDeleteScheduleEntryModalOpen: false,
  }

  componentDidMount() {
    const { entry, schedule } = this.props;
    const { dateIn: din, dateOut: dout } = entry;
    const dateIn = din ? new Date(din) : undefined;
    const dateOut = dout ? new Date(dout) : undefined;
    const minDate = new Date(`${schedule.year}-01-02`);
    const maxDate = new Date(`${schedule.year + 1}-01-01`);

    this.pikaDayDateIn = new Pikaday({
      field: this.dateInRef,
      format: DATE_FORMAT.SCHEUDLE_ENTRY,
      minDate,
      maxDate: dateOut || maxDate,
      defaultDate: dateIn || minDate, // the initial date to view when first opened
      setDefaultDate: dateIn !== undefined, // show default date if dateIn was defined
      onSelect: this.handleDateChange('dateIn'),
    });

    this.pikaDayDateOut = new Pikaday({
      field: this.dateOutRef,
      format: DATE_FORMAT.SCHEUDLE_ENTRY,
      minDate: dateIn || minDate,
      maxDate,
      defaultDate: dateOut || minDate,
      setDefaultDate: dateOut !== undefined,
      onSelect: this.handleDateChange('dateOut'),
    });
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
    entry[key] = utils.formatDateFromUTC(date);

    // prevent users from inputting wrong dates
    if (this.pikaDayDateIn && key === 'dateOut') {
      this.pikaDayDateIn.setMaxDate(date);
    } else if (this.pikaDayDateOut && key === 'dateIn') {
      this.pikaDayDateOut.setMinDate(date);
    }
    handleScheduleEntryChange(entry, entryIndex);
  }

  handleNumberInput = key => (e) => {
    const { value } = e.target;
    const { entry, entryIndex, handleScheduleEntryChange } = this.props;
    entry[key] = Number(value);

    handleScheduleEntryChange(entry, entryIndex);
  }

  handlePastureDropdown = (e, { value: pastureId }) => {
    const { entry, entryIndex, handleScheduleEntryChange, pasturesMap } = this.props;

    entry.pastureId = pastureId;
    const { graceDays } = pasturesMap[pastureId];
    entry.graceDays = graceDays;
    handleScheduleEntryChange(entry, entryIndex);
  }

  handleLiveStockTypeDropdown = (e, { value: livestockTypeId }) => {
    const { entry, entryIndex, handleScheduleEntryChange } = this.props;

    entry.livestockTypeId = livestockTypeId;
    handleScheduleEntryChange(entry, entryIndex);
  }

  onCopyEntryClicked = () => {
    const { handleScheduleEntryCopy, entryIndex } = this.props;
    handleScheduleEntryCopy(entryIndex);
  }

  onDeleteEntryClicked = () => {
    const { handleScheduleEntryDelete, entryIndex } = this.props;
    handleScheduleEntryDelete(entryIndex);
  }

  closeDeleteScheduleEntryConfirmationModal = () => this.setState({ isDeleteScheduleEntryModalOpen: false })
  openDeleteScheduleEntryConfirmationModal = () => this.setState({ isDeleteScheduleEntryModalOpen: true })

  render() {
    const {
      entry,
      entryIndex,
      pasturesMap,
      pastureOptions,
      livestockTypes,
      livestockTypeOptions,
      isDeletingGrazingScheduleEntry,
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
        <ConfirmationModal
          open={this.state.isDeleteScheduleEntryModalOpen}
          loading={isDeletingGrazingScheduleEntry}
          header={DELETE_SCHEDULE_ENTRY_FOR_AH_HEADER}
          content={DELETE_SCHEDULE_ENTRY_FOR_AH_CONTENT}
          onNoClicked={this.closeDeleteScheduleEntryConfirmationModal}
          onYesClicked={this.onDeleteEntryClicked}
        />

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

EditRupGrazingScheduleEntry.propTypes = propTypes;
export default EditRupGrazingScheduleEntry;
