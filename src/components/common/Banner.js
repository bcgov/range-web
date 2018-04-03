import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
  className: PropTypes.string,
  actionClassName: PropTypes.string,
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  children: PropTypes.node,
};

const defaultProps = {
  className: '',
  actionClassName: '',
  children: (<div />),
};

const Banner = ({
  className,
  actionClassName,
  header,
  content,
  children,
}) => (
  <div className={classNames('banner', className)}>
    <div className="banner__container">
      <h2>{header}</h2>
      <p className="banner__content">
        {content}
      </p>
      <div className={classNames('banner__action', actionClassName)}>
        {children}
      </div>
    </div>
  </div>
);

Banner.propTypes = propTypes;
Banner.defaultProps = defaultProps;
export default Banner;
