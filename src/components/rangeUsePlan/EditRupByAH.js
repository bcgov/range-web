import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { DETAIL_RUP_EDIT_BANNER_CONTENT, SAVE_PLAN_AS_DRAFT_SUCCESS } from '../../constants/strings';
import { Status, Banner } from '../common';
import RupBasicInformation from './RupBasicInformation';
import RupPastures from './RupPastures';
import EditRupSchedules from './EditRupSchedules';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  agreement: PropTypes.shape({ plan: PropTypes.object }).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  createOrUpdateRupSchedule: PropTypes.func.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
  toastSuccessMessage: PropTypes.func.isRequired,
};

export class EditRupByAH extends Component {
  constructor(props) {
    super(props);

    // store fields that can be updated within this page
    this.state = {
      plan: props.agreement.plan,
    };
  }

  componentDidMount() {
    this.stickyHeader = document.getElementById('edit-rup-sticky-header');
    // requires the absolute offsetTop value
    this.stickyHeaderOffsetTop = this.stickyHeader.offsetTop;
    this.scrollListner = window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListner);
  }

  onSaveDraftClick = () => {
    const {
      createOrUpdateRupSchedule,
      toastErrorMessage,
      toastSuccessMessage,
      agreement,
    } = this.props;

    const plan = agreement && agreement.plan;
    const grazingSchedules = plan && plan.grazingSchedules;

    if (plan && grazingSchedules) {
      this.setState({ isUpdatingRup: true });

      // update grazing schedules(create or update each schedule)
      Promise.all(grazingSchedules.map(schedule => (
        createOrUpdateRupSchedule({ planId: plan.id, schedule })
      ))).then(() => {
        this.setState({ isUpdatingRup: false });
        toastSuccessMessage(SAVE_PLAN_AS_DRAFT_SUCCESS);
      }).catch((err) => {
        this.setState({ isUpdatingRup: false });
        toastErrorMessage(err);
        throw err;
      });
    }
  }

  setStickyRef = (ref) => { this.stickyHeader = ref; }

  handleScroll = () => {
    if (window.pageYOffset >= this.stickyHeaderOffsetTop) {
      this.stickyHeader.classList.add('rup__sticky--fixed');
    } else {
      this.stickyHeader.classList.remove('rup__sticky--fixed');
    }
  }

  handleSchedulesChange = (schedules) => {
    const { plan } = this.state;
    plan.grazingSchedules = schedules;
    this.setState({
      plan,
    });
  }

  render() {
    const {
      plan,
      isUpdatingRup,
    } = this.state;

    const {
      user,
      agreement,
      livestockTypes,
    } = this.props;

    const status = plan && plan.status;
    const statusName = status && status.name;
    const agreementId = agreement && agreement.id;
    const zone = agreement && agreement.zone;
    const usage = agreement && agreement.usage;

    return (
      <div className="rup">
        <Banner
          className="banner__edit-rup"
          header={agreementId}
          content={DETAIL_RUP_EDIT_BANNER_CONTENT}
        />

        <div
          id="edit-rup-sticky-header"
          className="rup__sticky"
          ref={this.setStickyRef}
        >
          <div className="rup__sticky__container">
            <div className="rup__sticky__left">
              <div className="rup__sticky__title">{agreementId}</div>
              <Status
                className="rup__status"
                status={statusName}
              />
            </div>
            <div className="rup__sticky__btns">
              <Button loading={isUpdatingRup} onClick={this.onSaveDraftClick}>Save Draft</Button>
              <Button style={{ marginLeft: '15px' }}>Submit for Review</Button>
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
          />

          <RupPastures
            className="rup__pastures"
            plan={plan}
          />

          <EditRupSchedules
            className="rup__edit-schedules"
            livestockTypes={livestockTypes}
            plan={plan}
            usage={usage}
            handleSchedulesChange={this.handleSchedulesChange}
          />
        </div>
      </div>
    );
  }
}

EditRupByAH.propTypes = propTypes;
export default EditRupByAH;
