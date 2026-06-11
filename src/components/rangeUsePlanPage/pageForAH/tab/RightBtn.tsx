import React from 'react';
import { PrimaryButton } from '../../../common';

interface RightBtnProps {
  onClick: (...args: any[]) => void;
  disabled?: boolean;
  loading?: boolean;
  content: string;
  primary?: boolean;
}

function RightBtn({ onClick, disabled = false, content, loading = false }: RightBtnProps) {
  return (
    <PrimaryButton
      className="rup__multi-tab__tab__btn"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      content={content}
      style={{ margin: '0' }}
    />
  );
}

export default RightBtn;
