import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Button } from 'semantic-ui-react';

import { RANGE_NUMBER, PLAN_START, PLAN_END, AGREEMENT_END, 
  AGREEMENT_START, AGREEMENT_TYPE, DISTRICT, ZONE, 
  ALTERNATIVE_BUSINESS_NAME, AGREEMENT_HOLDERS, TYPE, RANGE_NAME,
} from '../../constants/strings';
import { SUBMITTED, PENDING, APPROVED, NOT_APPROVED } from '../../constants/variables';
import { TextField, Status } from '../common';
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
          <TextField 
            label={RANGE_NUMBER}
            text={`07123${this.state.id}`}
          />
          <TextField 
            label={AGREEMENT_START}
            text={'Sep 13, 2010'}
          />
          <TextField 
            label={AGREEMENT_END}
            text={'Sep 13, 2019'}
          />
          <TextField 
            label={AGREEMENT_TYPE}
            text={'E01'}
          />
          <TextField 
            label={PLAN_START}
            text={'Jan 14, 2018'}
          />
          <TextField 
            label={PLAN_END}
            text={'Dec 14, 2018'}
          />
          <TextField 
            label={DISTRICT}
            text={'DND'}
          />
          <TextField 
            label={ZONE}
            text={'LASO'}
          />
        </div>

        <div className="range-use-plan__divider" />
        <Header as='h4'>Agreement Information</Header>

        <div className="range-use-plan__agreement-info">
          <TextField 
            label={RANGE_NAME}
            text={'Star Range'}
          />
          <TextField 
            label={ALTERNATIVE_BUSINESS_NAME}
            text={'Star Range Alternative'}
          />

          <TextField 
            label={AGREEMENT_HOLDERS}
            text={'Obiwan Kenobi'}
          />

          <TextField 
            label={TYPE}
            text={'Primary'}
          />

          <TextField 
            label={AGREEMENT_HOLDERS}
            text={'Luke Skywalker'}
            isLabelHidden={true}
          />

          <TextField 
            label={TYPE}
            text={'Others'}
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