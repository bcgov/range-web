import React from 'react'
import useSWR from 'swr'
import * as API from '../../../constants/api'
import { axios, getAuthHeaderConfig } from '../../../utils'
import PlanForm from '../PlanForm'
import { Form } from 'formik-semantic-ui-react'
import { Placeholder } from 'semantic-ui-react'

const Version = ({ planId, version }) => {
  const endpoint = API.GET_RUP_VERSION(planId, version)

  const { data, isValidating, error } = useSWR(endpoint, key =>
    axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )
  if (error) return <span>Error: {error.message}</span>
  if (isValidating || !data)
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
      <Form
        initialValues={data}
        render={({ values }) => <PlanForm plan={values} isEditable={false} />}
      />
    </>
  )
}

export default Version
