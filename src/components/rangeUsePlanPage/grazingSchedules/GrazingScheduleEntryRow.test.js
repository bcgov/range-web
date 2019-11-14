import React from 'react'
import uuid from 'uuid-v4'
import { Formik } from 'formik'
import {
  render,
  getSemanticDropdownValue
} from '../../../tests/helpers/test-utils'
import GrazingScheduleEntryRow from './GrazingScheduleEntryRow'
import { UserContext } from '../../../providers/UserProvider'
import moment from 'moment'
import mockReference from '../../../tests/intergration/mockData/mockReference'

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
      id: uuid()
    }
  ]
}

const pastures = [{ id: 1, name: 'Pasture 1' }, { id: 2, name: 'Pasture 2' }]

const namespace = 'schedule.grazingScheduleEntries.0'

const WrappedComponent = props => (
  <Formik
    initialValues={{ schedule, pastures }}
    render={({ values }) => (
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
    )}
  />
)

describe('Grazing Schedule Entry Row', () => {
  it('Displays each grazing schedule entry', () => {
    const { container } = render(<WrappedComponent />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('shows an input for each schedule entry field', () => {
    const { queryByLabelText, getByLabelText, debug } = render(
      <WrappedComponent />
    )

    const [entry] = schedule.grazingScheduleEntries

    const pasture = getByLabelText('pasture')
    expect(pasture).toBeInTheDocument()
    expect(getSemanticDropdownValue(pasture)).toBe(
      pastures.find(p => p.id === entry.pastureId).name
    )

    const livestockType = getByLabelText('livestock type')
    expect(livestockType).toBeInTheDocument()
    expect(getSemanticDropdownValue(livestockType)).toBe(
      mockReference.LIVESTOCK_TYPE.find(
        type => type.id === entry.livestockTypeId
      ).name
    )

    const livestockCount = getByLabelText('livestock count')
    expect(livestockCount).toBeInTheDocument()
    expect(livestockCount.value).toBe(entry.livestockCount.toString())

    const dateIn = getByLabelText('date in')
    expect(dateIn).toBeInTheDocument()
    expect(dateIn.value).toBe(entry.dateIn.format('MMM D'))

    const dateOut = getByLabelText('date out')
    expect(dateOut).toBeInTheDocument()
    expect(dateOut.value).toBe(entry.dateOut.format('MMM D'))

    expect(queryByLabelText('grace days')).toBeNull()
  })

  it('only shows the grace days input for range officers', () => {
    const user = {
      roles: ['myra_range_officer']
    }

    const { getByLabelText, queryByLabelText } = render(
      <UserContext.Provider value={user}>
        <WrappedComponent />
      </UserContext.Provider>
    )

    const [entry] = schedule.grazingScheduleEntries

    const graceDays = getByLabelText('grace days')
    expect(graceDays).toBeInTheDocument()
    expect(graceDays.value).toBe(entry.graceDays.toString())
    expect(queryByLabelText('pasture')).toBeNull()
    expect(queryByLabelText('livestock type')).toBeNull()
    expect(queryByLabelText('livestock count')).toBeNull()
    expect(queryByLabelText('date in')).toBeNull()
    expect(queryByLabelText('date out')).toBeNull()
  })
})
