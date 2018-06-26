import React, { Component } from 'react';
// import { connect } from 'react-redux';
import Agreement from './agreement';
// import { getAgreements, getAgreementsPagination } from '../reducers/rootReducer';

/* eslint-disable react/prefer-stateless-function */
class Home extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <Agreement {...this.props} />
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     agreements: getAgreements(state),
//     agreementsPagination: getAgreementsPagination(state),
//     plan: getPlan(state),
//     agreementsMap: getAlbums(state),
//   };
// };

export default Home;
// export default connect(mapStateToProps, {})(Home);
