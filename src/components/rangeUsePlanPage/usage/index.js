import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UsageTable from './UsageTable';
import { InfoTip } from '../../common';
import { USAGE, USAGE_TIP } from '../../../constants/strings';

class Usage extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const { usage, plan } = this.props;

    return (
      <div className="rup__usage__table">
        <div className="rup__popup-header">
          <div className="rup__content-title">{USAGE}</div>
          <InfoTip header={USAGE} content={USAGE_TIP} />
        </div>
        <div className="rup__divider" />
        <UsageTable plan={plan} usage={usage} />
      </div>
    );
  }
}

export default Usage;
