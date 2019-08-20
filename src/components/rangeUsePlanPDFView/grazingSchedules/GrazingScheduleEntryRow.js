import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import * as utils from '../../../utils'
import { REFERENCE_KEY } from '../../../constants/variables'

class GrazingScheduleEntryRow extends Component {
  static propTypes = {
    entry: PropTypes.shape({}).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired
  }

  render() {
    const { references, pasturesMap, entry } = this.props
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE]
    const {
      id,
      pastureId,
      livestockTypeId,
      livestockCount,
      dateIn,
      dateOut,
      graceDays
    } = entry || {}

    const days = utils.calcDateDiff(dateOut, dateIn, false)
    const pasture = pasturesMap[pastureId]
    const pldPercent = pasture && pasture.pldPercent
    const pastureName = pasture && pasture.name
    const livestockType = livestockTypes.find(lt => lt.id === livestockTypeId)
    const livestockTypeName = livestockType && livestockType.name
    const auFactor = livestockType && livestockType.auFactor

    const totalAUMs = utils.calcTotalAUMs(livestockCount, days, auFactor)
    const pldAUMs = utils.roundTo1Decimal(
      utils.calcPldAUMs(totalAUMs, pldPercent)
    )
    const crownAUMs = utils.roundTo1Decimal(
      utils.calcCrownAUMs(totalAUMs, pldAUMs)
    )

    return (
      <Table.Row key={id}>
        <Table.Cell>{utils.handleNullValue(pastureName, false)}</Table.Cell>
        <Table.Cell>
          {utils.handleNullValue(livestockTypeName, false)}
        </Table.Cell>
        <Table.Cell collapsing>
          {utils.handleNullValue(livestockCount, false)}
        </Table.Cell>
        <Table.Cell>{utils.formatDateFromServer(dateIn, false)}</Table.Cell>
        <Table.Cell>{utils.formatDateFromServer(dateOut, false)}</Table.Cell>
        <Table.Cell collapsing>{utils.handleNullValue(days, false)}</Table.Cell>
        <Table.Cell collapsing>
          {utils.handleNullValue(graceDays || 0, false)}
        </Table.Cell>
        <Table.Cell collapsing>
          {utils.handleNullValue(pldAUMs, false)}
        </Table.Cell>
        <Table.Cell collapsing>
          {utils.handleNullValue(crownAUMs, false)}
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default GrazingScheduleEntryRow
