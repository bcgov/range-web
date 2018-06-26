import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import AgreementTable from './AgreementTable';
import AgreementSearch from './AgreementSearch';
import { Banner } from '../common';
import { parseQuery, stringifyQuery } from '../../utils';
import { SELECT_RUP_BANNER_CONTENT, SELECT_RUP_BANNER_HEADER } from '../../constants/strings';

const propTypes = {
  history: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
};

export class Agreement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: parseQuery(props.location.search).term || '',
    };
    this.searchAgreementsWithDebounce = debounce(this.handleSearchInput, 1000);
  }

  handlePaginationChange = (currentPage) => {
    const { history, location } = this.props;
    const parsedParams = parseQuery(location.search);
    parsedParams.page = currentPage;
    history.push(`${location.pathname}?${stringifyQuery(parsedParams)}`);
  }

  handleSearchInput = (term) => {
    const { history, location } = this.props;
    const parsedParams = parseQuery(location.search);
    // show new results from page 1
    parsedParams.page = 1;
    parsedParams.term = term;
    history.push(`${location.pathname}?${stringifyQuery(parsedParams)}`);
  }

  render() {
    const { searchTerm } = this.state;
    const { history } = this.props;
    return (
      <div className="agreement">
        <Banner
          header={SELECT_RUP_BANNER_HEADER}
          content={SELECT_RUP_BANNER_CONTENT}
        >
          <AgreementSearch
            placeholder="Enter Search Term"
            handleSearchInput={this.searchAgreementsWithDebounce}
            searchTerm={searchTerm}
          />
        </Banner>

        <div className="agreement__table">
          <AgreementTable
            history={history}
            handlePaginationChange={this.handlePaginationChange}
          />
        </div>
      </div>
    );
  }
}

Agreement.propTypes = propTypes;
export default Agreement;
