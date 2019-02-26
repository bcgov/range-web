import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid-v4';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown } from 'semantic-ui-react';
import { NOT_PROVIDED } from '../../../constants/strings';
import { REFERENCE_KEY } from '../../../constants/variables';
import { deleteRUPGrazingSchedule } from '../../../actionCreators';
import { grazingScheduleAdded, grazingScheduleUpdated, grazingScheduleDeleted } from '../../../actions';
import * as utils from '../../../utils';
import EditableGrazingScheduleBox from './EditableGrazingScheduleBox';

export class EditableGrazingSchedules extends Component {
  static propTypes = {
    plan: PropTypes.shape({ grazingSchedules: PropTypes.array }).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    grazingSchedulesMap: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
    grazingScheduleAdded: PropTypes.func.isRequired,
    grazingScheduleDeleted: PropTypes.func.isRequired,
    deleteRUPGrazingSchedule: PropTypes.func.isRequired,
  };
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

  onScheduleClicked = scheduleIndex => () => {
    this.setState((prevState) => {
      const newIndex = prevState.activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;
      return {
        activeScheduleIndex: newIndex,
      };
    });
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
    const { plan, grazingScheduleDeleted, deleteRUPGrazingSchedule } = this.props;

    const planId = plan && plan.id;
    const { year, id: scheduleId } = schedule;
    const onDeleted = () => {
      const option = {
        key: year,
        text: year,
        value: year,
      };
      // put the year back to the year option list and sort them
      const { yearOptions: currYearOptions } = this.state;
      const yearOptions = [...currYearOptions];
      yearOptions.push(option);
      yearOptions.sort((o1, o2) => o1.value - o2.value);

      this.setState({
        yearOptions,
        activeScheduleIndex: 0,
      });
      // construct a new list of schedule ids without the deleted one
      const grazingSchedules = [...plan.grazingSchedules];
      grazingSchedules.splice(scheduleIndex, 1);

      grazingScheduleDeleted({
        planId, // for plansReducer
        grazingSchedules, // for plansReducer
        grazingScheduleId: scheduleId, // for grazingSchedulesReducer
      });
    };

    // delete the schedule saved in server
    if (planId && scheduleId && !uuid.isUUID(scheduleId)) {
      deleteRUPGrazingSchedule(planId, scheduleId).then(onDeleted);
    } else { // or delete the schedule saved in Redux store
      onDeleted();
    }
  }

  addGrazingScheduleInStore = (grazingSchedule) => {
    const { grazingScheduleAdded, plan, grazingSchedulesMap } = this.props;
    const { yearOptions: currYearOptions } = this.state;

    // construct a new sorted list of grazing schedules
    const newGrazingSchedules = [
      ...plan.grazingSchedules.map(id => grazingSchedulesMap[id]),
      grazingSchedule,
    ];
    newGrazingSchedules.sort((s1, s2) => s1.year - s2.year);

    // pass the copied grazing schedule and new sorted list of schedule ids for the plan reducer
    grazingScheduleAdded({
      planId: plan.id,
      grazingSchedules: newGrazingSchedules.map(s => s.id),
      grazingSchedule,
    });

    // remove this year from the year options and set active to the newly copied schedule
    this.setState({
      yearOptions: currYearOptions.filter(o => o.value !== grazingSchedule.year),
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
      plan,
      usage,
      references,
      pasturesMap,
    } = this.props;
    const { yearOptions, activeScheduleIndex } = this.state;
    const { id, year } = schedule;
    const yearUsage = usage.find(u => u.year === year);
    const authorizedAUMs = (yearUsage && yearUsage.authorizedAum) || 0;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const crownTotalAUMs = utils.calcCrownTotalAUMs(schedule.grazingScheduleEntries, pasturesMap, livestockTypes);
    const pastures = (plan && plan.pastures) || [];
    return (
      <EditableGrazingScheduleBox
        key={id}
        yearOptions={yearOptions}
        schedule={schedule}
        scheduleIndex={scheduleIndex}
        onScheduleClicked={this.onScheduleClicked}
        activeScheduleIndex={activeScheduleIndex}
        livestockTypes={livestockTypes}
        pastures={pastures}
        usage={usage}
        authorizedAUMs={authorizedAUMs}
        crownTotalAUMs={crownTotalAUMs}
        handleScheduleCopy={this.handleScheduleCopy}
        handleScheduleDelete={this.handleScheduleDelete}
      />
    );
  }
  render() {
    const { yearOptions } = this.state;
    const { plan, grazingSchedulesMap } = this.props;
    const grazingScheduleIds = plan && plan.grazingSchedules;
    const grazingSchedules = grazingScheduleIds && grazingScheduleIds.map(id => grazingSchedulesMap[id]);
    const isEmpty = grazingSchedules.length === 0;

    return (
      <div className="rup__grazing-schedules">
        <div className="rup__content-title--editable">
          Yearly Schedules
          <Dropdown
            className="icon rup__grazing-schedules__add-dropdown"
            text="Add Schedule"
            header="Years"
            icon="add circle"
            basic
            labeled
            button
            item
            options={yearOptions}
            disabled={yearOptions.length === 0}
            onChange={this.onYearSelected}
            selectOnBlur={false}
            pointing
            compact
          />
        </div>
        <div className="rup__divider" />
        {
          isEmpty ? (
            <div className="rup__section-not-found">No graze period.</div>
          ) : (
            <ul
              className={classnames(
                'collaspible-boxes',
                { 'collaspible-boxes--empty': isEmpty },
              )}
            >
              {grazingSchedules.map(this.renderSchedule)}
            </ul>
          )
        }
      </div>
    );
  }
}

export default connect(null, {
  grazingScheduleAdded,
  grazingScheduleUpdated,
  grazingScheduleDeleted,
  deleteRUPGrazingSchedule,
})(EditableGrazingSchedules);
