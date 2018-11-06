import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UsageTable from './UsageTable';

class Usage extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    usage: PropTypes.arrayOf(PropTypes.object).isRequired,
    className: PropTypes.string.isRequired,
  };

  render() {
    const { className, usage, plan } = this.props;

    return (
      <div className={className}>
        <div className="rup__content-title">Usage</div>
        <div className="rup__divider" />
        <UsageTable
          plan={plan}
          usage={usage}
        />
      </div>
    );
  }
}

export default Usage;
