import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class TabForm extends Component {
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
          'multi-form__tab',
          { 'multi-form__tab--active': isActive },
          )
        }
      >
        <div className="multi-form__tab__title">
          {title}
        </div>
        {content}
        <div className="multi-form__btns">
          {actions}
        </div>
      </div>
    );
  }
}

export default TabForm;
