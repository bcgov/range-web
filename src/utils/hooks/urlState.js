import { useState } from 'react'
import { useHistory } from 'react-router-dom'

export const useUrlState = (key, initialState) => {
  if (!key) {
    throw new Error('`key` must be provided to useUrlState')
  }

  const history = useHistory()

  const params = new URLSearchParams(history.location.search)
  let paramValue = params.get(key)
  if (!isNaN(paramValue)) {
    paramValue = parseFloat(paramValue)
  }

  const [value, setValue] = useState(paramValue || initialState)

  const setValueAndParam = value => {
    const params = new URLSearchParams(history.location.search)

    if (value === null) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    history.replace({ ...history.location, search: params.toString() })
    setValue(value)
  }

  return [value, setValueAndParam]
}
