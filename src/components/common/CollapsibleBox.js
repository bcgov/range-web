import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';

class CollaspibleBox extends Component {
  static propTypes = {
    header: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    contentIndex: PropTypes.number.isRequired,
    activeContentIndex: PropTypes.number.isRequired,
    onContentClicked: PropTypes.func.isRequired,
  }

  render() {
    const {
      contentIndex,
      activeContentIndex,
      onContentClicked,
      header,
      content,
    } = this.props;
    const isActive = activeContentIndex === contentIndex;

    return (
      <li className="collaspible-box">
        <div className="collaspible-box__header">
          <button
            className="collaspible-box__header__title"
            onClick={onContentClicked(contentIndex)}
          >
            {header}
            <div className="collaspible-box__header__right">
              { isActive
                ? <Icon style={{ marginLeft: '10px' }} name="chevron up" />
                : <Icon style={{ marginLeft: '10px' }} name="chevron down" />
              }
            </div>
          </button>
        </div>
        <div
          className={classnames('collaspible-box__content', {
            'collaspible-box__content__hidden': !isActive,
          })}
        >
          {content}
        </div>
      </li>
    );
  }
}

export default CollaspibleBox;
