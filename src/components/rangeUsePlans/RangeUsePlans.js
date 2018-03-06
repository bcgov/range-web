import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Pagination, Icon } from 'semantic-ui-react';

import RangeUsePlansTable from './RangeUsePlansTable';
import RangeUsePlansSearch from './RangeUsePlansSearch';

const propTypes = {
  rangeUsePlanState: PropTypes.object.isRequired,
  searchRangeUsePlans: PropTypes.func.isRequired,
};

export class RangeUsePlans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
    }
    // wait for 1 second for the user to finish writing a search term
    // then make a network call
    this.searchRangeUsePlans = debounce(props.searchRangeUsePlans, 1000);
  }  
  
  handleSearchInput = (searchTerm) => {
    this.searchRangeUsePlans(searchTerm)
  }

  handlePaginationChange = (e, { activePage }) => this.setState({ activePage })
  
  render() {
    const { rangeUsePlans, isLoading, success, totalPages, currentPage } = this.props.rangeUsePlanState;
    const { activePage } = this.state;

    return (
      <div className="range-use-plans">
        <div className="range-use-plans__header">
          <div className="range-use-plans__header__container container">
            <h1>Range Use Plans</h1>
            <p className="range-use-plans__header__content">
              This is range use plans! This is range use plans! This is range use plans! 
              This is range use plans! This is range use plans! This is range use plans! 
              This is range use plans! This is range use plans! This is range use plans! 
            </p>          
            <RangeUsePlansSearch
              className="range-use-plans__search"
              placeholder="Enter RAN#, Agreement holder's name, or staff contact" 
              handleSearchInput={this.handleSearchInput}
            />
          </div>
        </div>

        <div className="range-use-plans__table container">
          <RangeUsePlansTable
            isLoading={isLoading}
            rangeUsePlans={rangeUsePlans}
          />

          <div className="range-use-plans__table__pagination">
            <Pagination 
              size='mini'
              activePage={activePage}
              onPageChange={this.handlePaginationChange} totalPages={totalPages}
              ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
              firstItem={{ content: <Icon name='angle double left' />, icon: true }}
              lastItem={{ content: <Icon name='angle double right' />, icon: true }}
              prevItem={{ content: <Icon name='angle left' />, icon: true }}
              nextItem={{ content: <Icon name='angle right' />, icon: true }}
            />
          </div>
        </div>
      </div>
    );
  }
}

RangeUsePlans.propTypes = propTypes;
export default RangeUsePlans;