import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Agreement from './Agreement';
import { getAgreements } from '../../actions/agreementActions';

const propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  getAgreements: PropTypes.func.isRequired,
};

class Base extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const { getAgreements, location } = this.props;
    const parsedParams = queryString.parse(location.search);
    getAgreements({ ...parsedParams });
  }

  componentWillReceiveProps(nextProps) {
    const { getAgreements, location } = this.props;
    const locationChanged = nextProps.location !== location;
    if (locationChanged) {
      const parsedParams = queryString.parse(nextProps.location.search);
      getAgreements({ ...parsedParams });
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

const mapStateToProps = state => (
  {
    agreementsState: state.agreements,
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, { getAgreements })(Base);
