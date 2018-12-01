import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ELEMENT_ID, IMAGE_SRC, CONTENT_MARGIN_TOP, CONTENT_MARGIN_BOTTOM, STICKY_HEADER_HEIGHT } from '../../constants/variables';
import { MINISTER_ISSUES, SCHEDULES, PASTURES, BASIC_INFORMATION, INVASIVE_PLANTS, ADDITIONAL_REQUIREMENTS, MANAGEMENT_CONSIDERATIONS } from '../../constants/strings';

class ContentsContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.shape({}).isRequired,
  }

  renderChild = (child, index) => {
    const { props: ChildProps } = child;
    const { elementId, ...rest } = ChildProps;
    const Child = {
      ...child,
      props: rest,
    };
    /*
      setup a reference point for each content
      that's little bit above of the content due to the sticky header
    */
    return (
      <div key={index} className="rup__content">
        <div id={elementId} className="rup__content__ref" />
        {Child}
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);

    // manually click on the active tab once DOMs are rendered
    const { location } = this.props;
    const { hash: currHash } = location;
    const tabs = document.querySelectorAll('.rup__contents__tab');
    tabs.forEach((tab) => {
      if (currHash === tab.hash) {
        tab.click();
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    /* change the active tab on scroll buggy */
    const { pageYOffset } = window;
    const references = document.querySelectorAll('.rup__content__ref');

    // find the id of the current content that's being displayed in the screen
    let displayedContentId;
    references.forEach((ref) => {
      const { offsetTop: ost, offsetHeight } = ref.parentElement;

      // reevalulate offsetTop due to the position of the reference <a> tag
      const offset = 3;
      const offsetTop = ost - (STICKY_HEADER_HEIGHT + CONTENT_MARGIN_TOP + offset);
      const offsetBottom = offsetTop + offsetHeight + CONTENT_MARGIN_BOTTOM + offset;
      if (pageYOffset >= offsetTop && pageYOffset <= offsetBottom) {
        displayedContentId = ref.id;
      }
    });

    const tabs = document.querySelectorAll('.rup__contents__tab');
    tabs.forEach((tab) => {
      // clean up the previous active class in all tabs
      tab.classList.remove('rup__contents__tab--active');

      // set active to the tab that's related to the current content
      if (displayedContentId && (`#${displayedContentId}` === tab.hash)) {
        tab.classList.add('rup__contents__tab--active');
      }
    });
  }

  render() {
    const { children } = this.props;

    return (
      <div className="rup__contents__container">
        <div className="rup__contents__tabs">
          <a
            href={`#${ELEMENT_ID.BASIC_INFORMATION}`}
            className="rup__contents__tab"
          >
            <img src={IMAGE_SRC.BASIC_INFORMATION_ICON} alt="icon" />
            <span>{BASIC_INFORMATION}</span>
          </a>
          <a
            href={`#${ELEMENT_ID.PASTURES}`}
            className="rup__contents__tab"
          >
            <img src={IMAGE_SRC.PASTURES_ICON} alt="icon" />
            <span>{PASTURES}</span>
          </a>
          <a
            href={`#${ELEMENT_ID.GRAZING_SCHEDULE}`}
            className="rup__contents__tab"
          >
            <img src={IMAGE_SRC.SCHEDULES_ICON} alt="icon" />
            <span>{SCHEDULES}</span>
          </a>
          <a
            href={`#${ELEMENT_ID.MINISTER_ISSUES}`}
            className="rup__contents__tab"
          >
            <img src={IMAGE_SRC.MINISTER_ISSUES_ICON} alt="icon" />
            <span>{MINISTER_ISSUES}</span>
          </a>
          <a
            href={`#${ELEMENT_ID.INVASIVE_PLANT_CHECKLIST}`}
            className="rup__contents__tab"
          >
            <img src={IMAGE_SRC.INVASIVE_PLANTS_ICON} alt="icon" />
            <span>{INVASIVE_PLANTS}</span>
          </a>
          <a
            href={`#${ELEMENT_ID.ADDITIONAL_REQUIREMENTS}`}
            className="rup__contents__tab"
          >
            <img src={IMAGE_SRC.ADDITIONAL_REQS_ICON} alt="icon" />
            <span>{ADDITIONAL_REQUIREMENTS}</span>
          </a>
          <a
            href={`#${ELEMENT_ID.MANAGEMENT_CONSIDERATIONS}`}
            className="rup__contents__tab"
          >
            <img src={IMAGE_SRC.MANAGEMENT_ICON} alt="icon" />
            <span>{MANAGEMENT_CONSIDERATIONS}</span>
          </a>
        </div>
        <div className="rup__contents">
          {children.map(this.renderChild)}
        </div>
      </div>
    );
  }
}

export default withRouter(ContentsContainer);
