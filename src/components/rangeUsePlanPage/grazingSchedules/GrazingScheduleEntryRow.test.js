import React from 'react'
import uuid from 'uuid-v4'
import { Formik } from 'formik'
import { render } from '../../../tests/helpers/test-utils'
import GrazingScheduleEntryRow from './GrazingScheduleEntryRow'
import { UserContext } from '../../../providers/UserProvider'

const schedule = {
  id: 1,
  year: 2022,
  grazingScheduleEntries: [
    {
      pastureId: 1,
      dateIn: new Date().toISOString(),
      dateOut: new Date().toISOString(),
      graceDays: 4,
      livestockCount: 10,
      id: uuid()
    }
  ]
}

const pastures = [{ id: 1, name: 'Pasture 1' }, { id: 2, name: 'Pasture 2' }]

const namespace = 'schedule.grazingScheduleEntries.0'

describe('Grazing Schedule Box', () => {
  it('Displays each grazing schedule entry', () => {
    const { container } = render(
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
              />
            </tbody>
          </table>
        )}
      />
    )

    expect(container.firstChild).toMatchSnapshot()
  })

  it('shows an input for each schedule entry field', () => {
    const { queryByLabelText, getByLabelText } = render(
      <Formik
        initialValues={{ schedule, pastures }}
        render={({ values }) => (
          <table>
            <tbody>
              <GrazingScheduleEntryRow
                schedule={values.schedule}
                entry={values.schedule.grazingScheduleEntries[0]}
                namespace="schedule.grazingScheduleEntries.0"
                onCopy={jest.fn()}
                onDelete={jest.fn()}
              />
            </tbody>
          </table>
        )}
      />
    )

    expect(getByLabelText('pasture')).toBeInTheDocument()
    expect(getByLabelText('livestock type')).toBeInTheDocument()
    expect(getByLabelText('livestock count')).toBeInTheDocument()
    expect(getByLabelText('date in')).toBeInTheDocument()
    expect(getByLabelText('date out')).toBeInTheDocument()
    expect(queryByLabelText('grace days')).toBeNull()
  })

  it('only shows the grace days input for range officers', () => {
    const user = {
      roles: ['myra_range_officer']
    }

    const { getByLabelText, queryByLabelText } = render(
      <UserContext.Provider value={user}>
        <Formik
          initialValues={{ schedule, pastures }}
          render={({ values }) => (
            <table>
              <tbody>
                <GrazingScheduleEntryRow
                  schedule={values.schedule}
                  entry={values.schedule.grazingScheduleEntries[0]}
                  namespace="schedule.grazingScheduleEntries.0"
                  onCopy={jest.fn()}
                  onDelete={jest.fn()}
                />
              </tbody>
            </table>
          )}
        />
      </UserContext.Provider>
    )

    expect(getByLabelText('grace days')).toBeInTheDocument()
    expect(queryByLabelText('pasture')).toBeNull()
    expect(queryByLabelText('livestock type')).toBeNull()
    expect(queryByLabelText('livestock count')).toBeNull()
    expect(queryByLabelText('date in')).toBeNull()
    expect(queryByLabelText('date out')).toBeNull()
  })
})
