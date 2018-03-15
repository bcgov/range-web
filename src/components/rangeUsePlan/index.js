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
    const { getRangeUsePlan, match } = this.props;
    const { id } = match.params;
    getRangeUsePlan(id);
  }

  render() {
    const { data, isLoading } = this.props.rangeUsePlanState;
    const rangeUsePlan = data instanceof Array ? {} : data;

    return (
      <Form loading={isLoading}>
        <RangeUsePlan 
          rangeUsePlan={rangeUsePlan}
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