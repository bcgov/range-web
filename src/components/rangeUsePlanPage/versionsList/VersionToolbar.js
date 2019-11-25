import React from 'react'
import { Menu } from 'semantic-ui-react'
import { getAuthHeaderConfig, axios } from '../../../utils'
import * as API from '../../../constants/api'
import useSWR from 'swr'
import moment from 'moment'
import { Status } from '../../common'
import { useUser } from '../../../providers/UserProvider'

const VersionToolbar = ({ planId, version }) => {
  const user = useUser()

  const { data } = useSWR(API.GET_RUP_VERSION(planId, version), key =>
    axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )

  if (data) {
    return (
      <>
        <Menu.Item header>{data.agreementId}</Menu.Item>
        <Menu.Item>
          {moment(data.updatedAt).format('MMMM Do, YYYY, h:mm a ')}
        </Menu.Item>
        <Menu.Item>
          <Status status={data.status} user={user} />
        </Menu.Item>
      </>
    )
  }

  return null
}

export default VersionToolbar
