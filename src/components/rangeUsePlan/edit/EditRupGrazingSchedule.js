import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// import cloneDeep from 'lodash.clonedeep';
import { Table, Button, Icon, TextArea, Form, Dropdown, Message } from 'semantic-ui-react';
// import { calcCrownTotalAUMs, roundTo1Decimal } from '../../../handlers';
// import { handleGrazingScheduleValidation } from '../../../handlers/validation';
import * as strings from '../../../constants/strings';
import { roundTo1Decimal, getObjValues } from '../../../utils';
import EditRupGrazingScheduleEntry from './EditRupGrazingScheduleEntry';
// import { ConfirmationModal } from '../../common';

const propTypes = {
  schedule: PropTypes.shape({ grazingScheduleEntries: PropTypes.array }).isRequired,
  scheduleIndex: PropTypes.number.isRequired,
  onScheduleClicked: PropTypes.func.isRequired,
  activeScheduleIndex: PropTypes.number.isRequired,
  grazingScheduleEntriesMap: PropTypes.shape({}).isRequired,
  authorizedAUMs: PropTypes.number.isRequired,
  crownTotalAUMs: PropTypes.number.isRequired,
  yearOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  // usages: PropTypes.arrayOf(PropTypes.object).isRequired,
  // yearOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  // pastures: PropTypes.arrayOf(PropTypes.object).isRequired,
  // handleScheduleChange: PropTypes.func.isRequired,
  // handleScheduleDelete: PropTypes.func.isRequired,
  // handleScheduleCopy: PropTypes.func.isRequired,
  // deleteRupScheduleEntry: PropTypes.func.isRequired,
  // isDeletingSchedule: PropTypes.bool.isRequired,
  // isDeletingScheduleEntry: PropTypes.bool.isRequired,
};

class EditRupSchedule extends Component {
  state = {
    // isDeleteScheduleModalOpen: false,
  }

  onScheduleClicked = () => {
    const { scheduleIndex, onScheduleClicked } = this.props;
    onScheduleClicked(scheduleIndex);
  }

  onNarativeChanged = () => {

  }
  onNewRowClick = (scheduleIndex) => () => {

  }

  onScheduleCopyClicked = () => () => {

  }
  renderScheduleEntries = (grazingScheduleEntries = [], scheduleIndex) => {
    const {
      schedule,
      pasturesMap,
      livestockTypes,
      isDeletingScheduleEntry,
    } = this.props;
    const { year } = schedule;
    const pastures = getObjValues(pasturesMap);
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
      // const key = `schedule${scheduleIndex}entry${entry.key || entry.id}`;
      return (
        <EditRupGrazingScheduleEntry
          key={entry.id}
          year={year}
          entry={entry}
          entryIndex={entryIndex}
          scheduleIndex={scheduleIndex}
          pasturesMap={pasturesMap}
          pastureOptions={pastureOptions}
          livestockTypes={livestockTypes}
          livestockTypeOptions={livestockTypeOptions}
        />
      );
    });
  }
  render() {
    const {
      schedule,
      scheduleIndex,
      activeScheduleIndex,
      grazingScheduleEntriesMap,
      authorizedAUMs,
      crownTotalAUMs,
      yearOptions,
    } = this.props;
    // const { isDeleteScheduleModalOpen } = this.state;
    const { year, grazingScheduleEntries: ids } = schedule;
    const grazingScheduleEntries = ids.map(id => grazingScheduleEntriesMap[id]);
    const narative = (schedule && schedule.narative) || '';
    const isScheduleActive = activeScheduleIndex === scheduleIndex;
    const roundedCrownTotalAUMs = roundTo1Decimal(crownTotalAUMs);
    const copyOptions = yearOptions.map(o => ({ ...o, onClick: this.onScheduleCopyClicked(o) })) || [];
    const isCrownTotalAUMsError = crownTotalAUMs > authorizedAUMs;

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
            <Dropdown
              trigger={<Icon name="ellipsis vertical" />}
              icon={null}
              pointing="right"
              loading={false}
              disabled={false}
            >
              <Dropdown.Menu>
                <Dropdown
                  header="Years"
                  text="Copy"
                  pointing="left"
                  className="link item"
                  options={copyOptions}
                  disabled={copyOptions.length === 0}
                />
                <Dropdown.Item onClick={this.openDeleteScheduleConfirmationModal}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <div className={classnames('rup__schedule__content', { 'rup__schedule__content__hidden': !isScheduleActive })} >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{strings.PASTURE}</Table.HeaderCell>
                <Table.HeaderCell>{strings.LIVESTOCK_TYPE}</Table.HeaderCell>
                <Table.HeaderCell>{strings.NUM_OF_ANIMALS}</Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__content__dates">{strings.DATE_IN}</div></Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__content__dates">{strings.DATE_OUT}</div></Table.HeaderCell>
                <Table.HeaderCell>{strings.DAYS}</Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__content__grace-days">{strings.GRACE_DAYS}</div></Table.HeaderCell>
                <Table.HeaderCell>{strings.PLD}</Table.HeaderCell>
                <Table.HeaderCell>{strings.CROWN_AUMS}</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
              {this.renderScheduleEntries(grazingScheduleEntries, scheduleIndex)}
            </Table.Header>
          </Table>
          <Button
            style={{ margin: '10px 0' }}
            icon
            basic
            onClick={this.onNewRowClick(scheduleIndex)}
          >
            <Icon name="add" /> Add row
          </Button>
          <div className="rup__schedule__content__AUMs">
            <div className="rup__schedule__content__AUM-label">Authorized AUMs</div>
            <div className="rup__schedule__content__AUM-number">{authorizedAUMs}</div>
            <div className="rup__schedule__content__AUM-label">Total AUMs</div>
            <div className={classnames('rup__schedule__content__AUM-number', { 'rup__schedule__content__AUM-number--invalid': isCrownTotalAUMsError })}>
              {roundedCrownTotalAUMs}
            </div>
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
