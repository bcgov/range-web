declare module 'uuid-v4' {
  function uuid(): string;
  namespace uuid {
    function isUUID(value: unknown): boolean;
  }
  export = uuid;
}

declare module '@loadable/component' {
  import { ComponentType } from 'react';

  interface LoadableOptions {
    fallback?: React.ReactNode;
  }

  function loadable<T extends ComponentType<any>>(
    loadFn: () => Promise<{ default: T } | T>,
    options?: LoadableOptions,
  ): T;

  export default loadable;
}

declare module 'react-select' {
  import { ComponentType } from 'react';
  const ReactSelect: ComponentType<any>;
  export default ReactSelect;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'pikaday' {
  interface PikadayOptions {
    field?: HTMLElement | null;
    format?: string;
    minDate?: Date | null;
    maxDate?: Date | null;
    defaultDate?: Date | null;
    setDefaultDate?: boolean;
    onSelect?: (date: Date) => void;
    [key: string]: any;
  }
  class Pikaday {
    constructor(options: PikadayOptions);
    setMinDate(date: Date): void;
    setMaxDate(date: Date): void;
    destroy(): void;
  }
  export = Pikaday;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}
