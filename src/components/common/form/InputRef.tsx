import React, { useCallback } from 'react';

const findInput = (cb: (el: HTMLInputElement | null) => void, el: HTMLElement | null) =>
  el && cb(el.querySelector('input'));

interface InputRefProps {
  inputRef?: (el: HTMLInputElement | null) => void;
  children: React.ReactNode;
}

export function InputRef({ inputRef, children }: InputRefProps) {
  const refCallback = useCallback(
    (el: HTMLSpanElement | null) => {
      findInput(inputRef!, el);
    },
    [inputRef],
  );

  if (inputRef) {
    return <span ref={refCallback}>{children}</span>;
  }

  return <>{children}</>;
}
