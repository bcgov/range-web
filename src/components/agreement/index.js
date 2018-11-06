import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parseQuery } from '../../utils';
import SearchableAgreementTable from './SearchableAgreementTable';
import { searchAgreements, fetchAgreement } from '../../actionCreators';
import { SELECT_RUP_TITLE } from '../../constants/strings';

const propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  history: PropTypes.shape({}).isRequired,
  searchAgreements: PropTypes.func.isRequired,
  fetchAgreement: PropTypes.func.isRequired,
};
class Base extends Component {
  componentWillMount() {
    document.title = SELECT_RUP_TITLE;
  }

  componentDidMount() {
    const { searchAgreements, fetchAgreement, location } = this.props;

    // initial search for agreements with the given query
    const params = parseQuery(location.search);
    searchAgreements({ ...params });

    // initial fetching an agreement with all plans for the active row
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
      <SearchableAgreementTable
        {...this.props}
      />
    );
  }
}


Base.propTypes = propTypes;
export default connect(null, { searchAgreements, fetchAgreement })(Base);
