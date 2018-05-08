import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import classnames from 'classnames';
import { DETAIL_RUP_EDIT_BANNER_CONTENT } from '../../constants/strings';
import { EXPORT_PDF } from '../../constants/routes';
import { Status, Banner } from '../common';
import RupBasicInformation from './RupBasicInformation';
import RupPastures from './RupPastures';
import EditRupSchedules from './EditRupSchedules';

const propTypes = {
  agreement: PropTypes.shape({ plan: PropTypes.object }).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  createOrUpdateRupSchedule: PropTypes.func.isRequired,
};

export class EditRup extends Component {
  constructor(props) {
    super(props);

    // store fields that can be updated within this page
    this.state = {
      plan: props.agreement.plan,
      isUpdatingRup: false,
    };
  }

  componentDidMount() {
    // requires the absolute offsetTop value
    this.stickyHeaderOffsetTop = this.stickyHeader.offsetTop;
    this.scrollListner = window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListner);
  }

  onSaveDraftClick = () => {
    const { createOrUpdateRupSchedule, agreement } = this.props;

    // create or update schedules
    const plan = agreement && agreement.plan;
    const grazingSchedules = plan && plan.grazingSchedules;
    if (plan && grazingSchedules) {
      this.setState({ isUpdatingRup: true });

      // update grazing schedules
      Promise.all(grazingSchedules.map(schedule => (
        createOrUpdateRupSchedule({ planId: plan.id, schedule })
      ))).then((data) => {
        this.setState({ isUpdatingRup: false });
        console.log(data);
      }).catch((err) => {
        this.setState({ isUpdatingRup: false });
        console.log(err);
      });
    }
  }

  setStickyRef = (ref) => { this.stickyHeader = ref; }

  handleScroll = () => {
    let isStickyFixed;
    if (window.pageYOffset >= this.stickyHeaderOffsetTop) {
      isStickyFixed = true;
    } else {
      isStickyFixed = false;
    }
    this.setState({
      isStickyFixed,
    });
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
      isStickyFixed,
      isUpdatingRup,
    } = this.state;

    const {
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
        <a
          className="rup__pdf-link"
          target="_blank"
          href={`${EXPORT_PDF}/${agreementId}/${plan.id}`}
          ref={this.setPDFRef}
        >
          pdf link
        </a>

        <Banner
          className="banner__edit-rup"
          header={agreementId}
          content={DETAIL_RUP_EDIT_BANNER_CONTENT}
        />

        <div
          className={classnames('rup__sticky', { 'rup__sticky--fixed': isStickyFixed })}
          ref={this.setStickyRef}
        >
          <div className="rup__sticky__container">
            <div className="rup__sticky__left">
              {isStickyFixed &&
                <div className="rup__sticky__title">{agreementId}</div>
              }
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
            isAdmin={false}
          />

          <RupPastures
            className="rup__pastures"
            plan={plan}
          />

          {/* <EditRupSchedules
            className="rup__edit-schedules"
            livestockTypes={livestockTypes}
            plan={plan}
            usage={usage}
          /> */}

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
EditRup.propTypes = propTypes;
export default EditRup;
