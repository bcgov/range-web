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
  render() {
    const { tenureAgreements } = this.props; 

    return (
      <div className="tenure-agreement-list">
        {tenureAgreements.map((tenureAgreement, index) => {
          return (
            <TenureAgreementListItem 
              key={index}
              tenureAgreement={tenureAgreement}
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