import React, { Component } from 'react';
import { connect } from 'react-redux';
import TenureAgreement from './TenureAgreement';
import { searchTenureAgreements } from '../../actions/tenureAgreementActions';

class Base extends Component {
  componentDidMount() {
    this.props.searchTenureAgreements();
  }

  render() {
    const { searchTenureAgreements, tenureAgreementsState } = this.props;
    const { data, isLoading } = tenureAgreementsState;
    const tenureAgreements = data;
    
    return (
      <TenureAgreement 
        searchTenureAgreements={searchTenureAgreements}
        tenureAgreements={tenureAgreements}
        isLoading={isLoading}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    tenureAgreementsState: state.tenureAgreements
  };
};

export default connect(
  mapStateToProps, { searchTenureAgreements }
)(Base);