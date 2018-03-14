import React from 'react';
import classNames from 'classnames';

export const Banner = ({ header, content, children, className = "" }) => (
  <div className={classNames('banner', className)}>
    <div className="banner__container container">
      <h2>{header}</h2>
      <p className="banner__content">
        {content}
      </p>
      <div className="banner__action">
        {children}
      </div>
    </div>
  </div>
);