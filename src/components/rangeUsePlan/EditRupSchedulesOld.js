import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Pikaday from 'pikaday';
import { Table, Button, Dropdown, Input, Icon, TextArea, Form } from 'semantic-ui-react';
import { SCHEUDLE_ENTRY_DATE_FORMAT } from '../../constants/variables';
import { createOrUpdateRupSchedule } from '../../actions/rangeUsePlanActions';
import {
  formatDateFromUTC,
  presentNullValue,
  calcDateDiff,
  calcTotalAUMs,
  calcCrownAUMs,
  calcPldAUMs,
  calcCrownTotalAUMs,
} from '../../handlers';
import {
  PASTURE, LIVESTOCK_TYPE, DATE_IN, DATE_OUT,
  DAYS, NUM_OF_ANIMALS, GRACE_DAYS, PLD,
  CROWN_AUMS, NOT_PROVIDED,
} from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}),
  usage: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string.isRequired,
  createOrUpdateRupSchedule: PropTypes.func.isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
  plan: {},
  usage: [],
  livestockTypes: [],
};

class EditRupSchedules extends Component {
  constructor(props) {
    super(props);

    const { plan } = this.props;
    const grazingSchedules = (plan && plan.grazingSchedules) || [];
    const pastures = (plan && plan.pastures) || [];
    const yearOptions = this.getInitialYearOptions(plan, grazingSchedules);

    this.state = {
      grazingSchedules,
      pastures,
      yearOptions,
      activeScheduleIndex: 0,
    };
  }

  componentDidMount() {
    // set up date pickers
    this.state.grazingSchedules.map((schedule, sIndex) => {
      const { year, grazingScheduleEntries } = schedule;
      const minDate = new Date(`${year}-01-02`);
      const maxDate = new Date(`${year + 1}-01-01`);

      (grazingScheduleEntries || []).map((entry, eIndex) => {
        const { dateIn, dateOut } = entry;

        const p1 = new Pikaday({
          field: this.dateInRefs[sIndex][eIndex],
          format: SCHEUDLE_ENTRY_DATE_FORMAT,
          minDate,
          maxDate,
          onSelect: this.onDateChanged(sIndex, eIndex, 'dateIn'),
        });
        p1.setDate(new Date(dateIn));

        const p2 = new Pikaday({
          field: this.dateOutRefs[sIndex][eIndex],
          format: SCHEUDLE_ENTRY_DATE_FORMAT,
          minDate,
          maxDate,
          onSelect: this.onDateChanged(sIndex, eIndex, 'dateOut'),
        });
        p2.setDate(new Date(dateOut));
      });
    });
  }

  onYearSelected = (e, { value: year }) => {
    const grazingSchedules = [...this.state.grazingSchedules];
    grazingSchedules.push({ year, grazingScheduleEntries: [] });
    grazingSchedules.sort((s1, s2) => s1.year > s2.year);

    const yearOptions = this.state.yearOptions.filter(y => y.value !== year);
    const activeScheduleIndex = grazingSchedules.findIndex(s => s.year === year);

    this.setState({
      grazingSchedules,
      yearOptions,
      activeScheduleIndex,
    });
  }

  onDateChanged = (sIndex, eIndex, key) => (date) => {
    const grazingSchedules = [...this.state.grazingSchedules];
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex][key] = formatDateFromUTC(date);

    this.setState({
      grazingSchedules,
    });
  }

  onSaveClick = () => {
    const { createOrUpdateRupSchedule, plan: { id: planId } } = this.props;
    Promise.all(this.state.grazingSchedules.map(schedule => (
      createOrUpdateRupSchedule({ planId, schedule })
    ))).then((data) => {
      console.log(data);
    });
  }

  onNewRowClick = sIndex => () => {
    const grazingSchedules = [...this.state.grazingSchedules];
    const { year, grazingScheduleEntries } = grazingSchedules[sIndex] || {};
    grazingScheduleEntries.push({});
    const eIndex = grazingScheduleEntries.length - 1;
    const minDate = new Date(`${year}-01-02`);
    const maxDate = new Date(`${year + 1}-01-01`);

    this.setState({
      grazingSchedules,
    }, () => {
      // set up date pickers for a new entry
      const p1 = new Pikaday({
        field: this.dateInRefs[sIndex][eIndex],
        format: SCHEUDLE_ENTRY_DATE_FORMAT,
        minDate,
        maxDate,
        onSelect: this.onDateChanged(sIndex, eIndex, 'dateIn'),
      });
      p1.setDate(new Date(minDate));

      const p2 = new Pikaday({
        field: this.dateOutRefs[sIndex][eIndex],
        format: SCHEUDLE_ENTRY_DATE_FORMAT,
        minDate,
        maxDate,
        onSelect: this.onDateChanged(sIndex, eIndex, 'dateOut'),
      });
      p2.setDate(new Date(maxDate));
    });
  }

  onScheduleClicked = scheduleIndex => (e) => {
    const { activeScheduleIndex } = this.state;
    const newIndex = activeScheduleIndex === scheduleIndex ? -1 : scheduleIndex;

    this.setState({ activeScheduleIndex: newIndex });
  }

  getInitialYearOptions = (plan, grazingSchedules) => {
    const { planStartDate, planEndDate } = plan || {};
    if (planStartDate && planEndDate) {
      // set up year options
      const psd = new Date(planStartDate).getFullYear();
      const ped = new Date(planEndDate).getFullYear();
      const length = (ped - psd) + 1;
      const yearOptions = Array.apply(null, { length })
        .map((v, i) => (
          {
            key: psd + i,
            text: psd + i,
            value: psd + i,
          }
        ))
        .filter((y) => {
          // give only available year options
          const years = grazingSchedules.map(s => s.year);
          return !years.includes(y.value);
        });
      return yearOptions;
    }
    return [];
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
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex].pastureId = pasture.id;
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex].graceDays = pasture.graceDays;

    this.setState({
      grazingSchedules,
    });
  }

  handleLiveStockTypeDropdown = (sIndex, eIndex, key) => (e, { value }) => {
    const { livestockTypes } = this.props;
    const grazingSchedules = [...this.state.grazingSchedules];
    const livestockType = livestockTypes.find(p => p.id === value);
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex][key] = livestockType;
    grazingSchedules[sIndex].grazingScheduleEntries[eIndex].livestockTypeId = livestockType.id;
    this.setState({
      grazingSchedules,
    });
  }

  renderSchedule = (schedule, scheduleIndex) => {
    const { year, grazingScheduleEntries } = schedule;
    const key = `schedule${scheduleIndex}`;
    const yearUsage = this.props.usage.find(u => u.year === year);
    const authorizedAUMs = yearUsage && yearUsage.authorizedAum;
    const totalCrownTotalAUMs = calcCrownTotalAUMs(grazingScheduleEntries).toFixed(2);
    const isScheduleActive = this.state.activeScheduleIndex === scheduleIndex;
    const arrow = isScheduleActive
      ? (<Icon name="chevron up" />)
      : (<Icon name="chevron down" />);

    return (
      <li key={key} className="rup__schedule">
        <div
          className="rup__schedule__header"
          onClick={this.onScheduleClicked(scheduleIndex)}
          role="button"
        >
          <div>{year} Grazing Schedule</div>
          <div>
            {arrow}
          </div>
        </div>
        <div className={classNames('rup__schedule__content', { 'rup__schedule__content__hidden': !isScheduleActive })} >
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{PASTURE}</Table.HeaderCell>
                <Table.HeaderCell>{LIVESTOCK_TYPE}</Table.HeaderCell>
                <Table.HeaderCell>{NUM_OF_ANIMALS}</Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__content__dates">{DATE_IN}</div></Table.HeaderCell>
                <Table.HeaderCell><div className="rup__schedule__content__dates">{DATE_OUT}</div></Table.HeaderCell>
                <Table.HeaderCell>{DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{GRACE_DAYS}</Table.HeaderCell>
                <Table.HeaderCell>{PLD}</Table.HeaderCell>
                <Table.HeaderCell>{CROWN_AUMS}</Table.HeaderCell>
              </Table.Row>
              {this.renderScheduleEntries(grazingScheduleEntries, scheduleIndex)}
            </Table.Header>
          </Table>
          <Button style={{ margin: '10px 0' }} icon basic onClick={this.onNewRowClick(scheduleIndex)}><Icon name="add" /> Add row</Button>
          <div className="rup__schedule__content__AUMs">
            <div className="rup__schedule__content__AUM-label">Authorized AUMs</div>
            <div className="rup__schedule__content__AUM-number">{authorizedAUMs}</div>
            <div className="rup__schedule__content__AUM-label">Total AUMs</div>
            <div className="rup__schedule__content__AUM-number">{totalCrownTotalAUMs}</div>
          </div>
          {/* <b>Schedule Description</b>
          <Form>
            <TextArea
              rows={2}
              onChange={this.onScheduleTextChanged}
            />
          </Form> */}
        </div>
      </li>
    );
  }

  renderScheduleEntries = (grazingScheduleEntries = [], scheduleIndex) => {
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
              selectOnBlur={false}
              onChange={this.handleLiveStockTypeDropdown(scheduleIndex, entryIndex, 'livestockType')}
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
          <Table.Cell>{presentNullValue(pldAUMs, false)}</Table.Cell>
          <Table.Cell>{presentNullValue(crownAUMs, false)}</Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    const { className } = this.props;
    const { grazingSchedules, yearOptions } = this.state;

    return (
      <div className={className}>
        <div className="rup__title--editable">
          <div>Yearly Schedules</div>
          <Dropdown
            className="icon"
            text="Add Yearly schedule"
            icon="add"
            basic
            labeled
            button
            item
            options={yearOptions}
            disabled={yearOptions.length === 0}
            onChange={this.onYearSelected}
            selectOnBlur={false}
          />
        </div>
        <div className="rup__divider" />
        <ul className="rup__schedules">
          {
            grazingSchedules.length === 0 ? (
              <div className="rup__section-not-found">{NOT_PROVIDED}</div>
            ) : (
              grazingSchedules
                .map(this.renderSchedule)
            )
          }
        </ul>
        <Button onClick={this.onSaveClick}>Save Schedules</Button>
      </div>
    );
  }
}
const mapStateToProps = state => (
  {
  }
);

EditRupSchedules.propTypes = propTypes;
EditRupSchedules.defaultProps = defaultProps;
export default connect(mapStateToProps, {
  createOrUpdateRupSchedule,
})(EditRupSchedules);
