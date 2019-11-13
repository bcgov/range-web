import React from 'react'
import { UserContext } from '../../../providers/UserProvider'
import { render, fireEvent } from '../../../tests/helpers/test-utils'
import GrazingSchedules from '.'
import { Formik } from 'formik'
import uuid from 'uuid-v4'
import moment from 'moment'

const plan = {
  planStartDate: moment('January 1 2021', 'MMMM D YYYY'),
  planEndDate: moment('December 31 2026', 'MMMM D YYYY'),
  agreement: {
    usage: [{ year: 2022 }, { year: 2025 }]
  },
  pastures: [
    {
      id: 1
    }
  ],
  grazingSchedules: [
    {
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
    },
    {
      id: uuid(),
      year: 2025,
      grazingScheduleEntries: []
    }
  ]
}

describe('Grazing Schedules', () => {
  it("doesn't render an 'Add Schedule' button if the user is a range officer", () => {
    const user = {
      roles: ['myra_range_officer']
    }

    const { queryByText } = render(
      <UserContext.Provider value={user}>
        <Formik
          initialValues={plan}
          render={({ values }) => <GrazingSchedules plan={values} />}
        />
      </UserContext.Provider>
    )

    expect(queryByText('Add Schedule')).toBeNull()
  })

  it('adds a new schedule on button press', () => {
    const { getByText } = render(
      <Formik
        initialValues={{ ...plan, grazingSchedules: [] }}
        render={({ values }) => <GrazingSchedules plan={values} />}
      />
    )

    const addButton = getByText('Add Schedule')

    fireEvent.click(addButton)

    fireEvent.click(getByText('2024'))

    expect(getByText('2024 Grazing Schedule')).toBeInTheDocument()
  })

  it('can delete schedules', () => {
    const { queryByText, getByText, getByTestId } = render(
      <Formik
        initialValues={plan}
        render={({ values }) => <GrazingSchedules plan={values} />}
      />
    )

    expect(getByText('2025 Grazing Schedule')).toBeInTheDocument()

    // The 2022 schedule should not be allowed to be deleted, since it is persisted
    expect(getByTestId('delete-button-2022')).toHaveClass('disabled')

    // Uncollapse 2025 schedule
    fireEvent.click(getByText('2025 Grazing Schedule'))

    const deleteButton = getByTestId('delete-button-2025')

    expect(deleteButton).not.toHaveClass('disabled')

    fireEvent.click(deleteButton)

    expect(getByText('Are you sure?')).toBeInTheDocument()
    fireEvent.click(getByText('OK'))

    expect(queryByText('2025 Grazing Schedule')).toBeNull()
  })

  it('can copy schedules to another year', () => {
    const { queryByText, getByText, getByTestId, queryAllByText } = render(
      <Formik
        initialValues={plan}
        render={({ values }) => <GrazingSchedules plan={values} />}
      />
    )

    expect(getByText('2022 Grazing Schedule')).toBeInTheDocument()
    expect(queryByText('2024 Grazing Schedule')).toBeNull()

    const copyButton = getByTestId('copy-button-2022')

    expect(copyButton).not.toHaveClass('disabled')

    fireEvent.click(copyButton)
    fireEvent.click(queryAllByText('2024')[1])

    expect(getByText('2024 Grazing Schedule')).toBeInTheDocument()
  })

  it('renders and matches the snapshot', () => {
    const container = render(
      <Formik
        initialValues={plan}
        render={({ values }) => <GrazingSchedules plan={values} />}
      />
    )

    const { getByText } = container

    expect(getByText('2022 Grazing Schedule')).toBeInTheDocument()
    expect(getByText('2025 Grazing Schedule')).toBeInTheDocument()

    expect(container.firstChild).toMatchSnapshot()
  })
})
