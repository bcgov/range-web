import { useEffect } from 'react'
import { connect } from 'formik'

const OnSubmitValidationError = ({ callback, formik }) => {
  useEffect(() => {
    if (
      formik.dirty &&
      formik.submitCount > 0 &&
      !formik.isSubmitting &&
      !formik.isValid
    ) {
      callback(formik)
    }
  }, [formik.submitCount, formik.isSubmitting, formik.isValid, formik.dirty])

  return null
}

export default connect(OnSubmitValidationError)
