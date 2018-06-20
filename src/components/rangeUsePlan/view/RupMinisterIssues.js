import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Icon, Dropdown } from 'semantic-ui-react';
import { TextField } from '../../common';
import {
  NOT_PROVIDED,
} from '../../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
};

class RupMinisterIssues extends Component {
  renderMinisterIssues = (ministerIssue) => {

  }

  render() {
    const { plan, className } = this.props;
    const ministerIssues = (plan && plan.ministerIssues) || [];

    return (
      <div className={className}>
        <div className="rup__title">Minister's Issues and Actions</div>
        <div className="rup__divider" />
        {
          ministerIssues.length === 0 ? (
            <div className="rup__section-not-found">{NOT_PROVIDED}</div>
          ) : (
            ministerIssues.map(this.renderMinisterIssues)
          )
        }
      </div>
    );
  }
}

RupMinisterIssues.propTypes = propTypes;
export default RupMinisterIssues;
