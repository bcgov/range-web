import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Dropdown } from 'semantic-ui-react';
import { TextField } from '../common';
// import { formatDate } from '../../handlers';
import {
  ALLOWABLE_AUMS, PRIVATE_LAND_DEDUCTION, GRACE_DAYS,
  PASTURE_NOTES,
} from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
};

class RupPastures extends Component {
  renderPastures = (pasture) => {
    // const options = [
    //   {
    //     key: 'edit',
    //     text: 'Edit',
    //     icon: 'edit',
    //     onClick: () => console.log('edit'),
    //   },
    //   {
    //     key: 'delete',
    //     text: 'Delete',
    //     icon: 'delete',
    //     onClick: () => console.log('delete'),
    //   },
    // ];

    return (
      <div className="rup__pasture" key={pasture.id}>
        <div className="rup__pasture__header">
          <div>
            Pasture: {pasture.name}
          </div>
          {/* <Dropdown
            trigger={<Icon name="ellipsis vertical" />}
            options={options}
            icon={null}
            pointing="top right"
          /> */}
        </div>
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
        <TextField
          label={PASTURE_NOTES}
          text={pasture.notes}
        />
        <div className="rup__sub-divider" />
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
