import React from 'react';
import { useField } from 'formik';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

dayjs.extend(customParseFormat);

function DateInputField({ label, dateFormat, ...props }: any) {
  const [field, meta] = useField(props.name);

  const error = meta.touched && meta.error;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        format={dateFormat}
        value={field.value ? dayjs(field.value) : null}
        onChange={(newValue) => {
          const isoString = newValue ? newValue.toISOString() : null;
          field.onChange({ target: { name: field.name, value: isoString } });
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!error,
            helperText: typeof error === 'string' ? error : undefined,
            onBlur: () => field.onBlur(field.name),
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default DateInputField;
