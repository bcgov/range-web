import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'semantic-ui-react';
import UpdateZoneModal from './UpdateZoneModal';
import {
  COMPLETED_CONFIRMATION_CONTENT, COMPLETED_CONFIRMATION_HEADER,
  DETAIL_RUP_BANNER_CONTENT,
} from '../../constants/strings';
import { EXPORT_PDF } from '../../constants/routes';
import { COMPLETED, CHANGE_REQUESTED, RUP_STICKY_HEADER_ELEMENT_ID, PRIMARY_TYPE, OTHER_TYPE } from '../../constants/variables';
import { Status, ConfirmationModal, Banner } from '../common';
import RupBasicInformation from './view/RupBasicInformation';
import RupPastures from './view/RupPastures';
import RupGrazingSchedules from './view/RupGrazingSchedules';
import RupMinisterIssues from './view/RupMinisterIssues';
import { PlanStatus } from '../../models';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  agreement: PropTypes.shape({}).isRequired,
  updateRupStatus: PropTypes.func.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.object).isRequired,
  ministerIssueTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  isDownloadingPDF: PropTypes.bool.isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  ministerIssueActionTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export class Rup extends Component {
  constructor(props) {
    super(props);

    // store fields that can be updated within this page
    const { zone, plan } = props.agreement;
    const { status } = plan || {};

    this.state = {
      isCompletedModalOpen: false,
      isPendingModalOpen: false,
      isUpdateZoneModalOpen: false,
      zone,
      status,
      plan,
    };
  }

  componentDidMount() {
    this.stickyHeader = document.getElementById(RUP_STICKY_HEADER_ELEMENT_ID);
    // requires the absolute offsetTop value
    this.stickyHeaderOffsetTop = this.stickyHeader.offsetTop;
    this.scrollListner = window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListner);
  }

  onViewPDFClicked = () => {
    const { id, agreementId } = this.state.plan;
    if (id && agreementId) {
      this.pdfLink.click();
    }
  }

  onYesCompletedClicked = () => {
    this.updateStatus(COMPLETED, this.closeCompletedConfirmModal);
  }

  onYesPendingClicked = () => {
    this.updateStatus(CHANGE_REQUESTED, this.closePendingConfirmModal);
  }

  onZoneClicked = () => {
    this.openUpdateZoneModal();
  }

  onZoneUpdated = (newZone) => {
    this.setState({ zone: newZone });
  }

  getAgreementHolders = (clients = []) => {
    let primaryAgreementHolder = {};
    const otherAgreementHolders = [];
    clients.forEach((client) => {
      if (client.clientTypeCode === PRIMARY_TYPE) {
        primaryAgreementHolder = client;
      } else if (client.clientTypeCode === OTHER_TYPE) {
        otherAgreementHolders.push(client);
      }
    });

    return { primaryAgreementHolder, otherAgreementHolders };
  }

  setPDFRef = (ref) => { this.pdfLink = ref; }

  handleScroll = () => {
    if (this.stickyHeader) {
      if (window.pageYOffset >= this.stickyHeaderOffsetTop) {
        this.stickyHeader.classList.add('rup__sticky--fixed');
      } else {
        this.stickyHeader.classList.remove('rup__sticky--fixed');
      }
    }
  }

  updateStatus = (statusName, closeConfirmModal) => {
    const { agreement, statuses: statusReferences, updateRupStatus } = this.props;
    const { plan } = agreement;
    const status = statusReferences.find(s => s.name === statusName);
    if (status && plan) {
      const requestData = {
        planId: plan.id,
        statusId: status.id,
      };
      const statusUpdated = (newStatus) => {
        closeConfirmModal();
        this.setState({
          status: newStatus,
        });
      };
      updateRupStatus(requestData).then(statusUpdated);
    }
  }

  openModal = property => this.setState({ [property]: true })

  closeModal = property => this.setState({ [property]: false })

  openCompletedConfirmModal = () => this.openModal('isCompletedModalOpen')

  closeCompletedConfirmModal = () => this.closeModal('isCompletedModalOpen')

  openPendingConfirmModal = () => this.openModal('isPendingModalOpen')

  closePendingConfirmModal = () => this.closeModal('isPendingModalOpen')

  openUpdateZoneModal = () => this.openModal('isUpdateZoneModalOpen')

  closeUpdateZoneModal = () => this.closeModal('isUpdateZoneModalOpen')

  render() {
    const {
      isCompletedModalOpen,
      isPendingModalOpen,
      isUpdateZoneModalOpen,
      plan,
      zone,
      status: s,
    } = this.state;

    const {
      user,
      agreement,
      isUpdatingStatus,
      isDownloadingPDF,
      livestockTypes,
      ministerIssueTypes,
      ministerIssueActionTypes,
    } = this.props;

    const statusDropdownOptions = [
      {
        key: 'completed',
        text: COMPLETED,
        value: 1,
        onClick: this.openCompletedConfirmModal,
      },
      {
        key: 'change requested',
        text: CHANGE_REQUESTED,
        value: 2,
        onClick: this.openPendingConfirmModal,
      },
    ];
    const status = new PlanStatus(s);

    const agreementId = agreement && agreement.id;
    const usages = agreement && agreement.usage;
    const clients = agreement && agreement.clients;
    const { primaryAgreementHolder } = this.getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

    return (
      <div className="rup">
        <a
          className="rup__pdf-link"
          target="_blank"
          href={`${EXPORT_PDF}/${agreementId}/${plan.id}`}
          ref={this.setPDFRef}
        >
          pdf link
        </a>

        <UpdateZoneModal
          isUpdateZoneModalOpen={isUpdateZoneModalOpen}
          closeUpdateZoneModal={this.closeUpdateZoneModal}
          onZoneUpdated={this.onZoneUpdated}
          agreementId={agreementId}
          currZone={zone}
        />

        <ConfirmationModal
          open={isCompletedModalOpen}
          header={COMPLETED_CONFIRMATION_HEADER}
          content={COMPLETED_CONFIRMATION_CONTENT}
          onNoClicked={this.closeCompletedConfirmModal}
          onYesClicked={this.onYesCompletedClicked}
          loading={isUpdatingStatus}
        />

        <ConfirmationModal
          open={isPendingModalOpen}
          header="Confirmation: Request Change"
          content="Are you sure you want to request changes to the agreement holder?"
          onNoClicked={this.closePendingConfirmModal}
          onYesClicked={this.onYesPendingClicked}
          loading={isUpdatingStatus}
        />

        <Banner
          className="banner__no-default-height"
          header={agreementId}
          content={DETAIL_RUP_BANNER_CONTENT}
        />

        <div id={RUP_STICKY_HEADER_ELEMENT_ID} className="rup__sticky">
          <div className="rup__sticky__container">
            <div className="rup__sticky__left">
              <div className="rup__sticky__title">{agreementId}</div>
              <div className="rup__sticky__primary-agreement-holder">{primaryAgreementHolderName}</div>
              <Status
                className="rup__status"
                status={s}
                user={user}
              />
            </div>
            <div className="rup__sticky__btns">
              <Button
                onClick={this.onViewPDFClicked}
                className="rup__btn"
                loading={isDownloadingPDF}
              >
                View PDF
              </Button>
              {(status.isPending || status.isCreated) &&
                <Dropdown
                  className="rup__status-dropdown"
                  text="Update Status"
                  options={statusDropdownOptions}
                  button
                  item
                />
              }
            </div>
          </div>
        </div>
        <div className="rup__content">
          <RupBasicInformation
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            zone={zone}
            user={user}
            onZoneClicked={this.onZoneClicked}
          />

          <RupPastures
            className="rup__pastures"
            plan={plan}
          />

          <RupGrazingSchedules
            className="rup__schedules__container"
            plan={plan}
            status={status}
            usages={usages}
            livestockTypes={livestockTypes}
          />

          <RupMinisterIssues
            className="rup__missues__container"
            plan={plan}
            ministerIssueTypes={ministerIssueTypes}
            ministerIssueActionTypes={ministerIssueActionTypes}
          />
        </div>
      </div>
    );
  }
}

Rup.propTypes = propTypes;
export default Rup;
