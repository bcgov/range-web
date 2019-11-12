import React from 'react'
import useSWR from 'swr'
import * as API from '../../../constants/api'
import { axios, getAuthHeaderConfig } from '../../../utils'
import PlanForm from '../PlanForm'
import { Form } from 'formik-semantic-ui'
import { Header, Divider, Placeholder } from 'semantic-ui-react'
import moment from 'moment'

const Version = ({ planId, version, updatedAt }) => {
  const endpoint = API.GET_RUP_VERSION(planId, version)

  const { data, loading, error } = useSWR(endpoint, key =>
    axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )
  if (error) return <span>Error: {error.message}</span>
  if (loading || !data)
    return (
      <Placeholder>
        {Array.from({ length: 10 }).map((_, i) => (
          <Placeholder.Paragraph key={i}>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        ))}
      </Placeholder>
    )
  return (
    <>
      <Header>
        <Header.Content>
          {data.agreement.id}, Version {version}
        </Header.Content>
        <Header.Subheader>
          {moment(updatedAt).format('MMMM Do, YYYY, h:mm a ')}
        </Header.Subheader>
      </Header>
      <Divider />
      <Form
        initialValues={data}
        render={({ values }) => <PlanForm plan={values} />}
      />
    </>
  )
}

export default Version
