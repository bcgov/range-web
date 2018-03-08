import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Dropdown } from 'semantic-ui-react';
import mockupPDF from './mockup.pdf';

import { RANGE_NUMBER, PLAN_START, PLAN_END, AGREEMENT_END, 
  AGREEMENT_START, AGREEMENT_TYPE, DISTRICT, ZONE, 
  ALTERNATIVE_BUSINESS_NAME, AGREEMENT_HOLDERS, TYPE, RANGE_NAME,
} from '../../constants/strings';
import { SUBMITTED } from '../../constants/variables';
import { TextField, Status, ConfirmationModal } from '../common';
// import RangeUsePlanPDFView from './RangeUsePlanPDFView';

const propTypes = {
  match: PropTypes.object.isRequired,
};

const defaultProps = {

};

export class RangeUsePlan extends Component {
  state = {
    id: null,
    isCompletedModalOpen: false,
    isPendingModalOpen: false,
  }
  
  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ id });
  }

  onViewClicked = () => {
    this.pdfLink.click();
  }

  openCompletedConfirmModal = () => {
    this.setState({ isCompletedModalOpen: true });
  }

  closeCompletedConfirmModal = () => {
    this.setState({ isCompletedModalOpen: false });
  }

  openPendingConfirmModal = () => {
    this.setState({ isPendingModalOpen: true });
  }
  
  closePendingConfirmModal = () => {
    this.setState({ isPendingModalOpen: false });
  }

  render() {
    const { id, isCompletedModalOpen, isPendingModalOpen } = this.state;
    const options = [
      { key: 1, text: 'Completed', value: 1, onClick: this.openCompletedConfirmModal },
      { key: 2, text: 'Pending', value: 2, onClick: this.openPendingConfirmModal },
    ];

    return (
      <div className="range-use-plan container">
        <a 
          className="range-use-plan__pdf-link" 
          href={mockupPDF}
          ref={(pdfLink) => this.pdfLink = pdfLink}
          target="_black" 
        >
          pdf link
        </a>

        <ConfirmationModal
          open={isCompletedModalOpen}
          header="Confirmation: Completed"
          content="Are you sure this range use plan is completed?"
          onNoClicked={this.closeCompletedConfirmModal}
          onYesClicked={this.closeCompletedConfirmModal}
        />

        <ConfirmationModal 
          open={isPendingModalOpen}
          header="Confirmation: Pending"
          content="Are you sure this range use plan is not completed?"
          onNoClicked={this.closePendingConfirmModal}
          onYesClicked={this.closePendingConfirmModal}
        />

        <div className="range-use-plan__header">
          <Header as="h1">{id}</Header>
          <div className="range-use-plan__header__actions">
            <Status 
              className="range-use-plan__status" 
              status={SUBMITTED}
            />
            <Button 
              onClick={this.onViewClicked}
              className="range-use-plan__btn" 
              primary
            >
              View PDF
            </Button>
            <Dropdown 
              text='Update Status' 
              options={options} 
              button
              item 
            />
          </div>
        </div>

        <Header as='h2'>Basic Information</Header>

        <div className="range-use-plan__basic-info-first-row">
          <TextField 
            label={RANGE_NUMBER}
            text={id}
          />
          <TextField 
            label={AGREEMENT_START}
            text={'Sep 13, 2010'}
          />
          <TextField 
            label={AGREEMENT_END}
            text={'Sep 13, 2019'}
          />
        </div>
        <div className="range-use-plan__basic-info-second-row">
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
        <div className="range-use-plan__basic-info-third-row">
          <TextField 
            label={AGREEMENT_TYPE}
            text={'E01'}
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
            label={PLAN_START}
            text={'Jan 14, 2018'}
          />
          <TextField 
            label={PLAN_END}
            text={'Dec 14, 2018'}
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

RangeUsePlan.propTypes = propTypes;
RangeUsePlan.defaultProps = defaultProps;

export default RangeUsePlan;