import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Button } from 'semantic-ui-react';

import { RANGE_NUMBER, PLAN_START, PLAN_END, AGREEMENT_END, 
  AGREEMENT_START, AGREEMENT_TYPE, DISTRICT, ZONE, 
  ALTERNATIVE_BUSINESS_NAME, AGREEMENT_HOLDERS, TYPE, RANGE_NAME,
} from '../../constants/strings';
import { SUBMITTED, PENDING, APPROVED, NOT_APPROVED } from '../../constants/variables';
import { Field, Status } from '../common';
import RangeUsePlanPDFView from './RangeUsePlanPDFView';

const propTypes = {
  match: PropTypes.object.isRequired,
};

const defaultProps = {

};

export class RangeUsePlan extends Component {
  state = {
    id: null,
  }
  
  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ id });
  }

  render() {
    const id = `RAN07123${this.state.id}`;

    return (
      <div className="range-use-plan">
        <div className="range-use-plan__header">
          <Header as="h1">{`${id}`}</Header>
          <div className="range-use-plan__header__actions">
            <Status 
              className="range-use-plan__status" 
              status={PENDING}
            />
            <Button className="range-use-plan__btn range-use-plan__btn--view" primary>View PDF</Button>
            <Button className="range-use-plan__btn range-use-plan__btn--not-approved" color="red">Not Approve</Button>
            <Button className="range-use-plan__btn" color="green">Approve</Button>
          </div>
        </div>

        <Header as='h2'>Basic Information</Header>

        <div className="range-use-plan__basic-info">
          <Field 
            label={RANGE_NUMBER}
            input={`07123${this.state.id}`}
          />
          <Field 
            label={AGREEMENT_START}
            input={'Sep 13, 2010'}
          />
          <Field 
            label={AGREEMENT_END}
            input={'Sep 13, 2019'}
          />
          <Field 
            label={AGREEMENT_TYPE}
            input={'E01'}
          />
          <Field 
            label={PLAN_START}
            input={'Jan 14, 2018'}
          />
          <Field 
            label={PLAN_END}
            input={'Dec 14, 2018'}
          />
          <Field 
            label={DISTRICT}
            input={'DND'}
          />
          <Field 
            label={ZONE}
            input={'LASO'}
          />
        </div>

        <div className="range-use-plan__divider" />
        <Header as='h4'>Agreement Information</Header>

        <div className="range-use-plan__agreement-info">
          <Field 
            label={RANGE_NAME}
            input={'Star Range'}
          />
          <Field 
            label={ALTERNATIVE_BUSINESS_NAME}
            input={'Star Range Alternative'}
          />

          <Field 
            label={AGREEMENT_HOLDERS}
            input={'Obiwan Kenobi'}
          />

          <Field 
            label={TYPE}
            input={'Primary'}
          />

          <Field 
            label={AGREEMENT_HOLDERS}
            input={'Luke Skywalker'}
            isLabelHidden={true}
          />

          <Field 
            label={TYPE}
            input={'Others'}
            isLabelHidden={true}
          />
        </div>

        {/* <div className="range-use-plan__divider" />
        <Header as='h3'>Versions</Header>
        <Table basic="very">
          <Table.Body>
            <Table.Row>
              <Table.Cell collapsing>
                <div className="status">
                  <span className="status__icon status__icon--draft"></span> {DRAFT}
                </div>
              </Table.Cell>
              <Table.Cell textAlign="center">
                {'Last modified - 21/02/2018'}
              </Table.Cell>
              <Table.Cell textAlign="center">
                {'Current'}
              </Table.Cell>
              <Table.Cell textAlign="right">
                <Button primary>View</Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table> */}

        {/* <RangeUsePlanPDFView /> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  }; 
};

RangeUsePlan.propTypes = propTypes;
RangeUsePlan.defaultProps = defaultProps;

export default connect(
  mapStateToProps, null
)(RangeUsePlan);