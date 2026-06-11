import { useEffect } from 'react';
import { connect } from 'formik';

interface OnSubmitValidationErrorProps {
  callback: (formik: any) => void;
  formik: any;
}

function OnSubmitValidationError({ callback, formik }: OnSubmitValidationErrorProps) {
  useEffect(() => {
    if (formik.dirty && formik.submitCount > 0 && !formik.isSubmitting && !formik.isValid) {
      callback(formik);
    }
  }, [formik.submitCount, formik.isSubmitting, formik.isValid, formik.dirty]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export default connect(OnSubmitValidationError);
