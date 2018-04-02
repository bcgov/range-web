import React from 'react';
import PropTypes from 'prop-types';
import AgreementTable from './AgreementTable';
import AgreementSearch from './AgreementSearch';
import { Banner } from '../common';
import { SELECT_RUP_BANNER_CONTENT, SELECT_RUP_BANNER_HEADER } from '../../constants/strings';

const propTypes = {
  agreementsState: PropTypes.shape({}).isRequired,
  handlePaginationChange: PropTypes.func.isRequired,
  handleSearchInput: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
};

export const Agreement = ({
  agreementsState,
  handlePaginationChange,
  handleSearchInput,
  searchTerm,
}) => (
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

Agreement.propTypes = propTypes;
export default Agreement;
