import { useEffect } from 'react'
import { connect } from 'formik'

const Effect = ({ onChange, formik }) => {
  const { values } = formik

  if (onChange) {
    useEffect(() => {
      onChange(values)
    }, [values])
  }

  return null
}

export default connect(Effect)
