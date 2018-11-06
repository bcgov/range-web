import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Icon, Dropdown } from 'semantic-ui-react';
// import { TextField } from '../../common';

class UsageTableRow extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
  };

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        usage row
      </div>
    );
  }
}

export default UsageTableRow;
