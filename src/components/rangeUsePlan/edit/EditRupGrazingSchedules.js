import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Dropdown } from 'semantic-ui-react';
import { NOT_PROVIDED } from '../../../constants/strings';
// import EditRupGrazingSchedule from './EditRupGrazingSchedule';
import { ELEMENT_ID } from '../../../constants/variables';
import { deleteRupSchedule, deleteRupScheduleEntry } from '../../../actionCreators';
import { createEmptyArray } from '../../../utils';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  grazingScheduleEntriesMap: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  usages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export class EditRupGrazingSchedules extends Component {
  constructor(props) {
    super(props);
    const { plan, grazingSchedulesMap } = this.props;
    this.state = {
      yearOptions: this.getInitialYearOptions(plan, grazingSchedulesMap),
      activeScheduleIndex: 0,
    };
  }

  getInitialYearOptions = (plan, grazingSchedulesMap) => {
    const { planStartDate, planEndDate, grazingSchedules: grazingScheduleIds } = plan || {};
    if (planStartDate && planEndDate) {
      // set up year options
      const planStartYear = new Date(planStartDate).getFullYear();
      const planEndYear = new Date(planEndDate).getFullYear();
      const length = (planEndYear - planStartYear) + 1;
      return createEmptyArray(length)
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

  render() {
    return (
      <div>
        schedules
      </div>
    )
  }
}

EditRupGrazingSchedules.propTypes = propTypes;
export default connect(null, { deleteRupSchedule, deleteRupScheduleEntry })(EditRupGrazingSchedules);
