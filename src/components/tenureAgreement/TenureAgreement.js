import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import TenureAgreementTable from './TenureAgreementTable';
import TenureAgreementSearch from './TenureAgreementSearch';
import { Banner } from '../common';
import { SELECT_RUP_BANNER_CONTENT, SELECT_RUP_BANNER_HEADER } from '../../constants/strings';

const propTypes = {
  tenureAgreements: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  searchTenureAgreements: PropTypes.func.isRequired,
};

export class TenureAgreement extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    // wait for 1 second for the user to finish writing a search term
    // then make a network call
    this.searchTenureAgreements = debounce(props.searchTenureAgreements, 1000);
  }
  
  handleSearchInput = (searchTerm) => {
    this.searchTenureAgreements(searchTerm)
  }
  
  render() {
    const { tenureAgreements, isLoading } = this.props;

    return (
      <div className="tenure-agreement">
        <Banner
          header={SELECT_RUP_BANNER_HEADER}
          content={SELECT_RUP_BANNER_CONTENT}
        >
          <TenureAgreementSearch
            placeholder="Enter Search Term" 
            handleSearchInput={this.handleSearchInput}
          />
        </Banner>

        <div className="tenure-agreement__table container">
          <TenureAgreementTable
            tenureAgreements={tenureAgreements}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }
}

TenureAgreement.propTypes = propTypes;
export default TenureAgreement;