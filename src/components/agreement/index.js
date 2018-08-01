import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parseQuery } from '../../utils';
import Agreement from './Agreement';
import { searchAgreements, fetchAgreement } from '../../actionCreators';

const propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  history: PropTypes.shape({}).isRequired,
  searchAgreements: PropTypes.func.isRequired,
  fetchAgreement: PropTypes.func.isRequired,
};
class Base extends Component {
  componentDidMount() {
    // initial search with the given query
    const { searchAgreements, fetchAgreement, location } = this.props;
    const params = parseQuery(location.search);
    searchAgreements({ ...params });

    // initial fetching for an agreement with all plans
    if ((params.row >= 0) && params.aId) {
      fetchAgreement(params.aId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { searchAgreements, fetchAgreement, location } = this.props;
    const locationChanged = nextProps.location !== location;

    if (locationChanged) {
      const oldParams = parseQuery(location.search);
      const params = parseQuery(nextProps.location.search);
      const {
        page,
        term,
        row,
        aId: agreementId,
      } = params;

      // search new agreements only when users search for term or click on different pages
      if ((oldParams.page !== page) || (oldParams.term !== term)) {
        searchAgreements({ ...params });
      }

      // fetch a new agreement with all plans when the active row changes
      if (agreementId && (oldParams.row !== row) && (row >= 0)) {
        fetchAgreement(agreementId);
      }
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
export default connect(null, { searchAgreements, fetchAgreement })(Base);
