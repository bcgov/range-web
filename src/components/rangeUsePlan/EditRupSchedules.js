import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import { NOT_PROVIDED } from '../../constants/strings';
import EditRupSchedule from './EditRupSchedule';

const propTypes = {
  plan: PropTypes.shape({ grazingSchedules: PropTypes.array }),
  usage: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string.isRequired,
  handleSchedulesChange: PropTypes.func.isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
  plan: {},
  usage: [],
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
    grazingSchedules.push({ year, grazingScheduleEntries: [] });
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
    const { activeScheduleIndex } = this.state;
    const newIndex = activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;

    this.setState({ activeScheduleIndex: newIndex });
  }

  getInitialYearOptions = (plan) => {
    const { planStartDate, planEndDate } = plan || {};
    if (planStartDate && planEndDate) {
      // set up year options
      const psd = new Date(planStartDate).getFullYear();
      const ped = new Date(planEndDate).getFullYear();
      const length = (ped - psd) + 1;
      return [...Array(length)]
        .map((v, i) => (
          {
            key: psd + i,
            text: psd + i,
            value: psd + i,
          }
        ))
        .filter((option) => {
          // give only available year options
          const years = plan.grazingSchedules.map(s => s.year);
          return !years.includes(option.value);
        });
    }
    return [];
  }

  handleScheduleChange = (schedule, sIndex) => {
    const grazingSchedules = [...this.props.plan.grazingSchedules];
    grazingSchedules[sIndex] = schedule;

    this.props.handleSchedulesChange(grazingSchedules);
  }

  renderSchedule = (schedule, scheduleIndex) => {
    const { plan, usage, livestockTypes } = this.props;
    const key = `schedule${scheduleIndex}`;

    return (
      <EditRupSchedule
        key={key}
        schedule={schedule}
        scheduleIndex={scheduleIndex}
        onScheduleClicked={this.onScheduleClicked}
        activeScheduleIndex={this.state.activeScheduleIndex}
        usage={usage}
        livestockTypes={livestockTypes}
        pastures={plan.pastures}
        handleScheduleChange={this.handleScheduleChange}
      />
    );
  }

  render() {
    const { className, plan } = this.props;
    const { yearOptions } = this.state;
    const grazingSchedules = plan && plan.grazingSchedules;

    return (
      <div className={className}>
        <div className="rup__title--editable">
          <div>Yearly Schedules</div>
          <Dropdown
            className="icon"
            text="Add Yearly schedule"
            icon="add"
            basic
            labeled
            button
            item
            options={yearOptions}
            disabled={yearOptions.length === 0}
            onChange={this.onYearSelected}
            selectOnBlur={false}
          />
        </div>
        <div className="rup__divider" />
        <ul className="rup__schedules">
          {
            grazingSchedules.length === 0 ? (
              <div className="rup__section-not-found">{NOT_PROVIDED}</div>
            ) : (
              grazingSchedules
                .map(this.renderSchedule)
            )
          }
        </ul>
        {/* <Button onClick={this.onSaveClick}>Save Schedules</Button> */}
      </div>
    );
  }
}

EditRupSchedules.propTypes = propTypes;
EditRupSchedules.defaultProps = defaultProps;
export default EditRupSchedules;
