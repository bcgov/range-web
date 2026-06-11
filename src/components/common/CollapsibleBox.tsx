import React, { Component } from 'react';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';

interface CollapsibleBoxProps {
  header: React.ReactNode;
  headerRight?: React.ReactNode;
  shouldHideHeaderRightWhenNotActive?: boolean;
  message?: React.ReactNode;
  collapsibleContent: React.ReactNode;
  contentIndex: number;
  activeContentIndex: number;
  onContentClicked?: (index: number) => () => void;
  onContentClick?: () => void;
  scroll?: boolean;
  error?: boolean;
}

class CollapsibleBox extends Component<CollapsibleBoxProps> {
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
            onClick={onContentClick ? onContentClick : onContentClicked?.(contentIndex)}
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
