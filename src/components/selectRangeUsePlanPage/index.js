import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Checkbox, FormControlLabel, Tooltip } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import * as API from '../../constants/api';
import {
  SELECT_RUP_BANNER_CONTENT,
  SELECT_RUP_BANNER_HEADER,
  TOOLTIP_TEXT_ACTIVE_RUP,
  TOOLTIP_TEXT_ARCHIVED_PLANS,
  TOOLTIP_TEXT_RANGE_AGREEMENT,
  TOOLTIP_TEXT_RUP_CREATED,
} from '../../constants/strings';
import { useReferences } from '../../providers/ReferencesProvider';
import { useUser } from '../../providers/UserProvider';
import {
  axios,
  getAuthHeaderConfig,
  isUserAdmin,
  isUserAgrologist,
  getDataFromLocalStorage,
  saveDataInLocalStorage,
} from '../../utils';
import { Banner } from '../common';
import SortableAgreementTable from './SortableAgreementTable';
import ZoneSelect, { ZoneSelectAll } from './ZoneSelect';

const useStyles = makeStyles(() => ({
  searchFilterContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '15px',
    justifyContent: 'space-between',
  },
  checkboxBorder: {
    border: '1px solid black',
    borderRadius: '3px',
    padding: '4px',
    margin: '0 1rem',
  },
}));

const StyledTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: theme.typography.pxToRem(14),
  },
}))(Tooltip);

const SelectRangeUsePlanPage = () => {
  const [filterSettings, setFilterSettings] = useState({
    page: 1,
    limit: 10,
    orderBy: 'agreement.forest_file_id',
    order: 'asc',
    agreementCheck: true,
    showReplacedPlans: false,
    planCheck: false,
    activeCheck: false,
    statusCodes: '',
    columnFilters: {},
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const references = useReferences();
  const user = useUser();
  const zones = references.ZONES || [];
  const userZones = zones.filter((zone) => user.id === zone.userId);
  const districtIds = userZones.map((userZone) => userZone.districtId);

  const fetchAgreements = useCallback(
    debounce(async (settings) => {
      setLoading(true);
      saveDataInLocalStorage('filterSettings', settings);
      try {
        const response = await axios.get(API.SEARCH_AGREEMENTS, {
          ...getAuthHeaderConfig(),
          params: { filterSettings: settings },
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching agreements:', error);
      } finally {
        setLoading(false);
      }
    }, 300), // 300ms delay
    [],
  );

  useEffect(() => {
    const storedFilterSettings = getDataFromLocalStorage('filterSettings');
    if (storedFilterSettings) {
      setFilterSettings((prevSettings) => ({
        ...prevSettings,
        ...storedFilterSettings,
        page: storedFilterSettings.page || 1,
        limit: storedFilterSettings.limit || 10,
      }));
    }
  }, []);

  useEffect(() => {
    fetchAgreements(filterSettings);
  }, [filterSettings, fetchAgreements]);

  const unassignedZones = zones.filter(
    (zone) =>
      user.id !== zone.userId && districtIds.indexOf(zone.districtId) !== -1,
  );

  const zoneUsers = references.USERS;
  const { agreements, totalPages, totalItems } = data || {};
  const classes = useStyles();

  const handleFilterChange = (field) => (event) => {
    setFilterSettings((prevSettings) => ({
      ...prevSettings,
      [field]: event.target.checked,
    }));
  };

  const handlePageChange = (event, page) => {
    setFilterSettings((prevSettings) => ({
      ...prevSettings,
      page: page + 1,
    }));
  };

  const handleLimitChange = (limit) => {
    setFilterSettings((prevSettings) => ({
      ...prevSettings,
      limit,
      page: 1, // Reset to first page when limit changes
    }));
  };

  const handleOrderChange = (orderBy, order) => {
    setFilterSettings((prevSettings) => ({
      ...prevSettings,
      orderBy,
      order,
    }));
  };

  const handleColumnFilterChange = (column, value) => {
    setFilterSettings((prevSettings) => {
      const columnFilters = { ...prevSettings.columnFilters };
      if (value === '') {
        delete columnFilters[column];
      } else {
        columnFilters[column] = value;
      }
      return { ...prevSettings, columnFilters, page: 1 };
    });
  };

  const handleSelectedZonesChange = (selectedZones) => {
    setFilterSettings((prevSettings) => {
      return {
        ...prevSettings,
        selectedZones,
      };
    });
  };

  return (
    <section className="agreement">
      <Banner
        header={SELECT_RUP_BANNER_HEADER}
        content={SELECT_RUP_BANNER_CONTENT}
      />
      <div className={classes.searchFilterContainer}>
        <div className={classes.checkboxBorder}>
          <StyledTooltip title={TOOLTIP_TEXT_RUP_CREATED}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterSettings.planCheck}
                  onChange={handleFilterChange('planCheck')}
                  name="planCheck"
                  color="primary"
                />
              }
              label="RUP Created"
            />
          </StyledTooltip>
          <StyledTooltip title={TOOLTIP_TEXT_RANGE_AGREEMENT}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterSettings.agreementCheck}
                  onChange={handleFilterChange('agreementCheck')}
                  name="agreementCheck"
                  color="primary"
                />
              }
              label="Range Agreement"
            />
          </StyledTooltip>
          <StyledTooltip title={TOOLTIP_TEXT_ACTIVE_RUP}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterSettings.activeCheck}
                  onChange={handleFilterChange('activeCheck')}
                  name="activeCheck"
                  color="primary"
                />
              }
              label="Active RUP"
            />
          </StyledTooltip>
          <StyledTooltip title={TOOLTIP_TEXT_ARCHIVED_PLANS}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filterSettings.showReplacedPlans}
                  onChange={handleFilterChange('showReplacedPlans')}
                  name="showReplacedPlans"
                  color="primary"
                />
              }
              label="Replaced Plans"
            />
          </StyledTooltip>
        </div>
        {isUserAgrologist(user) && (
          <ZoneSelect
            zones={zones}
            userZones={userZones}
            unassignedZones={unassignedZones}
            zoneUsers={zoneUsers}
            setSearchSelectedZones={handleSelectedZonesChange}
          />
        )}
        {isUserAdmin(user) && (
          <ZoneSelectAll
            zones={zones}
            setSearchSelectedZones={handleSelectedZonesChange}
          />
        )}
      </div>
      <SortableAgreementTable
        agreements={agreements}
        currentPage={filterSettings.page - 1}
        totalPages={totalPages}
        totalAgreements={totalItems}
        perPage={filterSettings.limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        loading={loading}
        onOrderChange={handleOrderChange}
        onColumnFilterChange={handleColumnFilterChange}
        orderBy={filterSettings.orderBy}
        order={filterSettings.order}
        columnFilters={filterSettings.columnFilters}
      />
    </section>
  );
};

export default SelectRangeUsePlanPage;
