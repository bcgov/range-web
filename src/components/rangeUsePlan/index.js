import React, { Component } from 'react';
import { connect } from 'react-redux';
import RangeUsePlan from './RangeUsePlan';
import { getRangeUsePlan } from '../../actions/tenureAgreementActions';
import { Form } from 'semantic-ui-react';

class Base extends Component {
  state = {
    id: null,
    rangeUsePlan: null,
  }
  
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getRangeUsePlan(id);
  }

  render() {
    const { rangeUsePlanState } = this.props;

    return (
      <Form loading={rangeUsePlanState.isLoading}>
        <RangeUsePlan 
          rangeUsePlan={rangeUsePlanState.data}
        />
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    rangeUsePlanState: state.rangeUsePlan
  };
};

export default connect(
  mapStateToProps, { getRangeUsePlan }
)(Base);