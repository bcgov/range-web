import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import moment from 'moment'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import * as API from '../../../constants/api'
import { useUser } from '../../../providers/UserProvider'
import { axios, getAuthHeaderConfig } from '../../../utils'
import { PrimaryButton } from '../../common/'
import { attachmentAccess } from '../attachments/AttachmentRow'

const AttachmentsList = ({ attachments }) => {

  const onDownloadClicked = async (attachment) => {
    try {
      const res = await axios.get(
        API.GET_SIGNED_DOWNLOAD_URL(attachment.id),
        getAuthHeaderConfig()
      )
      const fileRes = await axios.get(res.data.url, {
        responseType: 'blob',
        skipAuthorizationHeader: true
      })

      const url = window.URL.createObjectURL(fileRes.data)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', attachment.name)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (e) {
      console.log(`Error downloading file ${e.toString()}`);
    }
  }

  return (
    <Table size="small" aria-label="dates">
      <TableHead>
        <TableRow>
          <TableCell style={{ color: 'grey' }}>Name</TableCell>
          <TableCell style={{ color: 'grey' }}>Upload Date</TableCell>
          <TableCell style={{ color: 'grey' }}>Uploaded By</TableCell>
          <TableCell style={{ color: 'grey', align: 'left' }}>
            Viewable By
          </TableCell>
          <TableCell style={{ color: 'grey' }}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attachments.map((option) => (
          <TableRow key={option.id} hover={true}>
            <TableCell>{option.name}</TableCell>
            <TableCell>{moment(option.uploadDate).format('MMM DD YYYY h:mm a')}</TableCell>
            <TableCell>{option.user.givenName} {option.user.familyName}</TableCell>
            <TableCell>{attachmentAccess.find(o => o.value === option.access)?.text}</TableCell>
            <TableCell>
              <PrimaryButton
                ui icon button inverted
                onClick={() => {
                  onDownloadClicked(option);
                }}
              >
                <i className='download icon' />
              </PrimaryButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default AttachmentsList
