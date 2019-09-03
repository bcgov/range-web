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

const GrazingScheduleEntryRow = ({
  entry,
  pasture,
  formik,
  namespace,
  onDelete,
  onCopy
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

  const pastureOptions = formik.values.pastures.map(pasture => {
    const { id, name } = pasture || {}
    return {
      key: id,
      value: id,
      text: name
    }
  })
  const livestockTypeOptions = livestockTypes.map(lt => {
    const { id, name } = lt || {}
    return {
      key: id,
      value: id,
      text: name
    }
  })

  const days = utils.calcDateDiff(dateOut, dateIn, false)
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

  return (
    <Table.Row>
      <Table.Cell>
        <PermissionsField
          permission={SCHEDULE.PASTURE}
          name={`${namespace}.pastureId`}
          options={pastureOptions}
          component={FormikDropdown}
          displayValue={
            pastureOptions.find(p => p.value === pastureId)
              ? pastureOptions.find(p => p.value === pastureId).text
              : ''
          }
          inputProps={{
            fluid: true,
            search: true
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
            fluid: true,
            search: true
          }}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.TYPE}
          name={`${namespace}.livestockCount`}
          displayValue={livestockCount}
          inputProps={{
            fluid: true
          }}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.DATE_IN}
          name={`${namespace}.dateIn`}
          component={DateInputField}
          displayValue={dateIn}
          fluid
          dateFormat="MMM DD"
          icon={null}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.DATE_OUT}
          name={`${namespace}.dateOut`}
          component={DateInputField}
          displayValue={dateOut}
          dateFormat="MMM DD"
          fluid
          icon={null}
        />
      </Table.Cell>
      <Table.Cell collapsing>{utils.handleNullValue(days, false)}</Table.Cell>
      <Table.Cell collapsing>
        <PermissionsField
          permission={SCHEDULE.GRACE_DAYS}
          name={`${namespace}.graceDays`}
          displayValue={graceDays}
          inputProps={{
            type: 'number',
            fluid: true
          }}
          fluid
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
  pasture: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired
}

export default connect(GrazingScheduleEntryRow)
