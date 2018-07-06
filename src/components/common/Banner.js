import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  actionClassName: PropTypes.string,
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  children: PropTypes.node,
  style: PropTypes.shape({}),
  noDefaultHeight: PropTypes.bool,
};

const defaultProps = {
  actionClassName: '',
  children: (<div />),
  style: {},
  noDefaultHeight: false,
};

const Banner = ({
  actionClassName,
  header,
  content,
  children,
  style,
  noDefaultHeight,
}) => (
  <div className="banner" style={style}>
    <div className={classnames('banner__container', { 'banner__container--no-default-height': noDefaultHeight })}>
      <div>
        <h1 className="banner__header">{header}</h1>
        <div className="banner__content">{content}</div>
      </div>
      {children &&
        <div className={classnames('banner__action', actionClassName)}>
          {children}
        </div>
      }
    </div>
  </div>
);

Banner.propTypes = propTypes;
Banner.defaultProps = defaultProps;
export default Banner;
