import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { handleGrazingScheduleValidation } from '../../../utils';
import { ErrorMessage } from '../../common';

class WarningMessage extends Component {
  static propTypes = {
    pasturesMap: PropTypes.shape({}).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
    livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    grazingSchedule: PropTypes.shape({}).isRequired,
  };

  render() {
    const {
      pasturesMap,
      livestockTypes,
      usage,
      grazingSchedule,
    } = this.props;
    const [result] = handleGrazingScheduleValidation(grazingSchedule, pasturesMap, livestockTypes, usage);
    const { message, error } = result || {};

    if (!error) {
      return <Fragment />;
    }

    return (
      <div className="rup__grazing-schedule__warning-message">
        <ErrorMessage
          message={message}
        />
      </div>
    );
  }
}

export default WarningMessage;
