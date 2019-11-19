import React, { useState } from 'react'
import useSWR from 'swr'
import * as API from '../../constants/api'
import { axios, getAuthHeaderConfig } from '../../utils'
import Error from './Error'
import AgreementTable from './AgreementTable'
import SearchBar from './SearchBar'
import { Banner } from '../common'
import {
  SELECT_RUP_BANNER_HEADER,
  SELECT_RUP_BANNER_CONTENT,
  AGREEMENT_SEARCH_PLACEHOLDER
} from '../../constants/strings'
import { useToast } from '../../providers/ToastProvider'
import { useUrlState } from '../../utils/hooks/urlState'

const SelectRangeUsePlanPage = () => {
  const [term, setTerm] = useUrlState('term', '')
  const [page, setPage] = useUrlState('page', 1)
  const [toastId, setToastId] = useState()
  const { warningToast, removeToast, errorToast } = useToast()

  const { data, error, revalidate, isValidating } = useSWR(
    `${API.SEARCH_AGREEMENTS}?page=${page}&term=${term}&limit=10`,
    key => axios.get(key, getAuthHeaderConfig()).then(res => res.data),
    {
      onLoadingSlow: () =>
        setToastId(warningToast('Agreements are taking a while to load', -1)),
      onError: () => errorToast('Could not load agreements'),
      onSuccess: () => removeToast(toastId)
    }
  )

  const { agreements, totalPages, currentPage } = data || {}

  if (error) return <Error onRetry={revalidate} />
  return (
    <section className="agreement">
      <Banner
        header={SELECT_RUP_BANNER_HEADER}
        content={SELECT_RUP_BANNER_CONTENT}
      />
      <div className="agrm__table-container">
        <SearchBar
          onSearch={value => {
            setPage(1)
            setTerm(value)
          }}
          loading={isValidating}
          placeholder={AGREEMENT_SEARCH_PLACEHOLDER}
          initialValue={term}
        />
        <AgreementTable
          agreements={agreements}
          loading={isValidating}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(e, { activePage }) => setPage(activePage)}
        />
      </div>
    </section>
  )
}

export default SelectRangeUsePlanPage
