import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
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

    this.searchAgreementsWithDebounce = debounce(this.handleSearchInput, 1000);
  }

  handlePaginationChange = (page) => {
    const params = { page };
    this.reRouteWithParams(params);
  }

  handleSearchInput = (term) => {
    const params = {
      page: 1, // show new results from page 1
      term,
    };
    this.reRouteWithParams(params);
  }

  reRouteWithParams = (additionalParams) => {
    const { history, location } = this.props;
    const parsedParams = parseQuery(location.search);
    const params = {
      ...parsedParams,
      ...additionalParams,
    };
    history.push(`${location.pathname}?${stringifyQuery(params)}`);
  }

  render() {
    const { history, location } = this.props;
    const searchTerm = parseQuery(location.search).term || '';

    return (
      <section className="agreement">
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
      </section>
    );
  }
}

Agreement.propTypes = propTypes;
export default Agreement;
