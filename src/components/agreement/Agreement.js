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
    this.state = {
      activeIndex: -1,
    };
    this.searchAgreementsWithDebounce = debounce(this.handleSearchInput, 1000);
  }

  handleActiveIndexChange = (index) => {
    const newIndex = this.state.activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  handlePaginationChange = (page) => {
    const params = { page };
    this.redirectWithParams(params);
  }

  handleSearchInput = (term) => {
    const params = {
      page: 1, // show new results from page 1
      term,
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
    // clear active Index
    this.setState({ activeIndex: -1 });
    // redirect with new query
    history.push(`${location.pathname}?${stringifyQuery(merged)}`);
  }

  render() {
    const { history, location } = this.props;
    const searchTerm = parseQuery(location.search).term || '';
    const { activeIndex } = this.state;

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

        <div className="agreement__table-container">
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
