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
    const { history, location } = this.props;
    const params = parseQuery(location.search);
    const searchTerm = params.term || '';
    const activeIndex = Number(params.row);

    return (
      <section className="agreement">
        <Banner
          header={SELECT_RUP_BANNER_HEADER}
          content={SELECT_RUP_BANNER_CONTENT}
        >
          <AgreementSearch
            placeholder="Enter RAN, agreement holder's name, or staff contact"
            handleSearchInput={this.searchAgreementsWithDebounce}
            searchTerm={searchTerm}
          />
        </Banner>

        <div className="agrm__table-container">
          <AgreementTable
            history={history}
            activeIndex={activeIndex}
            handlePaginationChange={this.handlePaginationChange}
            handleActiveIndexChange={this.handleActiveIndexChange}
          />
        </div>
      </section>
    );
  }
}

Agreement.propTypes = propTypes;
export default Agreement;
