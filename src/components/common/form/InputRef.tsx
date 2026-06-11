import React, { Fragment } from 'react';
import { Ref } from 'semantic-ui-react';

const findInput = (cb: (el: HTMLInputElement | null) => void, el: HTMLElement | null) =>
  el && cb(el.querySelector('input'));

interface NullRefProps {
  children: React.ReactNode;
}

export function NullRef({ children }: NullRefProps) {
  return <Fragment>{children}</Fragment>;
}

interface InputRefProps {
  inputRef?: (el: HTMLInputElement | null) => void;
  children: React.ReactNode;
}

export function InputRef({ inputRef, children }: InputRefProps) {
  if (inputRef) {
    return <Ref innerRef={(el: any) => findInput(inputRef, el)}>{children as React.ReactElement}</Ref>;
  }
  return <NullRef>{children}</NullRef>;
}
