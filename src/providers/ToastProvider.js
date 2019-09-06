import React, { useContext, useState } from 'react'
import uuid from 'uuid-v4'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

export const ToastContext = React.createContext({})

export const useToast = () => useContext(ToastContext)

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, success, timeout = 3000) => {
    const id = uuid.random()
    setToasts([
      ...toasts,
      {
        id,
        message,
        success
      }
    ])

    setTimeout(() => {
      removeToast(id)
    }, timeout)
  }

  const successToast = message => addToast(message, true)
  const errorToast = message => addToast(message, false)

  const removeToast = id => setToasts(toasts.filter(t => t.id !== id))

  return (
    <ToastContext.Provider
      value={{
        addToast,
        successToast,
        errorToast
      }}>
      <section className="toasts">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <div
              className={classnames('toast__icon', {
                toast__icon__success: toast.success,
                toast__icon__error: !toast.success
              })}>
              {toast.success && <Icon name="check circle" size="large" />}
              {!toast.success && <Icon name="warning circle" size="large" />}
            </div>
            <div className="toast__content">{toast.message}</div>
            <button
              className="toast__dismiss"
              onClick={() => removeToast(toast)}>
              <Icon name="times" size="small" />
            </button>
          </div>
        ))}
      </section>
      {children}
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    givenName: PropTypes.string.isRequired,
    familyName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
  }),
  children: PropTypes.node
}

export default ToastProvider
