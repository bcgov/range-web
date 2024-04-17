import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import * as API from '../../constants/api';
import {
  axios,
  getAuthHeaderConfig,
  isUserAgrologist,
  isUserReadOnly,
  isUserAdmin,
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
} from 'use-query-params';
import { useReferences } from '../../providers/ReferencesProvider';
import { useUser } from '../../providers/UserProvider';

import SortableAgreementTable from './SortableAgreementTable';

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
  },
  checkboxBorder: {
    border: "1px solid black",
    padding: "4px",
  }
}));

const SelectRangeUsePlanPage = ({ match, history }) => {
  const { page = 1 } = match.params;
  const term = '';
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
  useEffect(() => {
    // Make sure filters don't carry over 
    setFilters({'agreementCheck': 'true'});
  }, []);
  const [planCheck, setPlanCheck] = useState(false);
  const [agreementCheck, setAgreementCheck] = useState(true);
  const [activeCheck, setActiveCheck] = useState(false);
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
    `${API.SEARCH_AGREEMENTS}?page=${page}&term=${term}&selectedZones=${searchSelectedZones}&limit=${limit}&orderBy=${orderBy}&order=${order}&filterString=${JSON.stringify(filters)}`,
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
      ...filters
    }
    newFilter[filterCol] = filterVal;
    setPage(1);
    setFilters(newFilter);
  }

  const setPage = (page) =>
    history.replace(`/home/${page}/${history.location.search}`);

  const { agreements, totalPages, currentPage = page, totalItems } = data || {};
  const classes = useStyles();
  return (
    <section className="agreement">
      <Banner
        header={SELECT_RUP_BANNER_HEADER}
        content={SELECT_RUP_BANNER_CONTENT}
      />
      <div className="agrm__table-container">
        <div className={classes.searchFilterContainer}>
          <div className={classes.checkboxBorder}>
            <input type="checkbox" name="planCheck" onChange={() => setPlanCheck(!planCheck)} checked={planCheck}/>
            <label htmlFor="planCheck"> RUP Created</label>
            <br/>
            <input type="checkbox" name="agreementCheck" onChange={() => setAgreementCheck(!agreementCheck)} checked={agreementCheck}/>
            <label htmlFor="agreementCheck"> Range Agreement</label>
            <br/>
            <input type="checkbox" name="activeCheck" onChange={() => setActiveCheck(!activeCheck)} checked={activeCheck}/>
            <label htmlFor="activeCheck"> Active RUP</label>
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
              onPageChange={(page) => setPage(page + 1)}
              onLimitChange={setLimit}
              loading={isValidating}
              onOrderChange={(orderBy, order) => {
                setOrder(order);
                setOrderBy(orderBy);
              }}
              onFilterChange={(filterCol, filterVal) => {
                addToFilters(filterCol, filterVal);
              }}
              orderBy={orderBy}
              order={order}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default SelectRangeUsePlanPage;
