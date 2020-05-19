import React, { useState, useRef } from 'react'
import useSWR from 'swr'
import * as API from '../../../constants/api'
import { axios, getAuthHeaderConfig } from '../../../utils'
import VersionsDropDownList from './VersionsDropDownList'

const sortVersions = (a, b) => {
  if (b.version === -1) return 1
  if (b.version > a.version) return 1
  if (b.version < a.version) return -1
  return 0
}

const VersionsDropdown = ({ match, open }) => {
  const { planId } = match.params
  const [selectedVersion, setSelectedVersion] = useState(null)
  const endpoint = API.GET_RUP_VERSIONS(planId)

  const { data, error, isValidating } = useSWR(endpoint, key =>
    axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )

  const { versions = [] } = data || {}
  const formattedVersions = versions
    .sort(sortVersions)
    .filter(v => v.version !== -1)
    .filter(v => v.effectiveLegalStart !== null)

  if (error) return <div>Error: {JSON.stringify(error.message)}</div>
  return (
    <VersionsDropDownList
      planId={planId}
      versions={formattedVersions}
      selectedVersion={selectedVersion}
      open={open}
      onSelectVersion={(e, { value }) => setSelectedVersion(value)}
    />
  )
}

export default VersionsDropdown
