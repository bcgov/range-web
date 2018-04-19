import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Icon } from 'semantic-ui-react';
import { TextField } from '../common';
// import { formatDate } from '../../handlers';
import {
  ALLOWABLE_AUMS, PRIVATE_LAND_DEDUCTION, GRACE_DAYS,
} from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
};

class RupPastures extends Component {
  renderPastures = (pasture) => {
    return (
      <div key={pasture.id}>
        <div className="rup__info-title">Pasture: {pasture.name}</div>
        <div className="rup__row">
          <div className="rup__cell-4">
            <TextField
              label={ALLOWABLE_AUMS}
              text={pasture.allowableAum}
            />
          </div>
          <div className="rup__cell-4">
            <TextField
              label={PRIVATE_LAND_DEDUCTION}
              text={pasture.pldPercent}
            />
          </div>
          <div className="rup__cell-4">
            <TextField
              label={GRACE_DAYS}
              text={pasture.graceDays}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { plan, className } = this.props;

    return (
      <div className={className}>
        <div className="rup__title">Pastures</div>
        <div className="rup__divider" />
        {plan.pastures && plan.pastures.map(this.renderPastures)}
      </div>
    );
  }
}

RupPastures.propTypes = propTypes;
export default RupPastures;
