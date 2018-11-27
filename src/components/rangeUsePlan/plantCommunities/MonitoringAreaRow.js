import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { handleNullValue } from '../../../utils';

class MonitoringAreaRow extends Component {
  static propTypes = {
    monitoringArea: PropTypes.shape({}).isRequired,
  }

  render() {
    const maClass = 'rup__plant-community__monitoring-area';
    const { monitoringArea } = this.props;
    const {
      latitude,
      location,
      longitude,
      name,
      otherPurpose,
      purposeTypeIds,
      purposes,
      rangelandHealth,
      transectAzimuth,
    } = monitoringArea;

    return (
      <div className={`${maClass}__row`}>
        monitoring area
      </div>
    );
  }
}

export default MonitoringAreaRow;
