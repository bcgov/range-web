import React, { Component } from 'react';
import { connect } from 'react-redux';
import ManazeZone from './ManageZone';

class Base extends Component {
  render() {
    return <ManazeZone {...this.props} />
  }
}

const mapStateToProps = state => (
  {

  }
);

export default connect(mapStateToProps, { })(Base);
