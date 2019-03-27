import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import AgreementTable from './AgreementTable';
import SearchBar from './SearchBar';
import { Banner } from '../common';
import { parseQuery, stringifyQuery } from '../../utils';
import { SELECT_RUP_BANNER_CONTENT, SELECT_RUP_BANNER_HEADER, AGREEMENT_SEARCH_PLACEHOLDER } from '../../constants/strings';
import { SEARCH_DEBOUNCE_DELAY } from '../../constants/variables';

export class SearchableAgreementTable extends Component {
  constructor(props) {
    super(props);
    this.searchAgreementsWithDebounce = debounce(this.handleSearchInput, SEARCH_DEBOUNCE_DELAY);
  }

  static propTypes = {
    history: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({ search: PropTypes.string }).isRequired,
    searchAgreementsWithOrWithoutParams: PropTypes.func.isRequired,
  }

  handleActiveIndexChange = (index, agreementId) => {
    const parsedParams = parseQuery(this.props.location.search);
    const newIndex = Number(parsedParams.row) === index ? -1 : index;

    const params = { row: newIndex, aId: agreementId };
    this.redirectWithParams(params);
  }

  handlePaginationChange = (page) => {
    const params = {
      page,
      row: null, // clear the active row
      aId: null, // and the corresponding agreementId
    };
    this.redirectWithParams(params);
  }

  handleSearchInput = (term) => {
    const params = {
      term,
      page: 1, // show new results from page 1
      row: null, // clear the active row
      aId: null, // and the corresponding agreementId
    };
    this.redirectWithParams(params);
  }

  redirectWithParams = (params) => {
    const { history, location } = this.props;
    const parsedParams = parseQuery(location.search);
    const merged = {
      ...parsedParams,
      ...params,
    };

    // redirect with new query
    history.push(`${location.pathname}?${stringifyQuery(merged)}`);
  }

  render() {
    const { location, searchAgreementsWithOrWithoutParams, isFetchingAgreements } = this.props;
    const params = parseQuery(location.search);
    const searchTerm = params.term || '';
    const activeIndex = Number(params.row);

    return (
      <section className="agreement">
        <Banner
          header={SELECT_RUP_BANNER_HEADER}
          content={SELECT_RUP_BANNER_CONTENT}
        />

        <div className="agrm__table-container">
          <SearchBar
            placeholder={AGREEMENT_SEARCH_PLACEHOLDER}
            handleSearchInput={this.searchAgreementsWithDebounce}
            searchTerm={searchTerm}
            isFetchingAgreements={isFetchingAgreements}
          />

          <AgreementTable
            {...this.props}
            activeIndex={activeIndex}
            handlePaginationChange={this.handlePaginationChange}
            handleActiveIndexChange={this.handleActiveIndexChange}
            searchAgreementsWithOrWithoutParams={searchAgreementsWithOrWithoutParams}
          />
        </div>
      </section>
    );
  }
}

export default SearchableAgreementTable;
