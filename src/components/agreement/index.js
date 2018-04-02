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

  componentWillMount() {
    const { getAgreements, location } = this.props;
    const parsedParams = queryString.parse(location.search);
    getAgreements({ ...parsedParams });
    this.searchAgreementsWithDebounce = debounce(this.handleSearchInput, 1000);
  }

  componentWillReceiveProps(nextProps) {
    const { location, getAgreements } = this.props;
    const locationChanged = nextProps.location !== location;
    if (locationChanged) {
      const parsedParams = queryString.parse(nextProps.location.search);
      getAgreements({
        ...parsedParams
      });
    }
  }

  componentDidMount() {
    const parsedParams = queryString.parse(this.props.location.search);
    if (parsedParams.term) {
      this.setState({ searchTerm: parsedParams.term });    
    }
  }

  handlePaginationChange = (currentPage) => {
    const { history, location } = this.props;
    const parsedParams = queryString.parse(location.search);
    parsedParams.page = currentPage;
    history.push(`${RANGE_USE_PLANS}?${queryString.stringify(parsedParams)}`);
  }

  handleSearchInput = (term) => {
    const { history, location } = this.props;
    const parsedParams = queryString.parse(location.search);
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