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
      <div>
        <Banner
          header="Range Use Plans"
          content="This is range use plans! This is range use plans! This is range use plans! 
          This is range use plans! This is range use plans! This is range use plans! 
          This is range use plans! This is range use plans! This is range use plans!"
        >
          <RangeUsePlansSearch
            placeholder="Enter RAN#, Agreement holder's name, or staff contact" 
            handleSearchInput={this.handleSearchInput}
          />
        </Banner>

        <div className="range-use-plans container">
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