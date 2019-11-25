import React, { useState, useRef } from 'react'
import useSWR from 'swr'
import {
  Grid,
  Segment,
  List,
  Sticky,
  Ref,
  Rail,
  Header,
  Label,
  Container
} from 'semantic-ui-react'
import * as API from '../../../constants/api'
import { axios, getAuthHeaderConfig } from '../../../utils'
import moment from 'moment'
import Version from './Version'
import EditableProvider from '../../../providers/EditableProvider'
import NoVersions from './NoVersions'

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

  const { data, error, loading } = useSWR(endpoint, key =>
    axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )

  const contextRef = useRef()

  const { versions = [] } = data || {}
  const formattedVersions = versions
    .sort(sortVersions)
    .filter(v => v.version !== -1)

  if (error) return <div>Error: {JSON.stringify(error.message)}</div>
  return (
    <EditableProvider editable={false}>
      {formattedVersions.length === 0 ? (
        <NoVersions planId={planId} />
      ) : (
        <Grid columns="equal" padded>
          <Grid.Column width="12">
            <Ref innerRef={contextRef}>
              <Segment padded placeholder={!selectedVersion}>
                {selectedVersion ? (
                  <Version {...selectedVersion} planId={planId} />
                ) : (
                  <Container>Please select a version on the right</Container>
                )}
                <Rail position="right">
                  <Sticky context={contextRef}>
                    <Segment loading={loading || !data}>
                      <Header attached="top">Versions</Header>
                      <List selection animated>
                        {formattedVersions.map(version => (
                          <List.Item
                            active={
                              selectedVersion &&
                              version.version === selectedVersion.version
                            }
                            key={version.planId}
                            onClick={() => setSelectedVersion(version)}>
                            <Label>
                              {version.version === -1
                                ? 'Current'
                                : `v${version.version}`}
                            </Label>
                            <List.Content
                              floated="right"
                              verticalAlign="middle">
                              {moment(version.updatedAt).format(
                                'MMMM Do, YYYY, h:mm a '
                              )}
                            </List.Content>
                          </List.Item>
                        ))}
                      </List>
                    </Segment>
                  </Sticky>
                </Rail>
              </Segment>
            </Ref>
          </Grid.Column>
        </Grid>
      )}
    </EditableProvider>
  )
}

export default VersionsList
