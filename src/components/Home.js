import React, { Component } from 'react';
// import { connect } from 'react-redux';

import TenureAgreement from './tenureAgreement';

export class Home extends Component {
  render() {
    return (
      <div className="home"> 
        <TenureAgreement />
      </div>
    );
  }
}

export default Home;
// const mapStateToProps = state => {
//   const { user } = state.authReducer;
  
//   return {
//     user
//   };  
// };

// export default connect (
//   mapStateToProps, null
// )(Home)
