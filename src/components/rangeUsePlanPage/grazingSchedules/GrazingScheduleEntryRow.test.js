import React from 'react'
import uuid from 'uuid-v4'
import { Formik } from 'formik'
import { render, fireEvent, waitFor } from '../../../tests/helpers/test-utils'
import GrazingScheduleEntryRow from './GrazingScheduleEntryRow'
import { UserContext } from '../../../providers/UserProvider'
import moment from 'moment'

const schedule = {
  id: 1,
  year: 2022,
  grazingScheduleEntries: [
    {
      pastureId: 1,
      dateIn: moment('January 26 2022', 'MMMM D YYYY'),
      dateOut: moment('March 9 2022', 'MMMM D YYYY'),
      graceDays: 4,
      livestockTypeId: 5,
      livestockCount: 10,
      id: uuid(),
      pasture: { id: 1, name: 'Pasture 1', graceDays: 50 }
    }
  ]
}

const pastures = [
  { id: 1, name: 'Pasture 1', graceDays: 50 },
  { id: 2, name: 'Pasture 2' }
]

const namespace = 'schedule.grazingScheduleEntries.0'

const WrappedComponent = ({
  initialValues = { schedule, pastures },
  ...props
}) => (
  <Formik
    initialValues={initialValues}
    render={({ values, handleSubmit }) => (
      <form onSubmit={handleSubmit} data-testid="form">
        <table>
          <tbody>
            <GrazingScheduleEntryRow
              schedule={values.schedule}
              entry={values.schedule.grazingScheduleEntries[0]}
              namespace={namespace}
              onCopy={jest.fn()}
              onDelete={jest.fn()}
              {...props}
            />
          </tbody>
        </table>
      </form>
    )}
  />
)

describe('Grazing Schedule Entry Row', () => {
  it('Displays each grazing schedule entry', () => {
    const { container } = render(<WrappedComponent />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('shows an input for each schedule entry field', async () => {
    const { queryByLabelText, getByLabelText, getByTestId } = render(
      <WrappedComponent />
    )

    const [entry] = schedule.grazingScheduleEntries

    const pasture = getByLabelText('pasture')
    expect(pasture).toBeInTheDocument()

    const form = getByTestId('form')

    expect(form).toHaveFormValues({
      'schedule.grazingScheduleEntries.0.pastureId': entry.pastureId.toString(),
      'schedule.grazingScheduleEntries.0.livestockTypeId': entry.livestockTypeId.toString(),
      'schedule.grazingScheduleEntries.0.livestockCount': entry.livestockCount.toString(),
      'schedule.grazingScheduleEntries.0.dateIn': entry.dateIn.format(
        'MMM D YYYY'
      ),
      'schedule.grazingScheduleEntries.0.dateOut': entry.dateOut.format(
        'MMM D YYYY'
      )
    })

    expect(queryByLabelText('grace days').value).toBe(
      entry.graceDays.toString()
    )
  })

  it('calls the onCopy handler when the duplicate button is pressed', async () => {
    const handleCopy = jest.fn()

    const { getByText, getByTestId } = render(
      <WrappedComponent onCopy={handleCopy} />
    )

    const menu = getByTestId('schedule-row-menu').firstChild
    fireEvent.click(menu)

    const duplicateBtn = getByText('Duplicate')

    fireEvent.click(duplicateBtn)

    await waitFor(() => expect(handleCopy).toHaveBeenCalled())
  })

  it('calls the onDelete handler when the delete button is pressed', async () => {
    const handleDelete = jest.fn()

    const { getByText, getByTestId } = render(
      <WrappedComponent onDelete={handleDelete} />
    )

    const menu = getByTestId('schedule-row-menu').firstChild
    fireEvent.click(menu)

    const deleteBtn = getByText('Delete')

    fireEvent.click(deleteBtn)

    await waitFor(() => expect(handleDelete).toHaveBeenCalled())
  })

  it('does not allow the grace days to be edited by agreement holders', () => {
    const { getByLabelText } = render(<WrappedComponent />)

    const [entry] = schedule.grazingScheduleEntries

    const graceDays = getByLabelText('grace days')

    expect(graceDays.value).toBe(entry.graceDays.toString())
    fireEvent.change(graceDays, { value: '500' })
    expect(graceDays.value).toBe(entry.graceDays.toString())
  })

  it('only shows the grace days input for range officers', () => {
    const user = {
      roles: ['myra_range_officer']
    }

    const { getByLabelText } = render(
      <UserContext.Provider value={user}>
        <WrappedComponent />
      </UserContext.Provider>
    )

    const [entry] = schedule.grazingScheduleEntries

    const graceDays = getByLabelText('grace days')
    expect(graceDays.value).toBe(entry.graceDays.toString())

    const newGraceDays = '60'
    fireEvent.change(graceDays, { target: { value: newGraceDays } })
    expect(graceDays.value).toBe(newGraceDays)
  })

  it('pulls the grace days from the selected pasture if not overridden', () => {
    const { getByLabelText } = render(
      <WrappedComponent
        initialValues={{
          schedule: {
            ...schedule,
            grazingScheduleEntries: [
              {
                ...schedule.grazingScheduleEntries[0],
                graceDays: null
              }
            ]
          },
          pastures
        }}
      />
    )

    const [entry] = schedule.grazingScheduleEntries

    const graceDays = getByLabelText('grace days')
    expect(graceDays).toBeInTheDocument()
    expect(graceDays.value).toBe(
      pastures.find(p => p.id === entry.pastureId).graceDays.toString()
    )
  })
})
