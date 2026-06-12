import React, { useState, useEffect, useRef } from 'react';
import { getIn, connect } from 'formik';
import moment from 'moment';
import { chunk } from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import InputAdornment from '@mui/material/InputAdornment';
import MuiIcon from '../MuiIcon';

interface DayMonthPickerProps {
  dayName: string;
  monthName: string;
  label?: string;
  formik: any;
  dateFormat?: string;
  [key: string]: any;
}

const DayMonthPicker = connect(
  ({ dayName, monthName, label, formik, dateFormat = 'MMMM Do', ...props }: DayMonthPickerProps) => {
    const [open, setOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(0);
    const anchorRef = useRef<HTMLDivElement>(null);

    const previousMonth = () => setCurrentMonth(currentMonth > 0 ? currentMonth - 1 : 11);
    const nextMonth = () => setCurrentMonth(currentMonth < 11 ? currentMonth + 1 : 0);

    const monthValue = getIn(formik.values, monthName);
    const dayValue = getIn(formik.values, dayName);
    const error = getIn(formik.errors, monthName);

    useEffect(() => {
      if (monthValue) {
        setCurrentMonth(monthValue - 1);
      }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const daysInMonth = moment().set('month', currentMonth).daysInMonth();

    const weeksArray = chunk(
      Array.from({ length: daysInMonth }).map((_, i) => i + 1),
      7,
    );

    const formattedDate =
      dayValue && monthValue
        ? moment()
            .set('month', monthValue - 1)
            .set('date', dayValue)
            .format(dateFormat)
        : '';

    return (
      <>
        <FormControl error={!!error} sx={{ mb: 1 }}>
          {label && <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>{label}</label>}
          <div ref={anchorRef}>
            <TextField
              onClick={() => setOpen(true)}
              value={formattedDate}
              size="small"
              error={!!error}
              {...props}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {monthValue || dayValue ? (
                      <IconButton
                        size="small"
                        onClick={() => {
                          formik.setFieldValue(monthName, '');
                          formik.setFieldValue(dayName, '');
                        }}
                      >
                        <MuiIcon name="close" />
                      </IconButton>
                    ) : (
                      <MuiIcon name="calendar" />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {error && (
            <span className="sui-error-message" style={{ position: 'relative', top: '-0.5em' }}>
              {error}
            </span>
          )}
        </FormControl>
        <Popover
          open={open}
          anchorEl={anchorRef.current}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { sx: { width: 300, p: 1 } } }}
        >
          <Grid container alignItems="center">
            <Grid item xs={3} sx={{ textAlign: 'left' }}>
              <IconButton onClick={previousMonth} size="small">
                <MuiIcon name="caret left" />
              </IconButton>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {moment().month(currentMonth).format('MMMM')}
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ textAlign: 'right' }}>
              <IconButton onClick={nextMonth} size="small">
                <MuiIcon name="caret right" />
              </IconButton>
            </Grid>
          </Grid>
          <Divider sx={{ my: 1 }} />
          <Table size="small">
            <TableBody>
              {weeksArray.map((days, week) => (
                <TableRow key={`${currentMonth}_week_${week}`}>
                  {days.map((day) => (
                    <TableCell
                      key={`${currentMonth}_day_${day}`}
                      align="center"
                      onClick={() => {
                        const date = moment().set('month', currentMonth).set('date', day);
                        formik.setFieldValue(monthName, date.month() + 1);
                        formik.setFieldValue(dayName, date.date());
                        setOpen(false);
                      }}
                      sx={{
                        backgroundColor:
                          dayValue === day && monthValue === currentMonth + 1 ? '#2185d0' : 'transparent',
                        color: dayValue === day && monthValue === currentMonth + 1 ? '#ffffff' : 'black',
                        cursor: 'pointer',
                        padding: '10px',
                        '&:hover': {
                          backgroundColor: dayValue === day && monthValue === currentMonth + 1 ? '#2185d0' : '#f0f0f0',
                        },
                      }}
                    >
                      {day}
                    </TableCell>
                  ))}
                  {days.length < 7 &&
                    Array.from({ length: 7 - days.length }).map((_, i) => (
                      <TableCell key={`${currentMonth}_emptycell_${i}`} />
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Popover>
      </>
    );
  },
);

export default connect(DayMonthPicker);
