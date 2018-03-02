import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Header, Button, Table } from 'semantic-ui-react';

import { RANGE_NUMBER, PLAN_START, PLAN_END, AGREEMENT_END, 
  AGREEMENT_START, AGREEMENT_TYPE, DISTRICT, ZONE, 
  ALTERNATIVE_BUSINESS_NAME, AGREEMENT_HOLDER, TYPE, RANGE_NAME,
} from '../../constants/strings';
import { PENDING, DRAFT, APPROVED } from '../../constants/variables';
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
    const id = ("" + this.state.id).padStart(4, "0");

    return (
      <div className="range-use-plan">
        <div className="range-use-plan__header">
          <Header as='h1'>{`Range Use Plan ${id}`}</Header>
        </div>

        <div className="range-use-plan__divider" />
        <Header as='h3'>Basic Information</Header>

        <div className="range-use-plan__basic-info">
          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{RANGE_NUMBER}</label>
            <div className="range-use-plan__form__input">{'132132'}</div>
          </div>

          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{AGREEMENT_START}</label>
            <div className="range-use-plan__form__input">{'Apr 14, 2018'}</div>
          </div>

          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{AGREEMENT_END}</label>
            <div className="range-use-plan__form__input">{'Apr 14, 2019'}</div>
          </div>

          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{AGREEMENT_TYPE}</label>
            <div className="range-use-plan__form__input">{'E01'}</div>
          </div>

          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{PLAN_START}</label>
            <div className="range-use-plan__form__input">{'Apr 14, 2018'}</div>
          </div>
          
          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{PLAN_END}</label>
            <div className="range-use-plan__form__input">{'Apr 14, 2019'}</div>
          </div>

          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{DISTRICT}</label>
            <div className="range-use-plan__form__input">{'DND'}</div>
          </div>

          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{ZONE}</label>
            <div className="range-use-plan__form__input">{'LASO'}</div>
          </div>
        </div>

        <div className="range-use-plan__divider" />
        <Header as='h3'>Agreement Information</Header>

        <div className="range-use-plan__agreement-info">
          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{RANGE_NAME}</label>
            <div className="range-use-plan__form__input">{'Star Range'}</div>
          </div>
          
          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{AGREEMENT_HOLDER}</label>
            <div className="range-use-plan__form__input">{'Obiwan Kenobi'}</div>
          </div>

          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{TYPE}</label>
            <div className="range-use-plan__form__input">{'Primary'}</div>
          </div>

          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{ALTERNATIVE_BUSINESS_NAME}</label>
            <div className="range-use-plan__form__input">{'Star Range Alternative'}</div>
          </div>
          
          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{AGREEMENT_HOLDER}</label>
            <div className="range-use-plan__form__input">{'Luke Skywalker'}</div>
          </div>
          <div className="range-use-plan__form">
            <label className="range-use-plan__form__label">{TYPE}</label>
            <div className="range-use-plan__form__input">{'Others'}</div>
          </div>
        </div>

        <div className="range-use-plan__divider" />
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
        </Table>

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