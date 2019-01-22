import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MonitoringAreaRow from './MonitoringAreaBox';

class MonitoringAreas extends Component {
  static propTypes = {
    monitoringAreas: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }

  renderMonitoringArea = (monitoringArea) => {
    return (
      <MonitoringAreaRow
        key={monitoringArea.id}
        monitoringArea={monitoringArea}
      />
    );
  }

  render() {
    const { monitoringAreas = [] } = this.props;

    return (
      <div className="rup__plant-community__m-areas">
        {monitoringAreas.length === 0 &&
          <div>No monitoring area</div>
        }
        {monitoringAreas.map(this.renderMonitoringArea)}
      </div>
    );
  }
}

export default MonitoringAreas;
