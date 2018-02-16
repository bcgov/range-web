import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import RangeUsePlanList from './RangeUsePlanList';
import RangeUsePlanSearch from './RangeUsePlanSearch';

const propTypes = {
  rangeUsePlans: PropTypes.array.isRequired,
  searchRangeUsePlans: PropTypes.func.isRequired,
}

const defaultProps = {
  rangeUsePlans: [
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
  searchRangeUsePlans: (term) => {
    console.log(term);
  },
}

export class RangeUsePlanPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    this.searchRangeUsePlans = debounce(props.searchRangeUsePlans, 1000);
  }  
  
  handleSearchInput = (searchTerm) => {
    this.searchRangeUsePlans(searchTerm)
  }
  
  render() {
    const { rangeUsePlans } = this.props;

    return (
      <div className="range-use-plan">
        <div className="range-use-plan__header">
          Range Use Plans
        </div>

        <div className="range-use-plan__search">
          <RangeUsePlanSearch
            label="Search Plans:"
            placeholder="Enter Search Terms..." 
            handleSearchInput={this.handleSearchInput}
          />
        </div>

        <RangeUsePlanList 
          rangeUsePlans={rangeUsePlans}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  }; 
};

RangeUsePlanPage.propTypes = propTypes;
RangeUsePlanPage.defaultProps = defaultProps;

export default connect(
  mapStateToProps, null
)(RangeUsePlanPage);