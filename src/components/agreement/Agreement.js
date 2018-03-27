import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import AgreementTable from './AgreementTable';
import AgreementSearch from './AgreementSearch';
import { Banner } from '../common';
import { SELECT_RUP_BANNER_CONTENT, SELECT_RUP_BANNER_HEADER } from '../../constants/strings';

const propTypes = {
  agreements: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  searchAgreements: PropTypes.func.isRequired,
};

export class Agreement extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    // wait for 1 second for the user to finish writing a search term
    // then make a network call
    this.searchAgreements = debounce(props.searchAgreements, 1000);
  }
  
  handleSearchInput = (searchTerm) => {
    this.searchAgreements(searchTerm)
  }
  
  render() {
    const { agreements, isLoading } = this.props;

    return (
      <div className="agreement">
        <Banner
          header={SELECT_RUP_BANNER_HEADER}
          content={SELECT_RUP_BANNER_CONTENT}
        >
          <AgreementSearch
            placeholder="Enter Search Term" 
            handleSearchInput={this.handleSearchInput}
          />
        </Banner>

        <div className="agreement__table">
          <AgreementTable
            agreements={agreements}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }
}

Agreement.propTypes = propTypes;
export default Agreement;