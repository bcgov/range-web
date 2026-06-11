import React from 'react';
import { PrimaryButton } from '../../../common';

interface LeftBtnProps {
  onClick: (...args: any[]) => void;
  content: string;
}

function LeftBtn({ onClick, content }: LeftBtnProps) {
  return <PrimaryButton inverted className="rup__multi-tab__tab__btn" onClick={onClick} content={content} />;
}

export default LeftBtn;
