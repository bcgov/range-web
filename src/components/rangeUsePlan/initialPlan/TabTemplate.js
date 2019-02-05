import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class TabTemplate extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    actions: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    isActive: PropTypes.bool.isRequired,
  }

  render() {
    const {
      title,
      actions,
      content,
      isActive,
    } = this.props;

    return (
      <div
        className={classnames(
          'rup__submission__tab',
          { 'rup__submission__tab--active': isActive },
          )
        }
      >
        <div className="rup__submission__tab__title">
          {title}
        </div>
        {content}
        <div className="rup__submission__tab__btns">
          {actions}
        </div>
      </div>
    );
  }
}

export default TabTemplate;
