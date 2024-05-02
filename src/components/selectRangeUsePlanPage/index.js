import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import * as API from '../../constants/api';
import {
  axios,
  getAuthHeaderConfig,
  isUserAgrologist,
  isUserReadOnly,
  isUserAdmin,
  getDataFromLocalStorage,
  saveDataInLocalStorage
} from '../../utils';
import Error from './Error';
import { makeStyles } from '@material-ui/core/styles';
import ZoneSelect, { ZoneSelectAll } from './ZoneSelect';
import { Banner } from '../common';
import {
  SELECT_RUP_BANNER_HEADER,
  SELECT_RUP_BANNER_CONTENT,
} from '../../constants/strings';
import { useToast } from '../../providers/ToastProvider';
import {
  useQueryParam,
  StringParam,
  encodeObject,
  decodeObject,
  BooleanParam,
} from 'use-query-params';
import { useReferences } from '../../providers/ReferencesProvider';
import { useUser } from '../../providers/UserProvider';

import SortableAgreementTable from './SortableAgreementTable';
import { Checkbox, FormControlLabel } from '@material-ui/core';

const keyValueSeparator = '-'; // default is "-"
const entrySeparator = '~'; // default is "_"
const NewObjectParam = {
  encode: (obj) => encodeObject(obj, keyValueSeparator, entrySeparator),

  decode: (str) => decodeObject(str, keyValueSeparator, entrySeparator),
};

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

const SelectRangeUsePlanPage = ({ match, history }) => {
  const { page = 1 } = match.params;
  const [toastId, setToastId] = useState();
  const [limit = 10, setLimit] = useQueryParam('limit', StringParam);
  const [searchSelectedZones, setSearchSelectedZones] = useState([]);
  const [orderBy = 'agreement.forest_file_id', setOrderBy] = useQueryParam(
    'orderBy',
    StringParam,
  );
  const [order = 'asc', setOrder] = useQueryParam('order', StringParam);
  const [filters = { agreementCheck: 'true' }, setFilters] = useQueryParam(
    'filters',
    NewObjectParam,
  );
  // startup
  useEffect(() => {
    // Make sure filters don't carry over
    setFilters({ agreementCheck: 'true' });

    // Set initial page info from localstorage
    const pageInfo = getDataFromLocalStorage("page-info");
    if (pageInfo && pageInfo.pageNumber) {
      console.log("setting page to: ", pageInfo);
      setPage(pageInfo.pageNumber);
    }
  }, []);
  const [planCheck = false, setPlanCheck] = useQueryParam(
    'planCheck',
    BooleanParam,
  );
  const [agreementCheck = true, setAgreementCheck] = useQueryParam(
    'agreementCheck',
    BooleanParam,
  );
  const [activeCheck = false, setActiveCheck] = useQueryParam(
    'activeCheck',
    BooleanParam,
  );
  useEffect(() => {
    addToFilters('planCheck', planCheck);
  }, [planCheck]);
  useEffect(() => {
    addToFilters('agreementCheck', agreementCheck);
  }, [agreementCheck]);
  useEffect(() => {
    addToFilters('activeCheck', activeCheck);
  }, [activeCheck]);
  const { warningToast, removeToast, errorToast } = useToast();

  const references = useReferences();
  const user = useUser();

  const zones = references.ZONES || [];
  const userZones = zones.filter((zone) => user.id === zone.userId);
  const districtIds = userZones.map((userZone) => {
    return userZone.districtId;
  });
  const unassignedZones = zones.filter(
    (zone) =>
      user.id !== zone.userId && districtIds.indexOf(zone.districtId) != -1,
  );
  const zoneUsers = references.USERS;

  const { data, error, revalidate, isValidating } = useSWR(
    `${API.SEARCH_AGREEMENTS}?page=${page}&selectedZones=${searchSelectedZones}&limit=${limit}&orderBy=${orderBy}&order=${order}&filterString=${JSON.stringify(filters)}`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => res.data),
    {
      onLoadingSlow: () =>
        setToastId(warningToast('Agreements are taking a while to load', -1)),
      onError: () => {
        if (references?.ZONES?.length > 0)
          errorToast('Could not load agreements');
      },
      onSuccess: () => removeToast(toastId),
    },
  );

  const addToFilters = (filterCol, filterVal) => {
    let newFilter = {
      ...filters,
    };
    newFilter[filterCol] = filterVal;
    setFilters(newFilter);
  };

  const setPage = (page) => {
    history.replace(`/home/${page}/${history.location.search}`);
  }

  const setPageAndSave = (page) => {
    history.replace(`/home/${page}/${history.location.search}`);
    const currPageInfo = getDataFromLocalStorage("page-info");
    const pageInfo = {
      ...currPageInfo,
      pageNumber: page
    }
    saveDataInLocalStorage("page-info", pageInfo);
  }

  const { agreements, totalPages, currentPage = page, totalItems } = data || {};
  const classes = useStyles();
  return (
    <section className="agreement">
      <Banner
        header={SELECT_RUP_BANNER_HEADER}
        content={SELECT_RUP_BANNER_CONTENT}
      />
      <div className={classes.searchFilterContainer}>
        <div className={classes.checkboxBorder}>
          <FormControlLabel
            control={
              <Checkbox
                checked={planCheck}
                onChange={() => setPlanCheck(!planCheck)}
                name="planCheck"
                color="primary"
              />
            }
            label="RUP Created"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={agreementCheck}
                onChange={() => setAgreementCheck(!agreementCheck)}
                name="agreementCheck"
                color="primary"
              />
            }
            label="Range Agreement"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={activeCheck}
                onChange={() => setActiveCheck(!activeCheck)}
                name="activeCheck"
                color="primary"
              />
            }
            label="Active RUP"
          />
        </div>
        {isUserAgrologist(user) && (
          <ZoneSelect
            zones={zones}
            userZones={userZones}
            unassignedZones={unassignedZones}
            zoneUsers={zoneUsers}
            setSearchSelectedZones={setSearchSelectedZones}
          />
        )}
        {(isUserAdmin(user) || isUserReadOnly(user)) && (
          <ZoneSelectAll
            zones={zones}
            zoneUsers={zoneUsers}
            setSearchSelectedZones={setSearchSelectedZones}
          />
        )}
      </div>

      {error ? (
        <Error onRetry={revalidate} />
      ) : (
        <>
          <SortableAgreementTable
            agreements={agreements}
            currentPage={currentPage - 1}
            totalPages={totalPages}
            totalAgreements={totalItems}
            perPage={limit}
            onPageChange={(page) => setPageAndSave(page + 1)}
            onLimitChange={setLimit}
            loading={isValidating}
            onOrderChange={(orderBy, order) => {
              setOrder(order);
              setOrderBy(orderBy);
            }}
            onFilterChange={(filterCol, filterVal) => {
              addToFilters(filterCol, filterVal);
              setPage(1);
            }}
            orderBy={orderBy}
            order={order}
            filters={filters}
            onStatusCodeChange={(filterCol, filterVal) => {
              addToFilters(filterCol, filterVal);
              setPage(1);
            }}
          />
        </>
      )}
    </section>
  );
};

export default SelectRangeUsePlanPage;
