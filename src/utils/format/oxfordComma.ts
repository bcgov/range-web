import { NOT_PROVIDED } from '../../constants/strings';

export function oxfordComma(arr: string[]): string {
  switch (arr.length) {
    case 0:
      return NOT_PROVIDED;
    case 1:
    case 2:
      return arr.join(' and ');
    default: {
      const last = 'and ' + arr.pop();
      return [...arr, last].join(', ');
    }
  }
}
