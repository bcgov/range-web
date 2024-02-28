import React from 'react';
import uuid from 'uuid-v4';
import { Formik } from 'formik';
import { render, fireEvent, waitFor } from '../../../tests/helpers/test-utils';
import GrazingScheduleBox from './GrazingScheduleBox';
import moment from 'moment';

const grazingSchedules = [
  {
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
      },
    ],
  },
];

const pastures = [
  { id: 1, name: 'Pasture 1' },
  { id: 2, name: 'Pasture 2' },
];

const namespace = 'grazingSchedules.0';

const WrappedComponent = ({
  initialValues = { grazingSchedules, pastures },
  ...props
}) => (
  <Formik
    initialValues={initialValues}
    render={({ values }) => (
      <GrazingScheduleBox
        activeIndex={1}
        index={1}
        schedule={values.grazingSchedules[0]}
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
);

describe('Grazing Schedule Entry Box', () => {
  it('duplicates a row when the duplicate button is pressed', async () => {
    const { getByText, getAllByLabelText, getAllByTestId } = render(
      <WrappedComponent />,
    );

    const firstMenu = getAllByTestId('schedule-row-menu')[0].firstChild;
    fireEvent.click(firstMenu);

    fireEvent.click(getByText('Duplicate'));

    await waitFor(() => {
      const pastureDropdowns = getAllByLabelText('pasture');
      expect(pastureDropdowns).toHaveLength(2);
      expect(pastureDropdowns[0].value).toBe(pastureDropdowns[1].value);
    });

    const livestockTypes = getAllByLabelText('livestock type');
    expect(livestockTypes).toHaveLength(2);
    expect(livestockTypes[0].value).toBe(livestockTypes[1].value);

    const livestockCounts = getAllByLabelText('livestock count');
    expect(livestockCounts).toHaveLength(2);
    expect(livestockCounts[0].value).toBe(livestockCounts[1].value);

    const dateIns = getAllByLabelText('date in');
    expect(dateIns).toHaveLength(2);
    expect(dateIns.value).toBe();

    const dateOuts = getAllByLabelText('date out');
    expect(dateOuts).toHaveLength(2);
    expect(dateOuts[0].value).toBe(dateOuts[1].value);
  });

  it('deletes a row when the delete button is pressed', async () => {
    const { getAllByText, getByText, queryAllByLabelText, getAllByTestId } =
      render(<WrappedComponent />);

    const firstMenu = getAllByTestId('schedule-row-menu')[0].firstChild;
    fireEvent.click(firstMenu);

    // The first delete button is for the whole schedule. We want the button for
    // just the row.
    const rowDeleteButton = getAllByText('Delete')[1];
    expect(rowDeleteButton).not.toHaveClass('disabled');
    fireEvent.click(rowDeleteButton);

    await waitFor(() => getByText('OK'));

    // Click 'OK' in confirmation modal
    fireEvent.click(getByText('OK'));

    const pastureDropdowns = queryAllByLabelText('pasture');
    expect(pastureDropdowns).toHaveLength(0);

    const livestockTypes = queryAllByLabelText('livestock type');
    expect(livestockTypes).toHaveLength(0);

    const livestockCounts = queryAllByLabelText('livestock count');
    expect(livestockCounts).toHaveLength(0);

    const dateIns = queryAllByLabelText('date in');
    expect(dateIns).toHaveLength(0);

    const dateOuts = queryAllByLabelText('date out');
    expect(dateOuts).toHaveLength(0);
  });

  it('does not disable the delete button when an entry is persisted', () => {
    const { getAllByText, getAllByTestId } = render(
      <WrappedComponent
        initialValues={{
          grazingSchedules: [
            {
              ...grazingSchedules[0],
              grazingScheduleEntries: [
                { ...grazingSchedules[0].grazingScheduleEntries[0], id: 1 },
              ],
            },
          ],
          pastures,
        }}
      />,
    );

    const firstMenu = getAllByTestId('schedule-row-menu')[0].firstChild;
    fireEvent.click(firstMenu);

    // The first delete button is for the whole schedule. We want the button for
    // just the row.
    const rowDeleteButton = getAllByText('Delete')[1];
    expect(rowDeleteButton.parentElement).not.toHaveClass('disabled');
  });
});
