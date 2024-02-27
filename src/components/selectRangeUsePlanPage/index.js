import React, { useState } from 'react'
import useSWR from 'swr'
import * as API from '../../constants/api'
import { axios, getAuthHeaderConfig, isUserRangeOfficer } from '../../utils'
import Error from './Error'
import { makeStyles } from '@material-ui/core/styles'
import ZoneSelect from './ZoneSelect'
import SearchBar from './SearchBar'
import { Banner } from '../common'
import {
  SELECT_RUP_BANNER_HEADER,
  SELECT_RUP_BANNER_CONTENT,
  AGREEMENT_SEARCH_PLACEHOLDER
} from '../../constants/strings'
import { useToast } from '../../providers/ToastProvider'
import { useQueryParam, StringParam } from 'use-query-params'
import { useReferences } from '../../providers/ReferencesProvider'
import { useUser } from '../../providers/UserProvider'

import SortableAgreementTable from './SortableAgreementTable'

const useStyles = makeStyles(theme => ({
  searchFilterContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '15px'
  }
}))

const SelectRangeUsePlanPage = ({ match, history }) => {
  const { page = 1 } = match.params
  const [term = '', setTerm] = useQueryParam('term', StringParam)
  const [toastId, setToastId] = useState()
  const [limit = 10, setLimit] = useQueryParam('limit', StringParam)
  const [searchSelectedZones, setSearchSelectedZones] = useState([])
  const [orderBy = 'agreement.forest_file_id', setOrderBy] = useQueryParam(
    'orderBy',
    StringParam
  )
  const [order = 'asc', setOrder] = useQueryParam('order', StringParam)
  const { warningToast, removeToast, errorToast } = useToast()

  const references = useReferences()
  const user = useUser()

  const zones = references.ZONES || []
  const userZones = zones.filter(zone => user.id === zone.userId)
  const districtId = userZones[0]?.districtId
  const unassignedZones = zones.filter(
    zone => user.id !== zone.userId && zone.districtId === districtId
  )
  const zoneUsers = references.USERS

  const { data, error, revalidate, isValidating } = useSWR(
    `${API.SEARCH_AGREEMENTS}?page=${page}&term=${term}&selectedZones=${searchSelectedZones}&limit=${limit}&orderBy=${orderBy}&order=${order}`,
    key => axios.get(key, getAuthHeaderConfig()).then(res => res.data),
    {
      onLoadingSlow: () =>
        setToastId(warningToast('Agreements are taking a while to load', -1)),
      onError: () => errorToast('Could not load agreements'),
      onSuccess: () => removeToast(toastId)
    }
  )

  const setPage = page =>
    history.replace(`/home/${page}/${history.location.search}`)

  const { agreements, totalPages, currentPage = page, totalItems } = data || {}
  const classes = useStyles()
  return (
    <section className="agreement">
      <Banner
        header={SELECT_RUP_BANNER_HEADER}
        content={SELECT_RUP_BANNER_CONTENT}
      />
      <div className="agrm__table-container">
        <div className={classes.searchFilterContainer}>
          <SearchBar
            className={classes.searchBar}
            onSearch={value => {
              setPage(1)
              setTerm(value)
            }}
            loading={isValidating}
            placeholder={AGREEMENT_SEARCH_PLACEHOLDER}
            initialValue={term}
          />
          {isUserRangeOfficer(user) && (
            <ZoneSelect
              zones={zones}
              userZones={userZones}
              unassignedZones={unassignedZones}
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
              onPageChange={page => setPage(page + 1)}
              onLimitChange={setLimit}
              loading={isValidating}
              onOrderChange={(orderBy, order) => {
                setOrder(order)
                setOrderBy(orderBy)
              }}
              orderBy={orderBy}
              order={order}
            />
          </>
        )}
      </div>
    </section>
  )
}

export default SelectRangeUsePlanPage
