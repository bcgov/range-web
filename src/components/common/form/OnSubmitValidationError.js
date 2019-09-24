import { useEffect } from 'react'
import { connect } from 'formik'

const OnSubmitValidationError = ({ callback, formik }) => {
  useEffect(() => {
    if (formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      callback(formik)
    }
  }, [formik.submitCount, formik.isSubmitting])

  return null
}

export default connect(OnSubmitValidationError)
