import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import uuid from 'uuid-v4';
import { Table, Icon, TextArea, Form, Dropdown } from 'semantic-ui-react';
import { CollapsibleBox, InvertedButton } from '../../common';
import EditableGrazingScheduleEntryRow from './EditableGrazingScheduleEntryRow';
import WarningMessage from './WarningMessage';
import * as strings from '../../../constants/strings';
import { roundTo1Decimal } from '../../../utils';
import { getPasturesMap } from '../../../reducers/rootReducer';
import { openConfirmationModal, closeConfirmationModal, grazingScheduleUpdated } from '../../../actions';
import { deleteRUPGrazingSchedule, deleteRUPGrazingScheduleEntry } from '../../../actionCreators';
import { CONFIRMATION_MODAL_ID, IMAGE_SRC } from '../../../constants/variables';

class EditableGrazingScheduleBox extends Component {
  static propTypes = {
    schedule: PropTypes.shape({ grazingScheduleEntries: PropTypes.array }).isRequired,
    scheduleIndex: PropTypes.number.isRequired,
    onScheduleClicked: PropTypes.func.isRequired,
    activeScheduleIndex: PropTypes.number.isRequired,
    authorizedAUMs: PropTypes.number.isRequired,
    crownTotalAUMs: PropTypes.number.isRequired,
    yearOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    pastures: PropTypes.arrayOf(PropTypes.number).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
    grazingScheduleUpdated: PropTypes.func.isRequired,
    handleScheduleCopy: PropTypes.func.isRequired,
    handleScheduleDelete: PropTypes.func.isRequired,
    deleteRUPGrazingScheduleEntry: PropTypes.func.isRequired,
    closeConfirmationModal: PropTypes.func.isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
  };

  onNarativeChanged = (e, { value }) => {
    e.preventDefault();
    const { schedule, grazingScheduleUpdated } = this.props;
    const grazingSchedule = {
      ...schedule,
      narative: value,
    };

    grazingScheduleUpdated({ grazingSchedule });
  }

  onAddRowClicked = (e) => {
    e.preventDefault();
    const { schedule, grazingScheduleUpdated } = this.props;
    const grazingSchedule = { ...schedule };
    const entry = {
      key: uuid(),
      livestockCount: 0,
      graceDays: 0,
    };
    grazingSchedule.grazingScheduleEntries.push(entry);
    grazingScheduleUpdated({ grazingSchedule });
  }

  onScheduleCopyClicked = ({ value: year }) => () => {
    const { handleScheduleCopy, schedule } = this.props;
    handleScheduleCopy(year, schedule.id);
  }

  onScheduleDeleteClicked = () => {
    const { schedule, scheduleIndex, handleScheduleDelete, closeConfirmationModal } = this.props;
    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.DELETE_GRAZING_SCHEDULE });
    handleScheduleDelete(schedule, scheduleIndex);
  }

  handleScheduleEntryChange = (entry, entryIndex) => {
    const { schedule, grazingScheduleUpdated } = this.props;
    const grazingSchedule = { ...schedule };
    grazingSchedule.grazingScheduleEntries[entryIndex] = entry;

    grazingScheduleUpdated({ grazingSchedule });
  }

  handleScheduleEntryCopy = (entryIndex) => {
    const { schedule, grazingScheduleUpdated } = this.props;

    const entry = {
      ...schedule.grazingScheduleEntries[entryIndex],
      key: uuid(),
    };
    delete entry.id;
    const grazingSchedule = { ...schedule };
    grazingSchedule.grazingScheduleEntries.push(entry);
    grazingScheduleUpdated({ grazingSchedule });
  }

  handleScheduleEntryDelete = (entryIndex) => {
    const {
      schedule,
      grazingScheduleUpdated,
      deleteRUPGrazingScheduleEntry,
    } = this.props;
    const grazingSchedule = { ...schedule };
    const [deletedEntry] = grazingSchedule.grazingScheduleEntries.splice(entryIndex, 1);
    const planId = schedule && schedule.planId;
    const scheduleId = schedule && schedule.id;
    const entryId = deletedEntry && deletedEntry.id;
    const onDeleted = () => {
      grazingScheduleUpdated({ grazingSchedule });
    };

    // delete the entry saved in server
    if (planId && scheduleId && entryId && !uuid.isUUID(entryId)) {
      deleteRUPGrazingScheduleEntry(planId, scheduleId, entryId).then(onDeleted);
    } else { // or delete the entry saved only in Redux
      onDeleted();
    }
  }

  openDeleteScheduleConfirmationModal = () => {
    this.props.openConfirmationModal({
      id: CONFIRMATION_MODAL_ID.DELETE_GRAZING_SCHEDULE,
      header: strings.DELETE_SCHEDULE_CONFIRM_HEADER,
      content: strings.DELETE_SCHEDULE_CONFIRM_CONTENT,
      onYesBtnClicked: this.onScheduleDeleteClicked,
    });
  }

  renderScheduleEntries = (grazingScheduleEntries = [], scheduleIndex) => {
    const {
      schedule,
      pastures,
      pasturesMap,
      livestockTypes,
      openConfirmationModal,
      closeConfirmationModal,
    } = this.props;

    const pastureOptions = pastures.map((pId) => {
      const pasture = pasturesMap[pId];
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
      (
        <EditableGrazingScheduleEntryRow
          key={entry.id || entry.key}
          schedule={schedule}
          entry={entry}
          entryIndex={entryIndex}
          scheduleIndex={scheduleIndex}
          pasturesMap={pasturesMap}
          pastureOptions={pastureOptions}
          livestockTypes={livestockTypes}
          livestockTypeOptions={livestockTypeOptions}
          handleScheduleEntryChange={this.handleScheduleEntryChange}
          handleScheduleEntryCopy={this.handleScheduleEntryCopy}
          handleScheduleEntryDelete={this.handleScheduleEntryDelete}
          openConfirmationModal={openConfirmationModal}
          closeConfirmationModal={closeConfirmationModal}
        />
      )
    ));
  }

  render() {
    const {
      schedule,
      scheduleIndex,
      onScheduleClicked,
      activeScheduleIndex,
      authorizedAUMs,
      crownTotalAUMs,
      yearOptions,
      usage,
      livestockTypes,
      pasturesMap,
    } = this.props;
    const { id, year, grazingScheduleEntries } = schedule;
    const narative = (schedule && schedule.narative) || '';
    const roundedCrownTotalAUMs = roundTo1Decimal(crownTotalAUMs);
    const copyOptions = yearOptions.map(o => ({ ...o, onClick: this.onScheduleCopyClicked(o) })) || [];
    const isCrownTotalAUMsError = crownTotalAUMs > authorizedAUMs;

    return (
      <CollapsibleBox
        key={id}
        contentIndex={scheduleIndex}
        activeContentIndex={activeScheduleIndex}
        onContentClicked={onScheduleClicked}
        header={
          <div className="rup__grazing-schedule__title">
            <img src={IMAGE_SRC.SCHEDULES_ICON} alt="schedule icon" />
            {year} Grazing Schedule
          </div>
        }
        shouldHideHeaderRightWhenNotActive
        headerRight={
          <Dropdown
            trigger={
              <Icon name="ellipsis vertical" />
            }
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
        }
        message={
          <WarningMessage
            grazingSchedule={schedule}
            usage={usage}
            livestockTypes={livestockTypes}
            pasturesMap={pasturesMap}
          />
        }
        collapsibleContent={
          <Fragment>
            <Table unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell><div className="rup__grazing-schedule__pasture">{strings.PASTURE}</div></Table.HeaderCell>
                  <Table.HeaderCell><div className="rup__grazing-schedule__l-type">{strings.LIVESTOCK_TYPE}</div></Table.HeaderCell>
                  <Table.HeaderCell>{strings.NUM_OF_ANIMALS}</Table.HeaderCell>
                  <Table.HeaderCell><div className="rup__grazing-schedule__dates">{strings.DATE_IN}</div></Table.HeaderCell>
                  <Table.HeaderCell><div className="rup__grazing-schedule__dates">{strings.DATE_OUT}</div></Table.HeaderCell>
                  <Table.HeaderCell>{strings.DAYS}</Table.HeaderCell>
                  <Table.HeaderCell><div className="rup__grazing-schedule__grace-days">{strings.GRACE_DAYS}</div></Table.HeaderCell>
                  <Table.HeaderCell>{strings.PLD}</Table.HeaderCell>
                  <Table.HeaderCell>{strings.CROWN_AUMS}</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
                {this.renderScheduleEntries(grazingScheduleEntries, scheduleIndex)}
              </Table.Header>
            </Table>
            <InvertedButton
              style={{ margin: '10px 0' }}
              primaryColor
              compact
              onClick={this.onAddRowClicked}
            >
              <Icon name="add circle" />
              Add Row
            </InvertedButton>
            <div className="rup__grazing-schedule__AUMs">
              <div className="rup__grazing-schedule__AUM-label">Authorized AUMs</div>
              <div className="rup__grazing-schedule__AUM-number">{authorizedAUMs}</div>
              <div className="rup__grazing-schedule__AUM-label">Total AUMs</div>
              <div
                className={classnames(
                  'rup__grazing-schedule__AUM-number',
                  { 'rup__grazing-schedule__AUM-number--invalid': isCrownTotalAUMsError },
                )}
              >
                {roundedCrownTotalAUMs}
              </div>
            </div>
            <div className="rup__grazing-schedule__narrative__title">Schedule Description</div>
            <Form>
              <TextArea
                rows={3}
                value={narative}
                placeholder="Description of movement of livestock through agreement area. May include WHEN, WHERE and HOW management tools are used to create that flow. May be of particular value when an agreement consists of a single pasture or multiple unfenced pastures."
                onChange={this.onNarativeChanged}
                style={{ marginTop: '5px' }}
              />
            </Form>
          </Fragment>
        }
      />
    );
  }
}

const mapStateToProps = state => (
  {
    pasturesMap: getPasturesMap(state),
  }
);

export default connect(mapStateToProps, {
  grazingScheduleUpdated,
  openConfirmationModal,
  closeConfirmationModal,
  deleteRUPGrazingSchedule,
  deleteRUPGrazingScheduleEntry,
})(EditableGrazingScheduleBox);
