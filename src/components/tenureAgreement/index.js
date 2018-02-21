import React, { Component } from 'react';
import TenureAgreement from './TenureAgreement';

export default class extends Component {
  render() {
    return (
      <TenureAgreement {...this.props} />
    );
  }
}

