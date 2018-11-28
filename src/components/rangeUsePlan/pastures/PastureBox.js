import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextField, CollapsibleBox } from '../../common';
import {
  ALLOWABLE_AUMS, PRIVATE_LAND_DEDUCTION, GRACE_DAYS,
  PASTURE_NOTES,
} from '../../../constants/strings';
import PlantCommunities from '../plantCommunities';
import { IMAGE_SRC } from '../../../constants/variables';

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

    return (
      <CollapsibleBox
        key={id}
        contentIndex={pastureIndex}
        activeContentIndex={activePastureIndex}
        onContentClicked={onPastureClicked}
        header={
          <div className="rup__pasture__title">
            <img src={IMAGE_SRC.PASTURE_ICON} alt="pasture icon" />
            Pasture: {name}
          </div>
        }
        collapsibleContent={
          <Fragment>
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

            <PlantCommunities
              pasture={pasture}
            />
          </Fragment>
        }
      />
    );
  }
}

export default PastureBox;
