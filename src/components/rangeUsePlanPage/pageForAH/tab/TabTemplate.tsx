import React from 'react';
import classnames from 'classnames';

interface TabTemplateProps {
  title: string;
  actions: React.ReactNode;
  content: React.ReactNode;
  isActive: boolean;
}

function TabTemplate({ title, actions, content, isActive }: TabTemplateProps) {
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
}

export default TabTemplate;
