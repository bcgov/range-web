import React, { Component } from 'react';
import { Link } from 'react-scroll';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ELEMENT_ID, IMAGE_SRC } from '../../constants/variables';
import * as strings from '../../constants/strings';
import { isUUID } from 'uuid-v4';

class ContentsContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.shape({}).isRequired,
  };

  renderChild = (Child, index) => {
    return (
      <div key={index} className="rup__content">
        {Child}
      </div>
    );
  };

  render() {
    const { children, plan } = this.props;

    return (
      <div className="rup__contents__container">
        <div className="rup__contents__tabs">
          <Link
            offset={-100}
            spy={true}
            to={ELEMENT_ID.BASIC_INFORMATION}
            className="rup__contents__tab"
            activeClass="rup__contents__tab--active"
          >
            <img src={IMAGE_SRC.BASIC_INFORMATION_ICON} alt="icon" />
            <span>{strings.BASIC_INFORMATION}</span>
          </Link>
          <Link
            offset={-100}
            spy={true}
            to={ELEMENT_ID.PASTURES}
            className="rup__contents__tab"
            activeClass="rup__contents__tab--active"
          >
            <img src={IMAGE_SRC.PASTURES_ICON} alt="icon" />
            <span>{strings.PASTURES}</span>
          </Link>
          <Link
            offset={-100}
            spy={true}
            to={ELEMENT_ID.SCHEDULE}
            className="rup__contents__tab"
            activeClass="rup__contents__tab--active"
          >
            <img src={IMAGE_SRC.SCHEDULES_ICON} alt="icon" />
            <span>{strings.SCHEDULES}</span>
          </Link>
          <Link
            offset={-100}
            spy={true}
            to={ELEMENT_ID.MINISTER_ISSUES}
            className="rup__contents__tab"
            activeClass="rup__contents__tab--active"
          >
            <img src={IMAGE_SRC.MINISTER_ISSUES_ICON} alt="icon" />
            <span>{strings.MINISTER_ISSUES}</span>
          </Link>
          <Link
            offset={-100}
            spy={true}
            to={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST}
            className="rup__contents__tab"
            activeClass="rup__contents__tab--active"
          >
            <img src={IMAGE_SRC.INVASIVE_PLANTS_ICON} alt="icon" />
            <span>{strings.INVASIVE_PLANTS}</span>
          </Link>
          <Link
            offset={-100}
            spy={true}
            to={ELEMENT_ID.ADDITIONAL_REQUIREMENTS}
            className="rup__contents__tab"
            activeClass="rup__contents__tab--active"
          >
            <img src={IMAGE_SRC.ADDITIONAL_REQS_ICON} alt="icon" />
            <span>{strings.ADDITIONAL_REQUIREMENTS}</span>
          </Link>
          <Link
            offset={-100}
            spy={true}
            to={ELEMENT_ID.MANAGEMENT_CONSIDERATIONS}
            className="rup__contents__tab"
            activeClass="rup__contents__tab--active"
          >
            <img src={IMAGE_SRC.MANAGEMENT_ICON} alt="icon" />
            <span>{strings.MANAGEMENT_CONSIDERATIONS}</span>
          </Link>
          {!isUUID(plan?.id) && (
            <Link
              offset={-100}
              spy={true}
              to={ELEMENT_ID.ATTACHMENTS}
              className="rup__contents__tab"
              activeClass="rup__contents__tab--active"
            >
              <img src={IMAGE_SRC.ATTACHMENTS} alt="icon" />
              <span>{strings.ATTACHMENTS}</span>
            </Link>
          )}
        </div>
        <div className="rup__contents">{children.map(this.renderChild)}</div>
      </div>
    );
  }
}

export default withRouter(ContentsContainer);
