import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import * as utils from '../../../utils';
import * as strings from '../../../constants/strings';
import GrazingScheduleBox from './GrazingScheduleBox';

class GrazingSchedules extends Component {
  static propTypes = {
    elementId: PropTypes.string.isRequired,
    plan: PropTypes.shape({}).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    grazingSchedulesMap: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  state = {
    activeScheduleIndex: 0,
  }

  onScheduleClicked = scheduleIndex => () => {
    this.setState((prevState) => {
      const newIndex = prevState.activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;
      return {
        activeScheduleIndex: newIndex,
      };
    });
  }

  renderSchedules = (grazingSchedules = []) => {
    const { plan } = this.props;
    const status = plan && plan.status;

    if (utils.isStatusDraft(status)) {
      return (
        <div className="rup__grazing-schedule__draft-container">
          <div className="rup__grazing-schedule__in-draft">
            <Icon name="lock" size="big" />
            <div style={{ marginLeft: '10px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 'bold' }}> RUP Awaiting Input from Agreement Holder </div>
              <div style={{ opacity: '0.7' }}> This section will remain hidden until the agreement holder submits for staff reviews. </div>
            </div>
          </div>
        </div>
      );
    }
    if (grazingSchedules.length === 0) {
      return <div className="rup__section-not-found">{strings.NOT_PROVIDED}</div>;
    }

    return (
      <ul className={classnames('rup__grazing-schedules', { 'rup__grazing-schedules--empty': grazingSchedules.length === 0 })}>
        {grazingSchedules.map(this.renderSchedule)}
      </ul>
    );
  }

  renderSchedule = (schedule, scheduleIndex) => {
    return (
      <GrazingScheduleBox
        key={schedule.id}
        schedule={schedule}
        scheduleIndex={scheduleIndex}
        activeScheduleIndex={this.state.activeScheduleIndex}
        onScheduleClicked={this.onScheduleClicked}
        {...this.props}
      />
    );
  }

  render() {
    const { elementId, plan, grazingSchedulesMap } = this.props;
    const grazingScheduleIds = plan && plan.grazingSchedules;
    const grazingSchedules = grazingScheduleIds && grazingScheduleIds.map(id => grazingSchedulesMap[id]);

    return (
      <div id={elementId} className="rup__grazing-schedules__container">
        <div className="rup__content-title">Schedules</div>
        <div className="rup__divider" />
        {this.renderSchedules(grazingSchedules)}
      </div>
    );
  }
}

export default GrazingSchedules;
