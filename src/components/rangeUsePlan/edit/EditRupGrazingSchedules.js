import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid-v4';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown } from 'semantic-ui-react';
import { NOT_PROVIDED } from '../../../constants/strings';
import EditRupGrazingSchedule from './EditRupGrazingSchedule';
import { ELEMENT_ID, REFERENCE_KEY } from '../../../constants/variables';
import { deleteRupGrazingSchedule, deleteRupGrazingScheduleEntry } from '../../../actionCreators';
import { addGrazingSchedule, updateGrazingSchedule, deleteGrazingSchedule } from '../../../actions';
import { getGrazingScheduleIsDeleting, getGrazingScheduleEntryIsDeleting } from '../../../reducers/rootReducer';
import * as utils from '../../../utils';

const propTypes = {
  plan: PropTypes.shape({ grazingSchedules: PropTypes.array }).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  usages: PropTypes.arrayOf(PropTypes.object).isRequired,
  addGrazingSchedule: PropTypes.func.isRequired,
  updateGrazingSchedule: PropTypes.func.isRequired,
  deleteGrazingSchedule: PropTypes.func.isRequired,
  deleteRupGrazingSchedule: PropTypes.func.isRequired,
  deleteRupGrazingScheduleEntry: PropTypes.func.isRequired,
  isDeletingGrazingSchedule: PropTypes.bool.isRequired,
  isDeletingGrazingScheduleEntry: PropTypes.bool.isRequired,
};

export class EditRupGrazingSchedules extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yearOptions: this.getInitialYearOptions(),
      activeScheduleIndex: 0,
    };
  }

  getInitialYearOptions = () => {
    const { plan, grazingSchedulesMap } = this.props;
    const { planStartDate, planEndDate, grazingSchedules: grazingScheduleIds } = plan || {};
    if (planStartDate && planEndDate) {
      // set up year options
      const planStartYear = new Date(planStartDate).getFullYear();
      const planEndYear = new Date(planEndDate).getFullYear();
      const length = (planEndYear - planStartYear) + 1;
      return utils.createEmptyArray(length)
        .map((v, i) => (
          {
            key: planStartYear + i,
            text: planStartYear + i,
            value: planStartYear + i,
          }
        ))
        .filter((option) => {
          // give year options that hasn't been added yet in schedules
          const grazingSchedules = grazingScheduleIds.map(id => grazingSchedulesMap[id]);
          const years = grazingSchedules.map(s => s.year);
          return !(years.indexOf(option.value) >= 0);
        });
    }
    return [];
  }

  onScheduleClicked = (scheduleIndex) => {
    const newIndex = this.state.activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;

    this.setState({ activeScheduleIndex: newIndex });
  }

  handleScheduleCopy = (year, sId) => {
    const { grazingSchedulesMap } = this.props;
    const schedule = grazingSchedulesMap[sId];
    const copiedGrazingScheduleEntries = schedule.grazingScheduleEntries.map((e) => {
      const { id, grazingScheduleId, ...entry } = e;
      // replace the first 4 characters with the new year
      const dateIn = entry.dateIn && typeof entry.dateIn === 'string' && `${year}${entry.dateIn.slice(4)}`;
      const dateOut = entry.dateOut && typeof entry.dateOut === 'string' && `${year}${entry.dateOut.slice(4)}`;

      return {
        ...entry,
        key: uuid(),
        dateIn,
        dateOut,
      };
    });
    // construct a new grazing schedule
    const grazingSchedule = {
      ...schedule,
      id: uuid(),
      year,
      grazingScheduleEntries: copiedGrazingScheduleEntries,
    };

    this.addGrazingScheduleInStore(grazingSchedule);
  }

  handleScheduleDelete = (schedule, scheduleIndex) => {
    const { plan, deleteGrazingSchedule, deleteRupGrazingSchedule } = this.props;

    const planId = plan && plan.id;
    const { year, id: scheduleId } = schedule;
    const onDeleted = () => {
      const option = {
        key: year,
        text: year,
        value: year,
      };
      // put the year back to the year option list and sort them
      const yearOptions = [...this.state.yearOptions];
      yearOptions.push(option);
      yearOptions.sort((o1, o2) => o1.value > o2.value);

      this.setState({
        yearOptions,
        activeScheduleIndex: 0,
      });
      // construct a new list of schedule ids without the deleted one
      const grazingSchedules = [...plan.grazingSchedules];
      grazingSchedules.splice(scheduleIndex, 1);

      deleteGrazingSchedule({
        planId, // for plansReducer
        grazingSchedules, // for plansReducer
        grazingScheduleId: scheduleId, // for grazingSchedulesReducer
      });
    };

    // delete the schedule saved in server
    if (planId && scheduleId && !uuid.isUUID(scheduleId)) {
      deleteRupGrazingSchedule(planId, scheduleId).then(onDeleted);
    } else { // or delete the schedule saved in Redux store
      onDeleted();
    }
  }

  addGrazingScheduleInStore = (grazingSchedule) => {
    const { addGrazingSchedule, plan, grazingSchedulesMap } = this.props;

    // construct a new sorted list of grazing schedules
    const newGrazingSchedules = [
      ...plan.grazingSchedules.map(id => grazingSchedulesMap[id]),
      grazingSchedule,
    ];
    newGrazingSchedules.sort((s1, s2) => s1.year > s2.year);

    // pass the copied grazing schedule and new sorted list of schedule ids for the plan reducer
    addGrazingSchedule({
      planId: plan.id,
      grazingSchedules: newGrazingSchedules.map(s => s.id),
      grazingSchedule,
    });

    // remove this year from the year options and set active to the newly copied schedule
    this.setState({
      yearOptions: this.state.yearOptions.filter(o => o.value !== grazingSchedule.year),
      activeScheduleIndex: newGrazingSchedules.findIndex(s => s.year === grazingSchedule.year),
    });
  }

  onYearSelected = (e, { value: year }) => {
    e.preventDefault();
    // construct a new grazing schedule
    const grazingSchedule = {
      id: uuid(),
      year,
      narative: '',
      grazingScheduleEntries: [],
    };

    this.addGrazingScheduleInStore(grazingSchedule);
  }

  renderSchedule = (schedule, scheduleIndex) => {
    const {
      usages,
      references,
      pasturesMap,
      updateGrazingSchedule,
      deleteRupGrazingScheduleEntry,
      isDeletingGrazingSchedule,
      isDeletingGrazingScheduleEntry,
    } = this.props;
    const { yearOptions, activeScheduleIndex } = this.state;
    const { id, year } = schedule;
    const yearUsage = usages.find(u => u.year === year);
    const authorizedAUMs = (yearUsage && yearUsage.authorizedAum) || 0;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const crownTotalAUMs = utils.calcCrownTotalAUMs(schedule.grazingScheduleEntries, pasturesMap, livestockTypes);

    return (
      <EditRupGrazingSchedule
        key={id}
        yearOptions={yearOptions}
        schedule={schedule}
        scheduleIndex={scheduleIndex}
        onScheduleClicked={this.onScheduleClicked}
        activeScheduleIndex={activeScheduleIndex}
        livestockTypes={livestockTypes}
        pasturesMap={pasturesMap}
        usages={usages}
        authorizedAUMs={authorizedAUMs}
        crownTotalAUMs={crownTotalAUMs}
        updateGrazingSchedule={updateGrazingSchedule}
        deleteRupGrazingScheduleEntry={deleteRupGrazingScheduleEntry}
        handleScheduleCopy={this.handleScheduleCopy}
        handleScheduleDelete={this.handleScheduleDelete}
        isDeletingGrazingSchedule={isDeletingGrazingSchedule}
        isDeletingGrazingScheduleEntry={isDeletingGrazingScheduleEntry}
      />
    );
  }
  render() {
    const { yearOptions } = this.state;
    const { plan, grazingSchedulesMap } = this.props;
    const { grazingSchedules: grazingScheduleIds } = plan;
    const grazingSchedules = grazingScheduleIds.map(id => grazingSchedulesMap[id]);

    return (
      <div className="rup__schedules__container" id={ELEMENT_ID.GRAZING_SCHEDULE}>
        <div className="rup__title--editable">
          <div>Yearly Schedules</div>
          <Dropdown
            className="icon"
            text="Add Schedule"
            header="Years"
            icon="add"
            basic
            labeled
            button
            item
            options={yearOptions}
            disabled={yearOptions.length === 0}
            onChange={this.onYearSelected}
            selectOnBlur={false}
            pointing
          />
        </div>
        <div className="rup__divider" />
        <ul className={classnames('rup__schedules', { 'rup__schedules--empty': grazingSchedules.length === 0 })}>
          {
            grazingSchedules.length === 0 ? (
              <div className="rup__section-not-found">{NOT_PROVIDED}</div>
            ) : (
              grazingSchedules.map(this.renderSchedule)
            )
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    isDeletingGrazingSchedule: getGrazingScheduleIsDeleting(state),
    isDeletingGrazingScheduleEntry: getGrazingScheduleEntryIsDeleting(state),
  }
);

EditRupGrazingSchedules.propTypes = propTypes;
export default connect(mapStateToProps, {
  addGrazingSchedule,
  updateGrazingSchedule,
  deleteGrazingSchedule,
  deleteRupGrazingSchedule,
  deleteRupGrazingScheduleEntry,
})(EditRupGrazingSchedules);
