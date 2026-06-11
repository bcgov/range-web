import React, { useContext, useState, useRef, useEffect } from 'react';
import uuid from 'uuid-v4';
import classnames from 'classnames';
import { Icon } from 'semantic-ui-react';

type ToastStatus = 'success' | 'error' | 'warning';

interface ToastConfig {
  timeout?: number;
  content?: React.ReactNode;
}

interface Toast {
  id: string;
  message: string;
  status: ToastStatus;
  content?: React.ReactNode;
}

interface ToastContextValue {
  addToast: (message: string, status: ToastStatus, config?: ToastConfig) => string;
  successToast: (message: string, config?: ToastConfig) => string;
  errorToast: (message: string, config?: ToastConfig) => string;
  warningToast: (message: string, config?: ToastConfig) => string;
  removeToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextValue>({
  addToast: () => '',
  successToast: () => '',
  errorToast: () => '',
  warningToast: () => '',
  removeToast: () => undefined,
});

export const useToast = (): ToastContextValue => useContext(ToastContext);

interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastsRef = useRef<Toast[]>([]);

  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  const removeToast = (id: string): void => {
    setToasts(toastsRef.current.filter((t) => t.id !== id));
  };

  const addToast = (message: string, status: ToastStatus, config: ToastConfig = {}): string => {
    const { timeout = 3000, content } = config;
    const id: string = uuid();

    setToasts([
      ...toastsRef.current,
      {
        id,
        message,
        status,
        content,
      },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, timeout);

    return id;
  };

  const successToast = (message: string, config?: ToastConfig): string => addToast(message, 'success', config);
  const errorToast = (message: string, config?: ToastConfig): string => addToast(message, 'error', config);
  const warningToast = (message: string, config?: ToastConfig): string => addToast(message, 'warning', config);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        successToast,
        errorToast,
        warningToast,
        removeToast,
      }}
    >
      <section className="toasts">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <div
              className={classnames('toast__icon', {
                toast__icon__success: toast.status === 'success',
                toast__icon__error: toast.status === 'error',
                toast__icon__warning: toast.status === 'warning',
              })}
            >
              {toast.status === 'success' && <Icon name="check circle" size="large" />}
              {toast.status === 'error' && <Icon name="warning circle" size="large" />}
              {toast.status === 'warning' && <Icon name="warning" size="large" />}
            </div>
            <div className="toast__content">
              {toast.message}
              {toast.content}
            </div>
            <button className="toast__dismiss" onClick={() => removeToast(toast.id)}>
              <Icon name="times" size="small" />
            </button>
          </div>
        ))}
      </section>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
