import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchAgreements, getPlan } from '../actionCreators';
import { getAgreements, getAgreementsPagination } from '../reducers/rootReducer';

/* eslint-disable react/prefer-stateless-function */
class Home extends Component {
  componentDidMount() {
    this.props.searchAgreements('all');
    this.props.getPlan();
  }

  render() {
    return (
      <div> hello </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    agreements: getAgreements(state),
    agreementsPagination: getAgreementsPagination(state),
    // plan: getPlan(state),
    // agreementsMap: getAlbums(state),
    // artists: getArtists(state),
    // selectedArtist: getSelectedArtist(state),
    // libraryAlbums: getLibraryAlbums(state),
  };
};

export default connect(mapStateToProps, { searchAgreements, getPlan })(Home);
