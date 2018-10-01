import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ELEMENT_ID } from '../../constants/variables';

class RupContent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  renderChild = (child, index) => {
    const { props } = child;
    /*
      setup a reference point for each content
      that's little bit above of the content due to the sticky header
    */
    return (
      <div key={index} className="rup__content">
        <div id={props.elementId} className="rup__content__ref" />
        {child}
      </div>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <div className="rup__contents__container">
        <div className="rup__contents__tabs">
          <a href={`#${ELEMENT_ID.BASIC_INFORMATION}`}>
            Basic Information
          </a>
          <a href={`#${ELEMENT_ID.PASTURES}`}>
            Pastures
          </a>
          <a href={`#${ELEMENT_ID.GRAZING_SCHEDULE}`}>
            Schedules
          </a>
          <a href={`#${ELEMENT_ID.MINISTER_ISSUES}`}>
            Minister Issues
          </a>
        </div>
        <div className="rup__contents">
          {children.map(this.renderChild)}
        </div>
      </div>
    );
  }
}

export default RupContent;
