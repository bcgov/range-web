import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parseQuery } from '../../utils';
import SearchableAgreementTable from './SearchableAgreementTable';
import { searchAgreements, fetchAgreement } from '../../actionCreators';
import { agreementSearchChanged } from '../../actions';
import { SELECT_RUP_TITLE } from '../../constants/strings';
import { getAgreementsErrorOccured, getIsFetchingAgreements } from '../../reducers/rootReducer';

class Base extends Component {
  static propTypes = {
    location: PropTypes.shape({ search: PropTypes.string }).isRequired,
    history: PropTypes.shape({}).isRequired,
    searchAgreements: PropTypes.func.isRequired,
    fetchAgreement: PropTypes.func.isRequired,
  }

  componentWillMount() {
    document.title = SELECT_RUP_TITLE;
  }

  componentDidMount() {
    const { fetchAgreement, location } = this.props;
    const params = parseQuery(location.search);

    // initial search for agreements with the given query
    this.searchAgreementsWithOrWithoutParams(params);

    // initial fetching an agreement with all plans for the active row
    if ((params.row >= 0) && params.aId) {
      fetchAgreement(params.aId);
    }
  }

  searchAgreementsWithOrWithoutParams = (p) => {
    const { searchAgreements, location } = this.props;
    let params = p;
    if (!params) {
      params = parseQuery(location.search);
    }

    searchAgreements(params);
  }

  componentWillReceiveProps(nextProps) {
    const { agreementSearchChanged, fetchAgreement, location } = this.props;
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

      agreementSearchChanged(params);

      // search new agreements only when users search for term or click on different pages
      if ((oldParams.page !== page) || (oldParams.term !== term)) {
        this.searchAgreementsWithOrWithoutParams(params);
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
        searchAgreementsWithOrWithoutParams={this.searchAgreementsWithOrWithoutParams}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => (
  {
    isFetchingAgreements: getIsFetchingAgreements(state),
    errorGettingAgreements: getAgreementsErrorOccured(state),
  }
);

export default connect(mapStateToProps, {
  searchAgreements,
  fetchAgreement,
  agreementSearchChanged,
})(Base);
