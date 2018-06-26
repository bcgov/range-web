import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parseQuery } from '../../utils';
import Agreement from './Agreement';
import { searchAgreements } from '../../actionCreators';

const propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  history: PropTypes.shape({}).isRequired,
  searchAgreements: PropTypes.func.isRequired,
};
class Base extends Component {
  componentDidMount() {
    const { searchAgreements, location } = this.props;
    const parsedParams = parseQuery(location.search);
    searchAgreements({ ...parsedParams });
  }

  componentWillReceiveProps(nextProps) {
    const { searchAgreements, location } = this.props;
    const locationChanged = nextProps.location !== location;
    if (locationChanged) {
      const parsedParams = parseQuery(nextProps.location.search);
      searchAgreements({ ...parsedParams });
    }
  }

  render() {
    return (
      <Agreement
        {...this.props}
      />
    );
  }
}


Base.propTypes = propTypes;
export default connect(null, { searchAgreements })(Base);
