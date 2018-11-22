import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';
import { TextField } from '../../common';
import {
  ALLOWABLE_AUMS, PRIVATE_LAND_DEDUCTION, GRACE_DAYS,
  PASTURE_NOTES,
} from '../../../constants/strings';

class PastureBox extends Component {
  static propTypes = {
    pasture: PropTypes.shape({}).isRequired,
    pastureIndex: PropTypes.number.isRequired,
    activePastureIndex: PropTypes.number.isRequired,
    onPastureClicked: PropTypes.func.isRequired,
  }

  render() {
    const {
      pasture,
      pastureIndex,
      activePastureIndex,
      onPastureClicked,
    } = this.props;

    const {
      id,
      name,
      allowableAum,
      pldPercent,
      graceDays,
      notes,
    } = pasture;

    const pld = pldPercent && Math.floor(pldPercent * 100);
    const isActive = activePastureIndex === pastureIndex;

    return (
      <li key={id} className="rup__pasture">
        <div className="rup__pasture__header">
          <button
            className="rup__pasture__header__title"
            onClick={onPastureClicked(pastureIndex)}
          >
            <div>
              {`Pasture: ${name}`}
            </div>
            <div className="rup__pasture__header__right">
              { isActive
                ? <Icon style={{ marginLeft: '10px' }} name="chevron up" />
                : <Icon style={{ marginLeft: '10px' }} name="chevron down" />
              }
            </div>
          </button>
        </div>

        <div className={classnames('rup__pasture__content', { 'rup__pasture__content__hidden': !isActive })}>
          <div className="rup__row">
            <div className="rup__cell-4">
              <TextField
                label={ALLOWABLE_AUMS}
                text={allowableAum}
              />
            </div>
            <div className="rup__cell-4">
              <TextField
                label={PRIVATE_LAND_DEDUCTION}
                text={pld}
              />
            </div>
            <div className="rup__cell-4">
              <TextField
                label={GRACE_DAYS}
                text={graceDays}
              />
            </div>
          </div>
          <TextField
            label={PASTURE_NOTES}
            text={notes}
          />
        </div>
      </li>
    );
  }
}

export default PastureBox;
