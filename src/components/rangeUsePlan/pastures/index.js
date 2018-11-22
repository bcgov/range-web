import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NOT_PROVIDED } from '../../../constants/strings';
import PastureBox from './PastureBox';

class Pastures extends Component {
  static propTypes = {
    elementId: PropTypes.string.isRequired,
    plan: PropTypes.shape({}).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    className: PropTypes.string.isRequired,
  };

  state = {
    activePastureIndex: 0,
  }

  onPastureClicked = pastureIndex => () => {
    this.setState((prevState) => {
      const newIndex = prevState.activePastureIndex === pastureIndex ? -1 : pastureIndex;
      return {
        activePastureIndex: newIndex,
      };
    });
  }


  renderPasture = (pasture, pastureIndex) => {
    return (
      <PastureBox
        key={pasture.id}
        pasture={pasture}
        pastureIndex={pastureIndex}
        activePastureIndex={this.state.activePastureIndex}
        onPastureClicked={this.onPastureClicked}
      />
    );
  }

  renderPastures = (pastures = []) => {
    const isPastureEmpty = pastures.length === 0;

    return isPastureEmpty ? (
      <div className="rup__section-not-found">{NOT_PROVIDED}</div>
    ) : (
      <ul className={classnames('rup__pastures', { 'rup__pastures--empty': isPastureEmpty })}>
        {pastures.map(this.renderPasture)}
      </ul>
    );
  }

  render() {
    const { elementId, plan, pasturesMap, className } = this.props;
    const pastureIds = plan && plan.pastures;
    const pastures = pastureIds && pastureIds.map(id => pasturesMap[id]);

    return (
      <div id={elementId} className={className}>
        <div className="rup__content-title">Pastures</div>
        <div className="rup__divider" />
        {this.renderPastures(pastures)}
      </div>
    );
  }
}

export default Pastures;
