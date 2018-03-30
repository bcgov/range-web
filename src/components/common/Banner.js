import React from 'react';
import classNames from 'classnames';

export const Banner = ({ header, content, children, className = '', actionClassName = '' }) => (
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