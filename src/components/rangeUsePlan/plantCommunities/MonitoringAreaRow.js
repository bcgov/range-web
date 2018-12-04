import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getMonitoringAreaPurposes } from '../../../utils';

class MonitoringAreaRow extends Component {
  static propTypes = {
    monitoringArea: PropTypes.shape({}).isRequired,
  }

  render() {
    const maClass = 'rup__plant-community__m-area';
    const { monitoringArea } = this.props;
    const {
      latitude,
      location,
      longitude,
      name,
      otherPurpose,
      purposes,
      rangelandHealth,
    } = monitoringArea;
    console.log(monitoringArea);

    const rangelandHealthName = rangelandHealth && rangelandHealth.name;
    const purposeNames = getMonitoringAreaPurposes(purposes, otherPurpose);
    return (
      <div className={`${maClass}__row`}>
        <div>
          Monitoring Area: {name}
        </div>
        <div>
          Location: {location}
        </div>
        <div>
          Rangeland Health: {rangelandHealthName}
        </div>
        <div>
          Purposes: {purposeNames}
        </div>
        <div>
          Latitude: {latitude}
        </div>
        <div>
          Longitude: {longitude}
        </div>
      </div>
    );
  }
}

export default MonitoringAreaRow;
