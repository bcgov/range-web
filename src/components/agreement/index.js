import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import queryString from 'query-string';
import Agreement from './Agreement';
import { getAgreements } from '../../actions/agreementActions';
import { RANGE_USE_PLANS } from '../../constants/routes';

const propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  history: PropTypes.shape({}).isRequired,
  agreementsState: PropTypes.shape({}).isRequired,
  getAgreements: PropTypes.func.isRequired,
};

class Base extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: queryString.parse(props.location.search).term || '',
    };
    this.searchAgreementsWithDebounce = debounce(this.handleSearchInput, 1000);
  }

  componentDidMount() {
    const { getAgreements, location } = this.props;
    const parsedParams = queryString.parse(location.search);
    getAgreements({ ...parsedParams });
  }

  componentWillReceiveProps(nextProps) {
    const { location, getAgreements } = this.props;
    const locationChanged = nextProps.location !== location;
    if (locationChanged) {
      const parsedParams = queryString.parse(nextProps.location.search);
      getAgreements({ ...parsedParams });
    }
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

const mapStateToProps = state => (
  {
    agreementsState: state.agreements,
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, { getAgreements })(Base);
