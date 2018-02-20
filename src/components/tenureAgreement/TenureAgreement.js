import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import TenureAgreementList from './TenureAgreementList';
import TenureAgreementSearch from './TenureAgreementSearch';

const propTypes = {
  tenureAgreements: PropTypes.array.isRequired,
  searchTenureAgreements: PropTypes.func.isRequired,
}

const defaultProps = {
  tenureAgreements: [
    {
      number: 1,
      tenureHolder: {
        name: "tenure holder #1"
      }
    },
    {
      number: 2,
      tenureHolder: {
        name: "tenure holder #2"
      }
    },
    {
      number: 3,
      tenureHolder: {
        name: "tenure holder #3"
      }
    },
    {
      number: 4,
      tenureHolder: {
        name: "tenure holder #4"
      }
    }
  ],
  searchTenureAgreements: (term) => {
    console.log(term);
  },
}

export class TenureAgreement extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
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