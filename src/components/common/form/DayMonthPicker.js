import React, { useState, useEffect } from 'react'
import { getIn, connect } from 'formik'
import moment from 'moment'
import { chunk } from 'lodash'
import {
  Input,
  Form,
  Popup,
  Button,
  Header,
  Grid,
  Divider,
  Table,
  Icon
} from 'semantic-ui-react'

const DayMonthPicker = connect(
  ({ dayName, monthName, label, formik, ...props }) => {
    const [open, setOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(0)

    const previousMonth = () =>
      setCurrentMonth(currentMonth > 0 ? currentMonth - 1 : 11)
    const nextMonth = () =>
      setCurrentMonth(currentMonth < 11 ? currentMonth + 1 : 0)

    const monthValue = getIn(formik.values, monthName)
    const dayValue = getIn(formik.values, dayName)
    const error = getIn(formik.errors, monthName)

    useEffect(() => {
      if (monthValue) {
        setCurrentMonth(monthValue - 1)
      }
    }, [open])

    const daysInMonth = moment()
      .set('month', currentMonth)
      .daysInMonth()

    const weeksArray = chunk(
      Array.from({ length: daysInMonth }).map((_, i) => i + 1),
      7
    )

    return (
      <>
        <Form.Field>
          {label && <label>{label}</label>}

          <Popup
            open={open}
            onClose={() => setOpen(false)}
            trigger={
              <>
                <Input
                  onFocus={() => setOpen(true)}
                  value={
                    dayValue && monthValue
                      ? `${moment(monthValue, 'MM').format('MMMM')} ${moment(
                          dayValue,
                          'DD'
                        ).format('Do')} `
                      : ''
                  }
                  icon={
                    monthValue || dayValue ? (
                      <Icon
                        name="close"
                        link
                        onClick={() => {
                          formik.setFieldValue(monthName, '')
                          formik.setFieldValue(dayName, '')
                        }}
                      />
                    ) : (
                      'calendar'
                    )
                  }
                  iconPosition="right"
                  {...props}
                />
                {error && (
                  <span
                    className="sui-error-message"
                    style={{ position: 'relative', top: '-1em' }}>
                    {error}
                  </span>
                )}
              </>
            }>
            <Popup.Content style={{ width: '300px' }}>
              <Grid>
                <Grid.Column textAlign="left" width="4">
                  <Button icon="caret left" onClick={previousMonth} />
                </Grid.Column>
                <Grid.Column verticalAlign="middle" width="8">
                  <Header as="h4" textAlign="center">
                    {moment()
                      .month(currentMonth)
                      .format('MMMM')}
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign="right" width="4">
                  <Button icon="caret right" onClick={nextMonth} />
                </Grid.Column>
              </Grid>
              <Divider />
              <Table columns="7" celled>
                {weeksArray.map((days, week) => (
                  <Table.Row key={`${currentMonth}_week_${week}`}>
                    <>
                      {days.map(day => (
                        <Table.Cell
                          selectable
                          textAlign="center"
                          verticalAlign="middle"
                          key={`${currentMonth}_day_${day}`}
                          onClick={() => {
                            const date = moment()
                              .set('month', currentMonth)
                              .set('date', day)

                            formik.setFieldValue(monthName, date.month() + 1)
                            formik.setFieldValue(dayName, date.date())

                            setOpen(false)
                          }}
                          style={{
                            backgroundColor:
                              dayValue === day &&
                              monthValue === currentMonth + 1
                                ? '#2185d0'
                                : 'transparent',
                            color:
                              dayValue === day &&
                              monthValue === currentMonth + 1
                                ? '#ffffff'
                                : 'black',
                            cursor: 'pointer'
                          }}>
                          {day}
                        </Table.Cell>
                      ))}
                      {days.length < 7 &&
                        Array.from({ length: 7 - days.length }).map((_, i) => (
                          <Table.Cell key={`${currentMonth}_emptycell_${i}`} />
                        ))}
                    </>
                  </Table.Row>
                ))}
              </Table>
            </Popup.Content>
          </Popup>
        </Form.Field>
      </>
    )
  }
)

export default connect(DayMonthPicker)
