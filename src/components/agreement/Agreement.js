import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AgreementTable from './AgreementTable';
import AgreementSearch from './AgreementSearch';
import { Banner } from '../common';
import { SELECT_RUP_BANNER_CONTENT, SELECT_RUP_BANNER_HEADER } from '../../constants/strings';

const propTypes = {
  agreementsState: PropTypes.object.isRequired,
};

export class Agreement extends Component {
  render() {
    const { 
      agreementsState,
      handlePaginationChange,
      handleSearchInput,
      searchTerm 
    } = this.props;

    return (
      <div className="agreement">
        <Banner
          header={SELECT_RUP_BANNER_HEADER}
          content={SELECT_RUP_BANNER_CONTENT}
        >
          <AgreementSearch
            placeholder="Enter Search Term" 
            handleSearchInput={handleSearchInput}
            searchTerm={searchTerm}
          />
        </Banner>

        <div className="agreement__table">
          <AgreementTable
            agreementsState={agreementsState}
            handlePaginationChange={handlePaginationChange}
          />
        </div>
      </div>
    );
  }
}

Agreement.propTypes = propTypes;
export default Agreement;