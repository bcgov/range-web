import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import TenureAgreementTable from './TenureAgreementTable';
import TenureAgreementSearch from './TenureAgreementSearch';
import { Banner } from '../common';

const propTypes = {
  tenureAgreementState: PropTypes.object.isRequired,
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
    const { data, isLoading } = this.props.tenureAgreementState;

    return (
      <div className="tenure-agreement">
        <Banner
          header="Select Range Use Plan"
          content="View details of each range use plan. Enter RAN number, Agreement holder's name, 
          or staff contact in the search box to search for a specific range use plan."
        >
          <TenureAgreementSearch
            placeholder="Enter Search Term" 
            handleSearchInput={this.handleSearchInput}
          />
        </Banner>

        <div className="tenure-agreement__table container">
          <TenureAgreementTable
            tenureAgreements={data}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }
}

TenureAgreement.propTypes = propTypes;
export default TenureAgreement;