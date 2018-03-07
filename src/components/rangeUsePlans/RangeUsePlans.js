import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import RangeUsePlansTable from './RangeUsePlansTable';
import RangeUsePlansSearch from './RangeUsePlansSearch';
import { Banner } from '../common';

const propTypes = {
  rangeUsePlanState: PropTypes.object.isRequired,
  getRangeUsePlans: PropTypes.func.isRequired,
};

export class RangeUsePlans extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    // wait for 1 second for the user to finish writing a search term
    // then make a network call
    this.searchRangeUsePlans = debounce(props.getRangeUsePlans, 1000);
  }  
  
  handleSearchInput = (searchTerm) => {
    this.searchRangeUsePlans(searchTerm)
  }
  
  render() {
    const { data, isLoading } = this.props.rangeUsePlanState;

    return (
      <div className="range-use-plans">
        <Banner
          header="Range Use Plans"
          content="Enter RAN number, Agreement holder's name, 
          or staff contact in the search box to search for a specific range use plan."
        >
          <RangeUsePlansSearch
            placeholder="Enter Search Term" 
            handleSearchInput={this.handleSearchInput}
          />
        </Banner>

        <div className="range-use-plans__table container">
          <RangeUsePlansTable
            rangeUsePlans={data}
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  }
}

RangeUsePlans.propTypes = propTypes;
export default RangeUsePlans;