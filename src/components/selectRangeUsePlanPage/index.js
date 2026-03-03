import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Checkbox, FormControlLabel, Select, MenuItem, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as API from '../../constants/api';
import {
  SELECT_RUP_BANNER_CONTENT,
  SELECT_RUP_BANNER_HEADER,
  TOOLTIP_TEXT_ACTIVE_RUP,
  TOOLTIP_TEXT_RANGE_AGREEMENT,
  TOOLTIP_TEXT_RUP_CREATED,
  TOOLTIP_TEXT_MISSING_RUP,
  TOOLTIP_TEXT_DM_ACTIONABLE_ONLY,
  DM_ACTIONABLE_ONLY,
} from '../../constants/strings';
import { useReferences } from '../../providers/ReferencesProvider';
import { useUser } from '../../providers/UserProvider';
import {
  axios,
  getAuthHeaderConfig,
  isUserAdmin,
  isUserAgrologist,
  isUserDecisionMaker,
  isUserAuditor,
  getDataFromLocalStorage,
  saveDataInLocalStorage,
} from '../../utils';
import { Banner, PrimaryButton } from '../common';
import StyledTooltip from '../../helper/StyledTooltip';
import SortableAgreementTable from './SortableAgreementTable';
import { ZoneSelect, ZoneSelectAll } from './ZoneSelect';
import { CircularProgress } from '@mui/material';

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
    marginRight: '8px',
  },
}));

const SelectRangeUsePlanPage = () => {
  const user = useUser();
  const [users, setUsers] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingLivestock, setExportingLivestock] = useState(false);
  const [exportOption, setExportOption] = useState('');
  const [data, setData] = useState(null);
  const { agreements, totalPages, totalItems } = data || {};
  const references = useReferences();
  const zones = references.ZONES || [];
  const userZones = zones?.filter((zone) => user.id === zone.userId);
  const districtIds = userZones?.map((userZone) => userZone.districtId);
  const unassignedZones = zones?.filter(
    (zone) => user.id !== zone.userId && districtIds.indexOf(zone.districtId) !== -1,
  );
  const defaultSelectedZones = isUserAdmin(user)
    ? zones?.map((zone) => zone.id)
    : isUserAgrologist(user)
      ? userZones?.concat(unassignedZones).map((zone) => zone.id)
      : [];
  const defaultFilterSettings = {
    page: 1,
    limit: 10,
    orderBy: 'agreement.forest_file_id',
    order: 'asc',
    agreementCheck: true,
    planCheck: false,
    activeCheck: false,
    missingRUP: false,
    dmActionableOnly: false,
    statusCodes: '',
    zoneInfo: {
      selectedZones: defaultSelectedZones,
      selectAllZones: true,
      deselectAllZones: false,
    },
    columnFilters: {},
  };
  const [filterSettings, setFilterSettings] = useState(defaultFilterSettings);
  const fetchAgreements = useCallback(
    debounce(async (settings, controller) => {
      setLoading(true);
      saveDataInLocalStorage('filterSettings', settings);
      try {
        const response = await axios.get(API.SEARCH_AGREEMENTS, {
          ...getAuthHeaderConfig(),
          params: { filterSettings: settings },
          signal: controller.signal,
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
    const fetchUsers = async () => {
      const response = await axios.get(
        `${API.GET_USERS}/?orderCId=desc&excludeBy=username&exclude=bceid`,
        getAuthHeaderConfig(),
      );
      setUsers(response.data);
    };
    fetchUsers();
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

  const setZoneInfo = (zoneInfo) => {
    setFilterSettings({ ...filterSettings, zoneInfo: zoneInfo, page: 1 });
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchAgreements(filterSettings, controller);
    return () => {
      controller.abort();
    };
  }, [filterSettings, fetchAgreements]);

  const handleFilterChange = (field) => (event) => {
    setFilterSettings((prevSettings) => {
      const newSettings = {
        ...prevSettings,
        [field]: event.target.checked,
      };

      // Make Active RUP and Missing RUP mutually exclusive
      if (field === 'activeCheck' && event.target.checked) {
        newSettings.missingRUP = false;
      } else if (field === 'missingRUP' && event.target.checked) {
        newSettings.activeCheck = false;
      }
      return newSettings;
    });
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

  const refreshData = () => {
    fetchAgreements(filterSettings, new AbortController());
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await axios.get(API.EXPORT_AGREEMENTS, {
        ...getAuthHeaderConfig(),
        params: { filterSettings },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `agreements-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setExporting(false);
      setExportOption('');
    }
  };

  const handleExportLivestock = async () => {
    setExportingLivestock(true);
    try {
      const response = await axios.get(API.EXPORT_LIVESTOCK, {
        ...getAuthHeaderConfig(),
        params: { filterSettings },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `livestock-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting livestock data:', error);
    } finally {
      setExportingLivestock(false);
      setExportOption('');
    }
  };

  const handleExportChange = (event) => {
    const selectedOption = event.target.value;
    setExportOption(selectedOption);

    if (selectedOption === 'csv') {
      handleExportCSV();
    } else if (selectedOption === 'livestock') {
      handleExportLivestock();
    }
  };

  return (
    <section className="agreement">
      <Banner header={SELECT_RUP_BANNER_HEADER} content={SELECT_RUP_BANNER_CONTENT} />
      <div className={classes.searchFilterContainer}>
        <div style={{ margin: '0 2rem', display: 'flex' }}>
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
            <StyledTooltip title={TOOLTIP_TEXT_MISSING_RUP}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterSettings.missingRUP}
                    onChange={handleFilterChange('missingRUP')}
                    name="missingRUP"
                    color="primary"
                  />
                }
                label="Missing RUP"
              />
            </StyledTooltip>
            {(isUserAdmin(user) || isUserDecisionMaker(user) || isUserAgrologist(user)) && (
              <StyledTooltip title={TOOLTIP_TEXT_DM_ACTIONABLE_ONLY}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filterSettings.dmActionableOnly}
                      onChange={handleFilterChange('dmActionableOnly')}
                      name="dmActionableOnly"
                      color="primary"
                    />
                  }
                  label={DM_ACTIONABLE_ONLY}
                />
              </StyledTooltip>
            )}
          </div>
          <PrimaryButton
            inverted
            onClick={() => {
              setFilterSettings(defaultFilterSettings);
            }}
          >
            Reset Filters
          </PrimaryButton>
          {(isUserAdmin(user) || isUserAgrologist(user) || isUserDecisionMaker(user) || isUserAuditor(user)) && (
            <FormControl>
              {exporting || exportingLivestock ? (
                <CircularProgress size={30} />
              ) : (
                <Select
                  value={exportOption}
                  onChange={handleExportChange}
                  disabled={exporting || exportingLivestock}
                  style={{ minWidth: 150 }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Export Options
                  </MenuItem>
                  <MenuItem value="csv">Export Agreements List</MenuItem>
                  <MenuItem value="livestock">Export Livestock Count</MenuItem>
                </Select>
              )}
            </FormControl>
          )}
        </div>
        {references.ZONES?.length > 0 && isUserAgrologist(user) && (
          <ZoneSelect
            unassignedZones={unassignedZones}
            userZones={userZones}
            users={users}
            zones={references.ZONES || []}
            setZoneInfo={setZoneInfo}
            zoneInfo={filterSettings.zoneInfo}
          />
        )}
        {references.ZONES?.length > 0 && isUserAdmin(user) && (
          <ZoneSelectAll
            users={users}
            zones={references.ZONES || []}
            zoneInfo={filterSettings.zoneInfo}
            setZoneInfo={setZoneInfo}
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
        onUpdate={refreshData}
      />
    </section>
  );
};

export default SelectRangeUsePlanPage;
