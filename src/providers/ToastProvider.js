import React, { useContext, useState, useRef, useEffect } from 'react';
import uuid from 'uuid-v4';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

export const ToastContext = React.createContext({});

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastsRef = useRef();

  useEffect(() => {
    toastsRef.current = toasts;
  }, [toasts]);

  const addToast = (message, status, config = {}) => {
    const { timeout = 3000, content } = config;
    const id = uuid();

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

  const successToast = (message, config) => addToast(message, 'success', config);
  const errorToast = (message, config) => addToast(message, 'error', config);
  const warningToast = (message, config) => addToast(message, 'warning', config);

  const removeToast = (id) => setToasts(toastsRef.current.filter((t) => t.id !== id));

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

ToastProvider.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    givenName: PropTypes.string.isRequired,
    familyName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }),
  children: PropTypes.node,
};

export default ToastProvider;
