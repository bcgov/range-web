import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TenureAgreementListItem from './TenureAgreementListItem';

const propTypes = {
  tenureAgreements: PropTypes.array.isRequired,
}

const defaultProps = {
  tenureAgreements: []
}

class TenureAgreementList extends Component {
  state = {
    activeIndex: -1,
  }
  
  handleActiveRow = (index) => {
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index;
    
    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { tenureAgreements } = this.props; 
    const { activeIndex } = this.state;

    return (
      <div className="tenure-agreement-list">
        {tenureAgreements.map((tenureAgreement, index) => {
          return (
            <TenureAgreementListItem 
              key={index}
              index={index}
              isActive={activeIndex === index}
              tenureAgreement={tenureAgreement}
              onViewClicked={this.handleActiveRow}
            />
          );
        })}
      </div>
    );
  }
}

TenureAgreementList.propTypes = propTypes;
TenureAgreementList.defaultProps = defaultProps;
export default TenureAgreementList;