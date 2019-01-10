import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';

class CollapsibleBox extends Component {
  static propTypes = {
    header: PropTypes.node.isRequired,
    headerRight: PropTypes.node,
    message: PropTypes.node,
    collapsibleContent: PropTypes.node.isRequired,
    contentIndex: PropTypes.number.isRequired,
    activeContentIndex: PropTypes.number.isRequired,
    onContentClicked: PropTypes.func.isRequired,
  }

  static defaultProps = {
    headerRight: null,
    message: null,
  }

  render() {
    const {
      contentIndex,
      activeContentIndex,
      onContentClicked,
      header,
      headerRight,
      message,
      collapsibleContent,
    } = this.props;
    const isActive = activeContentIndex === contentIndex;

    return (
      <li className="collaspible-box">
        <div className="collaspible-box__header">
          <button
            className={classnames('collaspible-box__header__title', {
              'collaspible-box__header__title--active': isActive,
            })}
            onClick={onContentClicked(contentIndex)}
          >
            {header}
            <div className="collaspible-box__header__right">
              {isActive ? headerRight : null}
              { isActive
                ? <Icon style={{ marginLeft: '10px' }} name="chevron up" />
                : <Icon style={{ marginLeft: '10px' }} name="chevron down" />
              }
            </div>
          </button>
        </div>
        {message}
        <div
          className={classnames('collaspible-box__content', {
            'collaspible-box__content--hidden': !isActive,
          })}
        >
          {collapsibleContent}
        </div>
      </li>
    );
  }
}

export default CollapsibleBox;
