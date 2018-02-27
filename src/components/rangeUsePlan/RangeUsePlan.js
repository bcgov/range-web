import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import RangeUsePlanPDFView from './RangeUsePlanPDFView';

const propTypes = {
  match: PropTypes.object.isRequired,
};

const defaultProps = {

};

export class RangeUsePlan extends Component {
  state = {
    id: null,
  }
  
  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ id });
  }

  render() {
    const options = [
      { key: 'A', value: 'AL', text: '10/11/2017 - Pending' },
      { key: 'L', value: 'AL', text: '12/01/2017 - Approved' },
      { key: 'AL', value: 'AL', text: '14/11/2016 - Approved' },
    ];
    const id = ("" + this.state.id).padStart(4, "0");

    return (
      <div className="range-use-plan">
        <div className="range-use-plan__header">
          <div className="range-use-plan__title">
            {`Range Use Plan #${id}`}
          </div>

          <div className="range-use-plan__dropdown">
            <Dropdown 
              placeholder='select other range use plans' 
              search 
              selection
              fluid 
              options={options} 
            />
          </div>
        </div>
        
        <RangeUsePlanPDFView />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  }; 
};

RangeUsePlan.propTypes = propTypes;
RangeUsePlan.defaultProps = defaultProps;

export default connect(
  mapStateToProps, null
)(RangeUsePlan);