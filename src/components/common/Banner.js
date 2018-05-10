import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const propTypes = {
  className: PropTypes.string,
  actionClassName: PropTypes.string,
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  children: PropTypes.node,
  style: PropTypes.shape({}),
};

const defaultProps = {
  className: '',
  actionClassName: '',
  children: (<div />),
  style: {},
};

const Banner = ({
  className,
  actionClassName,
  header,
  content,
  children,
  style,
}) => (
  <div className={classnames('banner', className)} style={style}>
    <div className="banner__container">
      <h1>{header}</h1>
      <p className="banner__content">
        {content}
      </p>
      <div className={classnames('banner__action', actionClassName)}>
        {children}
      </div>
    </div>
  </div>
);

Banner.propTypes = propTypes;
Banner.defaultProps = defaultProps;
export default Banner;
