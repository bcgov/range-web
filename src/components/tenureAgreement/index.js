import React, { Component } from 'react';
import { connect } from 'react-redux';
import TenureAgreement from './TenureAgreement';
import { searchTenureAgreements } from '../../actions/tenureAgreementActions';

class Base extends Component {
  componentDidMount() {
    this.props.searchTenureAgreements();
  }

  render() {
    return (
      <TenureAgreement {...this.props} />
    );
  }
}

const mapStateToProps = state => {
  return {
    tenureAgreementState: state.tenureAgreements
  };
};

export default connect(
  mapStateToProps, { searchTenureAgreements }
)(Base);