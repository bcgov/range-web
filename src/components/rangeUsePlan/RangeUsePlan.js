import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Dropdown } from 'semantic-ui-react';
import mockupPDF from './mockup.pdf';

import { RANGE_NUMBER, PLAN_START, PLAN_END, AGREEMENT_END, 
  AGREEMENT_START, AGREEMENT_TYPE, DISTRICT, ZONE, 
  ALTERNATIVE_BUSINESS_NAME, AGREEMENT_HOLDERS, TYPE, RANGE_NAME,
} from '../../constants/strings';
import { SUBMITTED } from '../../constants/variables';
import { TextField, Status, ConfirmationModal, Banner } from '../common';
import { formatDate } from '../../handlers';
// import RangeUsePlanPDFView from './RangeUsePlanPDFView';

const propTypes = {
  rangeUsePlan: PropTypes.object.isRequired,
};

const defaultProps = {

};

export class RangeUsePlan extends Component {
  state = {
    isCompletedModalOpen: false,
    isPendingModalOpen: false,
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
    const { rangeUsePlan } = this.props;
    const { isCompletedModalOpen, isPendingModalOpen } = this.state;
    const options = [
      { key: 1, text: 'Completed', value: 1, onClick: this.openCompletedConfirmModal },
      { key: 2, text: 'Pending', value: 2, onClick: this.openPendingConfirmModal },
    ];

    return (
      <div className="range-use-plan">
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
          content="COMPLETE indicates that a RUP has either been APPROVED or DISCARDED. 
            If you change status to COMPLETE you will no longer be able to make edits to this RUP. 
            Would you like to switch this RUP to complete?"
          onNoClicked={this.closeCompletedConfirmModal}
          onYesClicked={this.closeCompletedConfirmModal}
        />

        <ConfirmationModal 
          open={isPendingModalOpen}
          header="Confirmation: Pending"
          content="PENDING indicates that a RUP is in edit mode. It is used during initial creation 
            if the decision maker has requested edits before approving. 
            Do not switch the status to PENDING unless the decision maker has requested specific edits. 
            Would you like to switch this RUP to Pending?"
          onNoClicked={this.closePendingConfirmModal}
          onYesClicked={this.closePendingConfirmModal}
        />
        <Banner
          header={rangeUsePlan.agreementId}
          content="View the full PDF file or update the status of the range use plan."
        >
          <Status 
            className="range-use-plan__status" 
            status={SUBMITTED}
          />
          <Button 
            onClick={this.onViewClicked}
            className="range-use-plan__btn" 
            
          >
            View PDF
          </Button>
          <Dropdown 
            text='Update Status' 
            options={options} 
            button
            item 
          />
        </Banner>
        
        <div className="range-use-plan__content container">
          <Header as='h2'>Basic Information</Header>
          <div className="range-use-plan__basic-info-first-row">
            <TextField 
              label={RANGE_NUMBER}
              text={rangeUsePlan.agreementId}
            />
            <TextField 
              label={AGREEMENT_START}
              text={formatDate(rangeUsePlan.agreementStartDate)}
            />
            <TextField 
              label={AGREEMENT_END}
              text={formatDate(rangeUsePlan.agreementEndDate)}
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
              text={rangeUsePlan.zone.district.code}
            />
            <TextField 
              label={ZONE}
              text={rangeUsePlan.zone.code}
            />
          </div>
            
          <div className="range-use-plan__agreement-info">
            <TextField 
              label={RANGE_NAME}
              text={rangeUsePlan.rangeName}
            />
            <TextField 
              label={ALTERNATIVE_BUSINESS_NAME}
              text={'Star Range Alternative'}
            />
            <TextField 
              label={PLAN_START}
              text={formatDate(rangeUsePlan.planStartDate)}
            />
            <TextField 
              label={PLAN_END}
              text={formatDate(rangeUsePlan.planEndDate)}
            />
          </div>
        </div>
        
      </div>
    );
  }
}

RangeUsePlan.propTypes = propTypes;
RangeUsePlan.defaultProps = defaultProps;

export default RangeUsePlan;