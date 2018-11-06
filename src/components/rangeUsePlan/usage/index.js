import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Icon, Dropdown } from 'semantic-ui-react';
// import { TextField } from '../../common';

class UsageTable extends Component {
  static propTypes = {
    agreement: PropTypes.shape({}).isRequired,
    className: PropTypes.string.isRequired,
  };

  render() {
    const { className } = this.props;

    return (
      <div className={className}>
        usage
      </div>
    );
  }
}

export default UsageTable;
