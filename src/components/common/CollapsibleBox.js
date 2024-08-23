import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';

class CollapsibleBox extends Component {
  static propTypes = {
    header: PropTypes.node.isRequired,
    headerRight: PropTypes.node,
    shouldHideHeaderRightWhenNotActive: PropTypes.bool,
    message: PropTypes.node,
    collapsibleContent: PropTypes.node.isRequired,
    contentIndex: PropTypes.number.isRequired,
    activeContentIndex: PropTypes.number.isRequired,
    onContentClicked: PropTypes.func,
    onContentClick: PropTypes.func,
    scroll: PropTypes.bool,
    error: PropTypes.bool,
  };

  static defaultProps = {
    headerRight: null,
    shouldHideHeaderRightWhenNotActive: false,
    message: null,
  };

  render() {
    const {
      contentIndex,
      activeContentIndex,
      onContentClicked,
      onContentClick,
      header,
      headerRight,
      shouldHideHeaderRightWhenNotActive,
      message,
      collapsibleContent,
      scroll,
      error,
    } = this.props;
    const isActive = activeContentIndex === contentIndex;
    let additionalHeaderRight = headerRight;
    if (shouldHideHeaderRightWhenNotActive) {
      additionalHeaderRight = isActive ? headerRight : null;
    }

    return (
      <li className="collaspible-box">
        <div className="collaspible-box__header">
          <div
            className={classnames('collaspible-box__header__title', {
              'collaspible-box__header__title--active': isActive,
              'collaspible-box__header__title--error': error,
            })}
            onClick={onContentClick ? onContentClick : onContentClicked(contentIndex)}
          >
            {header}
            <div className="collaspible-box__header__right">
              {additionalHeaderRight}
              {isActive ? (
                <Icon style={{ marginLeft: '7px', marginBottom: '3px' }} name="chevron up" />
              ) : (
                <Icon style={{ marginLeft: '7px', marginBottom: '3px' }} name="chevron down" />
              )}
            </div>
          </div>
        </div>
        {message}
        <div
          className={classnames('collaspible-box__content', {
            'collaspible-box__content--hidden': !isActive,
            'collaspible-box__content--scroll': scroll,
          })}
        >
          {collapsibleContent}
        </div>
      </li>
    );
  }
}

export default CollapsibleBox;
