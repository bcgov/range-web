import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import { Dropdown } from 'semantic-ui-react';
import { NOT_PROVIDED } from '../../../constants/strings';
import EditRupSchedule from './EditRupSchedule';
import { GRAZING_SCHEDULE_ELEMENT_ID } from '../../../constants/variables';
import { deleteRupSchedule, deleteRupScheduleEntry } from '../../../actions/rangeUsePlanActions';

const propTypes = {
  plan: PropTypes.shape({ grazingSchedules: PropTypes.array }),
  usages: PropTypes.arrayOf(PropTypes.object),
  livestockTypes: PropTypes.arrayOf(PropTypes.object),
  handleSchedulesChange: PropTypes.func.isRequired,
  deleteRupSchedule: PropTypes.func.isRequired,
  deleteRupScheduleEntry: PropTypes.func.isRequired,
  isDeletingSchedule: PropTypes.bool.isRequired,
  isDeletingScheduleEntry: PropTypes.bool.isRequired,
};

const defaultProps = {
  plan: {},
  usages: [],
  livestockTypes: [],
};

class EditRupSchedules extends Component {
  constructor(props) {
    super(props);

    this.state = {
      yearOptions: this.getInitialYearOptions(this.props.plan),
      activeScheduleIndex: 0,
    };
  }

  onYearSelected = (e, { value: year }) => {
    const grazingSchedules = [...this.props.plan.grazingSchedules];
    grazingSchedules.push({
      key: new Date().getTime(),
      year,
      grazingScheduleEntries: [],
    });
    grazingSchedules.sort((s1, s2) => s1.year > s2.year);

    const yearOptions = this.state.yearOptions.filter(y => y.value !== year);
    const activeScheduleIndex = grazingSchedules.findIndex(s => s.year === year);

    this.props.handleSchedulesChange(grazingSchedules);
    this.setState({
      yearOptions,
      activeScheduleIndex,
    });
  }

  onScheduleClicked = (scheduleIndex) => {
    const newIndex = this.state.activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;

    this.setState({ activeScheduleIndex: newIndex });
  }

  getInitialYearOptions = (plan) => {
    const { planStartDate, planEndDate } = plan || {};
    if (planStartDate && planEndDate) {
      // set up year options
      const planStartYear = new Date(planStartDate).getFullYear();
      const planEndYear = new Date(planEndDate).getFullYear();
      const length = (planEndYear - planStartYear) + 1;
      return [...Array(length)]
        .map((v, i) => (
          {
            key: planStartYear + i,
            text: planStartYear + i,
            value: planStartYear + i,
          }
        ))
        .filter((option) => {
          // give year options that hasn't been added yet in schedules
          const years = plan.grazingSchedules.map(s => s.year);
          return !(years.indexOf(option.value) >= 0);
        });
    }
    return [];
  }

  handleScheduleChange = (schedule, sIndex) => {
    const { plan, handleSchedulesChange } = this.props;
    const grazingSchedules = [...plan.grazingSchedules];
    grazingSchedules[sIndex] = schedule;
    handleSchedulesChange(grazingSchedules);
  }

  handleScheduleCopy = (year, sIndex) => {
    const { plan, handleSchedulesChange } = this.props;
    const grazingSchedules = [...plan.grazingSchedules];

    const deeoCopy = cloneDeep(grazingSchedules[sIndex].grazingScheduleEntries);
    const grazingScheduleEntries = deeoCopy.map((e, i) => {
      const { id, grazingScheduleId, ...entry } = e;
      // replace the first 4 characters with the new year
      const dateIn = entry.dateIn && typeof entry.dateIn === 'string' && `${year}${entry.dateIn.slice(4)}`;
      const dateOut = entry.dateOut && typeof entry.dateOut === 'string' && `${year}${entry.dateOut.slice(4)}`;

      return {
        ...entry,
        // prevent from generating the same key(it maps too quickly) by adding extra
        key: new Date().getTime() + (i * 10),
        dateIn,
        dateOut,
      };
    });
    grazingSchedules.push({
      key: new Date().getTime(),
      year,
      grazingScheduleEntries,
    });
    grazingSchedules.sort((s1, s2) => s1.year > s2.year);
    const activeScheduleIndex = grazingSchedules.findIndex(s => s.year === year);

    // remove this year from the year options
    this.setState({
      yearOptions: this.state.yearOptions.filter(o => o.value !== year),
      activeScheduleIndex,
    });

    handleSchedulesChange(grazingSchedules);
  }

  handleScheduleDelete = (sIndex) => {
    const { plan, handleSchedulesChange, deleteRupSchedule } = this.props;
    const grazingSchedules = [...plan.grazingSchedules];

    // a schedule is deleted so add this year to the year option list
    const [deletedSchedule] = grazingSchedules.splice(sIndex, 1);
    const planId = plan && plan.id;
    const { year, id: scheduleId } = deletedSchedule || {};
    const onDeleted = () => {
      const option = {
        key: year,
        text: year,
        value: year,
      };
      const yearOptions = [...this.state.yearOptions];
      yearOptions.push(option);
      yearOptions.sort((o1, o2) => o1.value > o2.value);

      this.setState({
        yearOptions,
        activeScheduleIndex: 0,
      });

      handleSchedulesChange(grazingSchedules);
    };

    // delete the schedule saved in server
    if (planId && scheduleId) {
      deleteRupSchedule(planId, scheduleId).then(onDeleted);
    } else { // or delete the schedule saved in state
      onDeleted();
    }
  }

  renderSchedule = (schedule, scheduleIndex) => {
    const {
      plan,
      usages,
      livestockTypes,
      deleteRupScheduleEntry,
      isDeletingSchedule,
      isDeletingScheduleEntry,
    } = this.props;
    const { yearOptions, activeScheduleIndex } = this.state;
    const key = `schedule${schedule.key || schedule.id}`;

    return (
      <EditRupSchedule
        key={key}
        yearOptions={yearOptions}
        schedule={schedule}
        scheduleIndex={scheduleIndex}
        onScheduleClicked={this.onScheduleClicked}
        activeScheduleIndex={activeScheduleIndex}
        usages={usages}
        livestockTypes={livestockTypes}
        pastures={plan.pastures}
        handleScheduleChange={this.handleScheduleChange}
        handleScheduleDelete={this.handleScheduleDelete}
        handleScheduleCopy={this.handleScheduleCopy}
        deleteRupScheduleEntry={deleteRupScheduleEntry}
        isDeletingSchedule={isDeletingSchedule}
        isDeletingScheduleEntry={isDeletingScheduleEntry}
      />
    );
  }
  render() {
    const { plan } = this.props;
    const { yearOptions } = this.state;
    const grazingSchedules = (plan && plan.grazingSchedules) || [];

    return (
      <div className="rup__schedules__container" id={GRAZING_SCHEDULE_ELEMENT_ID}>
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
    isDeletingSchedule: state.deleteRupSchedule.isLoading,
    isDeletingScheduleEntry: state.deleteRupScheduleEntry.isLoading,
  }
);

EditRupSchedules.propTypes = propTypes;
EditRupSchedules.defaultProps = defaultProps;
export default connect(mapStateToProps, { deleteRupSchedule, deleteRupScheduleEntry })(EditRupSchedules);
