import React from 'react';
import PropTypes from 'prop-types';
import { DateInput } from 'semantic-ui-calendar-react';
import { Field, getIn } from 'formik';
import moment from 'moment';

const DateInputField = ({ inline, label, ...props }) => (
  <Field
    {...props}
    inline={inline}
    render={({ field, form }) => {
      const error = getIn(form.errors, field.name);

      return (
        <>
          <DateInput
            {...field}
            {...props}
            inlineLabel={inline}
            hideMobileKeyboard
            closeOnMouseLeave={false}
            onChange={(e, { value }) => {
              const date = moment(value, props.dateFormat).toISOString();
              form.setFieldValue(field.name, date);
            }}
            value={field.value ? moment(field.value).format(props.dateFormat) : ''}
            onBlur={() => form.setFieldTouched(field.name)}
            onKeyDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            error={!!error}
            className={props.icon === null ? 'calendar-input--no-icon' : ''}
            id={`${props.name}-datepicker`}
            label={<label htmlFor={`${props.name}-datepicker`}>{label}</label>}
          />
          {error && typeof error === 'string' && (
            <span className="sui-error-message" style={{ position: 'relative', top: '-1em' }}>
              {error}
            </span>
          )}
        </>
      );
    }}
  ></Field>
);

DateInputField.propTypes = {
  inline: PropTypes.bool,
};

export default DateInputField;
