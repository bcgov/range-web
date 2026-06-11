import React from 'react';
import { DateInput } from 'semantic-ui-calendar-react';
import { Field, getIn } from 'formik';
import moment from 'moment';

interface DateInputFieldProps {
  inline?: boolean;
  label?: string;
  name: string;
  dateFormat?: string;
  icon?: any;
  [key: string]: any;
}

function DateInputField({ inline, label, ...props }: DateInputFieldProps) {
  return (
    <Field
      {...props}
      inline={inline}
      render={({ field, form }: any) => {
        const error = getIn(form.errors, field.name);

        return (
          <>
            <DateInput
              {...field}
              {...props}
              inlineLabel={inline}
              hideMobileKeyboard
              closeOnMouseLeave={false}
              autoComplete="off"
              onChange={(_e: any, { value }: any) => {
                const date = moment(value, props.dateFormat).toISOString();
                form.setFieldValue(field.name, date);
              }}
              value={field.value ? moment(field.value).format(props.dateFormat) : ''}
              onBlur={() => form.setFieldTouched(field.name)}
              onKeyDown={(e: React.KeyboardEvent) => {
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
}

export default DateInputField;
