import React, { Component } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import queryString from 'query-string';
import Agreement from './Agreement';
import { getAgreements } from '../../actions/agreementActions';
import { RANGE_USE_PLANS } from '../../constants/routes';

class Base extends Component {
  state = {
    searchTerm: '',
  }

  componentWillReceiveProps(nextProps) {
    const { location, getAgreements } = this.props;
    const locationChanged = nextProps.location !== location;
    if (locationChanged) {
      const parsedParams = queryString.parse(nextProps.location.search);
      getAgreements({ ...parsedParams });
    }
  }

  componentDidMount() {
    const { getAgreements, location } = this.props;
    const parsedParams = queryString.parse(location.search);
    if (parsedParams.term) {
      this.setState({ searchTerm: parsedParams.term });    
    }
    getAgreements({ ...parsedParams });
    this.searchAgreementsWithDebounce = debounce(this.handleSearchInput, 1000);
  }

  handlePaginationChange = (currentPage) => {
    const { history } = this.props;
    const parsedParams = queryString.parse(history.location.search);
    parsedParams.page = currentPage;
    history.push(`${RANGE_USE_PLANS}?${queryString.stringify(parsedParams)}`);
  }

  handleSearchInput = (term) => {
    const { history } = this.props;
    const parsedParams = queryString.parse(history.location.search);
    // show new results from page 1
    parsedParams.page = 1;
    parsedParams.term = term;
    history.push(`${RANGE_USE_PLANS}?${queryString.stringify(parsedParams)}`);
  }

  render() {
    const { agreementsState } = this.props;
    const { searchTerm } = this.state;
    return (
      <Agreement
        agreementsState={agreementsState}
        handlePaginationChange={this.handlePaginationChange}
        handleSearchInput={this.searchAgreementsWithDebounce}
        searchTerm={searchTerm}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    agreementsState: state.agreements
  };
};

export default connect(
  mapStateToProps, { getAgreements }
)(Base);