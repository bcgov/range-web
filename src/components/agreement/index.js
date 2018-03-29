import React, { Component } from 'react';
import { connect } from 'react-redux';
import Agreement from './Agreement';
import { searchAgreements } from '../../actions/agreementActions';

class Base extends Component {
  componentWillMount() {
    this.props.searchAgreements();
  }

  render() {
    const { searchAgreements, agreementsState } = this.props;
    const { data, isLoading } = agreementsState;
    const agreements = data;
    
    return (
      <Agreement 
        searchAgreements={searchAgreements}
        agreements={agreements}
        isLoading={isLoading}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    agreementsState: state.agreements
  };
};

export default connect(
  mapStateToProps, { searchAgreements }
)(Base);