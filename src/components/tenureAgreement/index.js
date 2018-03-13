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

    return (
      <TenureAgreement 
        searchTenureAgreements={searchTenureAgreements}
        tenureAgreementsState={tenureAgreementsState}
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