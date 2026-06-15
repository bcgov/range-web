import React, { useState } from 'react';
import { useField } from 'formik';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { SCHEDULE_ENTRY_DATE_OUT_OF_RANGE } from '../../../constants/strings';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

function toDayjs(value: any): dayjs.Dayjs | null {
  if (!value) return null;
  if (dayjs.isDayjs(value)) return value;
  if (value._isAMomentObject) return dayjs(value.format('YYYY-MM-DD'));
  return dayjs(value);
}

function isOutsideRange(value: any, minDate: any, maxDate: any): boolean {
  const d = toDayjs(value);
  const min = toDayjs(minDate);
  const max = toDayjs(maxDate);
  return !!(d && min && max && (d.isBefore(min) || d.isAfter(max)));
}

function DateInputField({ label, dateFormat, showPickerIcon = true, minDate, maxDate, ...props }: any) {
  const [field, meta] = useField(props.name);
  const [open, setOpen] = useState(false);

  const formikError = typeof (meta.touched && meta.error) === 'string' ? meta.error : null;
  const rangeError =
    field.value && minDate && maxDate && isOutsideRange(field.value, minDate, maxDate)
      ? SCHEDULE_ENTRY_DATE_OUT_OF_RANGE
      : null;
  const displayError = rangeError || formikError;

  const handleChange = (newValue: any) => {
    const isoString = newValue ? newValue.toISOString() : null;
    field.onChange({ target: { name: field.name, value: isoString } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        format={dateFormat}
        value={field.value ? dayjs(field.value) : null}
        minDate={toDayjs(minDate)}
        maxDate={toDayjs(maxDate)}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={handleChange}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            error: !!displayError,
            helperText: displayError || undefined,
            onClick: () => setOpen(true),
            onBlur: () => field.onBlur(field.name),
          },
          openPickerButton: showPickerIcon ? undefined : { style: { display: 'none' } },
        }}
      />
    </LocalizationProvider>
  );
}

export default DateInputField;
