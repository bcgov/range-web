import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Dropdown, Input } from 'semantic-ui-react';
import Pikaday from 'pikaday';
import { formatDateFromUTC, presentNullValue, calcDateDiff } from '../../handlers';
import {
  PASTURE, LIVESTOCK_TYPE, DATE_IN, DATE_OUT,
  DAYS, NUM_OF_ANIMALS, GRACE_DAYS, PLD,
  CROWN_AUMS, NOT_PROVIDED,
} from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class EditRupSchedule extends Component {
  constructor(props) {
    super(props);

    const { plan } = this.props;
    const grazingSchedules = (plan && plan.grazingSchedules) || [];
    const pastures = (plan && plan.pastures) || [];

    this.state = {
      grazingSchedules,
      pastures,
    };
  }

  componentDidMount() {
    this.state.grazingSchedules.map((schedule, sIndex) => {
      const { year, grazingScheduleEntries } = schedule;
      const minDate = new Date(`${year}-01-02`);
      const maxDate = new Date(`${year + 1}-01-01`);

      (grazingScheduleEntries || []).map((entry, eIndex) => {
        const { dateIn, dateOut } = entry;

        const p1 = new Pikaday({
          field: this.dateInRefs[sIndex][eIndex],
          format: 'MM/DD/YYYY',
          minDate,
          maxDate,
          onSelect: this.onDateChanged(sIndex, eIndex, 'dateIn'),
        });
        p1.setDate(new Date(dateIn));

        const p2 = new Pikaday({
          field: this.dateOutRefs[sIndex][eIndex],
          format: 'MM/DD/YYYY',
          defaultDate: new Date(dateOut),
          minDate,
          maxDate,
          onSelect: this.onDateChanged(sIndex, eIndex, 'dateOut'),
        });
        p2.setDate(new Date(dateOut));
      });
    });
  }

  onDateChanged = (sIndex, eIndex, key) => (date) => {
    const grazingSchedules = [...this.state.grazingSchedules];
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex][key] = formatDateFromUTC(date);

    this.setState({
      grazingSchedules,
    });
  }

  setDateInRef = (sIndex, eIndex) => (ref) => {
    if (!this.dateInRefs) {
      this.dateInRefs = {};
    }
    if (!this.dateInRefs[sIndex]) {
      this.dateInRefs[sIndex] = {};
    }
    this.dateInRefs[sIndex][eIndex] = ref;
  }

  setDateOutRef = (sIndex, eIndex) => (ref) => {
    if (!this.dateOutRefs) {
      this.dateOutRefs = {};
    }
    if (!this.dateOutRefs[sIndex]) {
      this.dateOutRefs[sIndex] = {};
    }
    this.dateOutRefs[sIndex][eIndex] = ref;
  }

  handleInput = (sIndex, eIndex, key) => (e) => {
    const { value } = e.target;
    const grazingSchedules = [...this.state.grazingSchedules];
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex][key] = Number(value);

    this.setState({
      grazingSchedules,
    });
  }

  handleNumberOnly = (e) => {
    if (!(e.charCode >= 48 && e.charCode <= 57)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  handlePastureDropdown = (sIndex, eIndex, key) => (e, { value }) => {
    const { pastures } = this.state;
    const grazingSchedules = [...this.state.grazingSchedules];
    const pasture = pastures.find(p => p.id === value);
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex][key] = pasture;
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex].graceDays = pasture.graceDays;

    this.setState({
      grazingSchedules,
    });
  }

  renderSchedule = (schedule, scheduleIndex) => {
    const { id, year, grazingScheduleEntries = [] } = schedule;

    return (
      <div key={id} className="rup__schedule">
        <div className="rup__schedule__header">
          {year} Grazing Schedule
        </div>
        <div className="rup__schedule__table">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{PASTURE}</Table.HeaderCell>
                <Table.HeaderCell>{LIVESTOCK_TYPE}</Table.HeaderCell>
                <Table.HeaderCell>{NUM_OF_ANIMALS}</Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__table__dates">{DATE_IN}</div></Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__table__dates">{DATE_OUT}</div></Table.HeaderCell>
                <Table.HeaderCell>{DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{GRACE_DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{PLD}</Table.HeaderCell>
                <Table.HeaderCell>{CROWN_AUMS}</Table.HeaderCell>
              </Table.Row>
              {this.renderScheduleEntries(grazingScheduleEntries, scheduleIndex)}
            </Table.Header>
          </Table>
        </div>
      </div>
    );
  }

  renderScheduleEntries = (grazingScheduleEntries, scheduleIndex) => {
    const pastureOptions = this.state.pastures.map((pasture) => {
      const { id, name } = pasture || {};
      return {
        key: id,
        value: id,
        text: name,
      };
    });
    const livestockTypeOptions = this.props.livestockTypes.map((lt) => {
      const { id, name } = lt || {};
      return {
        key: id,
        value: id,
        text: name,
      };
    });

    return grazingScheduleEntries.map((entry, entryIndex) => {
      const {
        id,
        pasture,
        livestockType,
        livestockCount,
        dateIn,
        dateOut,
        graceDays,
      } = entry;
      const days = calcDateDiff(dateOut, dateIn);
      const pastureName = pasture && pasture.name;
      const livestockTypeName = livestockType && livestockType.name;

      return (
        <Table.Row key={id}>
          <Table.Cell>
            <Dropdown
              placeholder={pastureName}
              options={pastureOptions}
              onChange={this.handlePastureDropdown(scheduleIndex, entryIndex, 'pasture')}
              fluid
              search
              selection
            />
          </Table.Cell>
          <Table.Cell>
            <Dropdown
              placeholder={livestockTypeName}
              options={livestockTypeOptions}
              onChange={this.onZoneChanged}
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
                onChange={this.handleInput(scheduleIndex, entryIndex, 'livestockCount')}
              />
            </Input>
          </Table.Cell>
          <Table.Cell>
            <Input fluid>
              <input
                type="text"
                ref={this.setDateInRef(scheduleIndex, entryIndex)}
              />
            </Input>
          </Table.Cell>
          <Table.Cell>
            <Input fluid>
              <input
                type="text"
                ref={this.setDateOutRef(scheduleIndex, entryIndex)}
              />
            </Input>
          </Table.Cell>
          <Table.Cell>{presentNullValue(days, false)}</Table.Cell>
          <Table.Cell>{presentNullValue(graceDays, false)}</Table.Cell>
          <Table.Cell>{presentNullValue(pasture.pldPercent, false)}</Table.Cell>
          <Table.Cell>{presentNullValue(pasture.allowableAum, false)}</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    const { className } = this.props;
    const { grazingSchedules } = this.state;

    return (
      <div className={className}>
        <div className="rup__title--editable">
          <div>Schedules</div>
          <Button basic primary>Add year</Button>
        </div>
        <div className="rup__divider" />
        {
          grazingSchedules.length === 0 ? (
            <div className="rup__section-not-found">{NOT_PROVIDED}</div>
          ) : (
            grazingSchedules.map(this.renderSchedule)
          )
        }
      </div>
    );
  }
}

EditRupSchedule.propTypes = propTypes;
export default EditRupSchedule;
