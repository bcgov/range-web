import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import TenureAgreementList from './TenureAgreementList';
import TenureAgreementSearch from './TenureAgreementSearch';

import { getMockTenureAgreements } from './test/mockValues';

const propTypes = {
  tenureAgreements: PropTypes.array.isRequired,
  searchTenureAgreements: PropTypes.func.isRequired,
}

const defaultProps = {
  tenureAgreements: getMockTenureAgreements(6),
  searchTenureAgreements: (term) => {
    console.log(term);
  },
}

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
    const { tenureAgreements } = this.props;

    return (
      <div className="tenure-agreement">
        <div className="tenure-agreement__header">
          Tenure Agreements
        </div>

        <div className="tenure-agreement__search">
          <TenureAgreementSearch
            label="Search Agreements:"
            placeholder="Enter Search Terms..." 
            handleSearchInput={this.handleSearchInput}
          />
        </div>

        <TenureAgreementList 
          tenureAgreements={tenureAgreements}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  }; 
};

TenureAgreement.propTypes = propTypes;
TenureAgreement.defaultProps = defaultProps;

export default connect(
  mapStateToProps, null
)(TenureAgreement);