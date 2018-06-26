import React, { Component } from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Agreement from './agreement';
// import { getAgreements, getAgreementsPagination } from '../reducers/rootReducer';

/* eslint-disable react/prefer-stateless-function */
const propTypes = {
  location: PropTypes.shape({ search: PropTypes.string }),
  history: PropTypes.shape({}),
};
const defaultProps = {
  location: {
    search: '',
    pathname: '/home',
  },
  history: {
    push: () => {},
  },
};
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
Home.propTypes = propTypes;
Home.defaultProps = defaultProps;
export default Home;
// export default connect(null, {})(Home);
