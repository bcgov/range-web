import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MonitoringAreaRow from './MonitoringAreaRow';

class MonitoringAreasBox extends Component {
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
    const { monitoringAreas } = this.props;

    return (
      <div className="rup__plant-community__monitoring-areas">
        {monitoringAreas.map(this.renderMonitoringArea)}
      </div>
    );
  }
}

export default MonitoringAreasBox;
