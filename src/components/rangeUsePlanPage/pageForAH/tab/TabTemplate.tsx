import React from 'react';
import classnames from 'classnames';

interface TabTemplateProps {
  title: string;
  actions: React.ReactNode;
  content: React.ReactNode;
  isActive: boolean;
}

const TabTemplate: React.FC<TabTemplateProps> = ({ title, actions, content, isActive }) => {
  return (
    <div
      className={classnames('rup__multi-tab', {
        'rup__multi-tab--active': isActive,
      })}
    >
      <div className="rup__multi-tab__title">{title}</div>
      {content}
      <div className="rup__multi-tab__btns">{actions}</div>
    </div>
  );
};

export default TabTemplate;
