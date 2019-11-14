import React from 'react'
import uuid from 'uuid-v4'
import { Formik } from 'formik'
import {
  render,
  getSemanticDropdownValue,
  fireEvent
} from '../../../tests/helpers/test-utils'
import GrazingScheduleBox from './GrazingScheduleBox'
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
      id: uuid()
    }
  ]
}

const pastures = [{ id: 1, name: 'Pasture 1' }, { id: 2, name: 'Pasture 2' }]

const namespace = 'schedule'

const WrappedComponent = props => (
  <Formik
    initialValues={{ schedule, pastures }}
    render={({ values }) => (
      <GrazingScheduleBox
        activeIndex={1}
        index={1}
        schedule={values.schedule}
        namespace={namespace}
        onCopy={jest.fn()}
        onDelete={jest.fn()}
        crownTotalAUMs={100}
        authorizedAUMs={200}
        onScheduleCopy={jest.fn()}
        onScheduleDelete={jest.fn()}
        onScheduleClicked={jest.fn()}
        yearOptions={[]}
        {...props}
      />
    )}
  />
)

describe('Grazing Schedule Entry Box', () => {
  it('duplicates a row when the duplicate button is pressed', () => {
    const { getByText, getAllByLabelText } = render(<WrappedComponent />)

    fireEvent.click(getByText('Duplicate'))

    const pastureDropdowns = getAllByLabelText('pasture')
    expect(pastureDropdowns).toHaveLength(2)
    expect(getSemanticDropdownValue(pastureDropdowns[0])).toBe(
      getSemanticDropdownValue(pastureDropdowns[1])
    )

    const livestockTypes = getAllByLabelText('livestock type')
    expect(livestockTypes).toHaveLength(2)
    expect(getSemanticDropdownValue(livestockTypes[0])).toBe(
      getSemanticDropdownValue(livestockTypes[1])
    )

    const livestockCounts = getAllByLabelText('livestock count')
    expect(livestockCounts).toHaveLength(2)
    expect(livestockCounts[0].value).toBe(livestockCounts[1].value)

    const dateIns = getAllByLabelText('date in')
    expect(dateIns).toHaveLength(2)
    expect(dateIns.value).toBe()

    const dateOuts = getAllByLabelText('date out')
    expect(dateOuts).toHaveLength(2)
    expect(dateOuts[0].value).toBe(dateOuts[1].value)
  })
})
