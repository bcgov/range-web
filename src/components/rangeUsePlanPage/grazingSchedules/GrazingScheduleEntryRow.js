import React from 'react'
import PropTypes from 'prop-types'
import { Table, Dropdown, Icon } from 'semantic-ui-react'
import { Dropdown as FormikDropdown } from 'formik-semantic-ui'
import { connect } from 'formik'
import * as utils from '../../../utils'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { SCHEDULE } from '../../../constants/fields'
import DateInputField from '../../common/form/DateInputField'
import moment from 'moment'
import PasturesDropdown from './PasturesDropdown'

const GrazingScheduleEntryRow = ({
  entry,
  formik,
  namespace,
  onDelete,
  onCopy,
  schedule
}) => {
  const {
    pastureId,
    livestockTypeId,
    livestockCount,
    dateIn,
    dateOut,
    graceDays
  } = entry || {}

  const references = useReferences()
  const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE]

  const livestockTypeOptions = livestockTypes.map(lt => {
    const { id, name } = lt || {}
    return {
      key: id,
      value: id,
      text: name
    }
  })

  const days = utils.calcDateDiff(dateOut, dateIn, false)
  const pasture = formik.values.pastures.find(p => p.id === pastureId)

  const pldPercent = pasture && pasture.pldPercent
  const livestockType = livestockTypes.find(lt => lt.id === livestockTypeId)
  const auFactor = livestockType && livestockType.auFactor

  const totalAUMs = utils.calcTotalAUMs(livestockCount, days, auFactor)
  const pldAUMs = utils.roundTo1Decimal(
    utils.calcPldAUMs(totalAUMs, pldPercent)
  )
  const crownAUMs = utils.roundTo1Decimal(
    utils.calcCrownAUMs(totalAUMs, pldAUMs)
  )

  const entryOptions = [
    { key: 'copy', text: 'Duplicate', onClick: onCopy },
    {
      key: 'delete',
      text: 'Delete',
      onClick: onDelete
    }
  ]

  const initialDate = moment()
    .set('year', schedule.year)
    .set('month', 0)
    .set('date', 1)

  const maxDate = moment()
    .set('year', schedule.year)
    .set('month', 11)
    .set('date', 31)

  return (
    <Table.Row>
      <Table.Cell>
        <PasturesDropdown
          name={`${namespace}.pastureId`}
          pastureId={pastureId}
          onChange={(e, { pasture }) => {
            formik.setFieldValue(
              `${namespace}.graceDays`,
              pasture.graceDays || 0
            )
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <PermissionsField
          permission={SCHEDULE.TYPE}
          name={`${namespace}.livestockTypeId`}
          options={livestockTypeOptions}
          component={FormikDropdown}
          displayValue={
            livestockTypeOptions.find(o => o.value === livestockTypeId)
              ? livestockTypeOptions.find(o => o.value === livestockTypeId).text
              : ''
          }
          inputProps={{
            search: true,
            'aria-label': 'livestock type'
          }}
          fast
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.TYPE}
          name={`${namespace}.livestockCount`}
          displayValue={livestockCount}
          inputProps={{
            'aria-label': 'livestock count'
          }}
          fast
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.DATE_IN}
          name={`${namespace}.dateIn`}
          component={DateInputField}
          displayValue={moment(dateIn).format('MMM D')}
          dateFormat="MMM D YYYY"
          icon={null}
          initialDate={initialDate}
          minDate={initialDate}
          maxDate={maxDate}
          aria-label="date in"
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.DATE_OUT}
          name={`${namespace}.dateOut`}
          component={DateInputField}
          displayValue={moment(dateOut).format('MMM D')}
          dateFormat="MMM D YYYY"
          icon={null}
          initialDate={initialDate}
          minDate={initialDate}
          maxDate={maxDate}
          aria-label="date out"
        />
      </Table.Cell>
      <Table.Cell collapsing>{utils.handleNullValue(days, false)}</Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.GRACE_DAYS}
          name={`${namespace}.graceDays`}
          displayValue={graceDays || (pasture && pasture.graceDays) || 0}
          inputProps={{
            type: 'number',
            'aria-label': 'grace days'
          }}
          fieldProps={{
            onBlur: e => {
              if (e.target.value.trim() === '') {
                formik.setFieldValue(`${namespace}.graceDays`, 0)
              }
            }
          }}
          fast
        />
      </Table.Cell>
      <Table.Cell collapsing>
        {utils.handleNullValue(pldAUMs, false)}
      </Table.Cell>
      <Table.Cell collapsing>
        {utils.handleNullValue(crownAUMs, false)}
      </Table.Cell>
      <IfEditable permission={SCHEDULE.TYPE}>
        <Table.Cell collapsing textAlign="center">
          <Dropdown
            trigger={<Icon name="ellipsis vertical" />}
            options={entryOptions}
            icon={null}
            pointing="right"
          />
        </Table.Cell>
      </IfEditable>
    </Table.Row>
  )
}

GrazingScheduleEntryRow.propTypes = {
  entry: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired
}

export default connect(GrazingScheduleEntryRow)
