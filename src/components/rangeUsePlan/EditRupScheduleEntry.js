import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Dropdown, Input, Icon, TextArea, Form } from 'semantic-ui-react';
import {
  presentNullValue,
  calcDateDiff,
  calcTotalAUMs,
  calcCrownAUMs,
  calcPldAUMs,
} from '../../handlers';

const propTypes = {
  entry: PropTypes.shape({}).isRequired,
  pastureOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  livestockTypeOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  // scheduleIndex: PropTypes.number.isRequired,
  // onScheduleClicked: PropTypes.func.isRequired,
  // activeScheduleIndex: PropTypes.number.isRequired,
  // handleScheduleChange: PropTypes.func.isRequired,
};

class EditRupScheduleEntry extends Component {
  handleNumberOnly = (e) => {
    if (!(e.charCode >= 48 && e.charCode <= 57)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    const {
      entry,
      entryIndex,
      pastureOptions,
      livestockTypeOptions,
    } = this.props;

    const {
      pasture,
      livestockType,
      livestockCount,
      dateIn,
      dateOut,
    } = entry || {};

    const days = calcDateDiff(dateOut, dateIn, false);
    const pastureName = pasture && pasture.name;
    const auFactor = livestockType && livestockType.auFactor;
    const totalAUMs = calcTotalAUMs(livestockCount, days, auFactor);
    const pldAUMs = calcPldAUMs(totalAUMs, pasture && pasture.pldPercent).toFixed(2);
    const crownAUMs = calcCrownAUMs(totalAUMs, pldAUMs).toFixed(2);
    const livestockTypeName = livestockType && livestockType.name;
    const graceDays = pasture && pasture.graceDays;
    const key = `entry${entryIndex}`;

    return (
      <Table.Row key={key}>
        <Table.Cell>
          <Dropdown
            placeholder={pastureName}
            options={pastureOptions}
            selectOnBlur={false}
            // onChange={this.handlePastureDropdown(scheduleIndex, entryIndex, 'pasture')}
            fluid
            search
            selection
          />
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            placeholder={livestockTypeName}
            options={livestockTypeOptions}
            selectOnBlur={false}
            // onChange={this.handleLiveStockTypeDropdown(scheduleIndex, entryIndex, 'livestockType')}
            fluid
            search
            selection
          />
        </Table.Cell>
        <Table.Cell>
          <Input fluid>
            <input
              type="text"
              onKeyPress={this.handleNumberOnly}
              value={livestockCount || 0}
              // onChange={this.handleInput(scheduleIndex, entryIndex, 'livestockCount')}
            />
          </Input>
        </Table.Cell>
        <Table.Cell>
          <Input fluid>
            <input
              type="text"
              // ref={this.setDateInRef(scheduleIndex, entryIndex)}
            />
          </Input>
        </Table.Cell>
        <Table.Cell>
          <Input fluid>
            <input
              type="text"
              // ref={this.setDateOutRef(scheduleIndex, entryIndex)}
            />
          </Input>
        </Table.Cell>
        <Table.Cell>{presentNullValue(days, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(graceDays, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(pldAUMs, false)}</Table.Cell>
        <Table.Cell>{presentNullValue(crownAUMs, false)}</Table.Cell>
      </Table.Row>
    );
  }
}

EditRupScheduleEntry.propTypes = propTypes;
export default EditRupScheduleEntry;
