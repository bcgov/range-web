import React, { useState, useRef } from 'react'
import useSWR from 'swr'
import { Segment, Sticky, Ref, Container } from 'semantic-ui-react'
import * as API from '../../../constants/api'
import { axios, getAuthHeaderConfig } from '../../../utils'
import Version from './Version'
import NoVersions from './NoVersions'
import VersionsToolbar from './VersionsToolbar'

const sortVersions = (a, b) => {
  if (b.version === -1) return 1
  if (b.version > a.version) return 1
  if (b.version < a.version) return -1
  return 0
}

const VersionsList = ({ match }) => {
  const { planId } = match.params
  const [selectedVersion, setSelectedVersion] = useState(null)
  const endpoint = API.GET_RUP_VERSIONS(planId)

  const { data, error, isValidating } = useSWR(endpoint, key =>
    axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )

  const contextRef = useRef()

  const { versions = [] } = data || {}
  const formattedVersions = versions
    .sort(sortVersions)
    .filter(v => v.version !== -1)
    .filter(v => v.effectiveLegalStart !== null)

  if (error) return <div>Error: {JSON.stringify(error.message)}</div>
  return (
    <>
      {!isValidating && formattedVersions.length === 0 ? (
        <NoVersions planId={planId} />
      ) : (
        <Container>
          <Sticky context={contextRef}>
            <VersionsToolbar
              planId={planId}
              versions={formattedVersions}
              selectedVersion={selectedVersion}
              onSelectVersion={(e, { value }) => setSelectedVersion(value)}
            />
          </Sticky>

          <Ref innerRef={contextRef}>
            <Segment padded placeholder={!selectedVersion} attached="bottom">
              {selectedVersion ? (
                <Version {...selectedVersion} planId={planId} />
              ) : (
                <Container>Please select a version</Container>
              )}
            </Segment>
          </Ref>
        </Container>
      )}
    </>
  )
}

export default VersionsList
