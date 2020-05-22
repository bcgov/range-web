import React, { useState } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import {
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import moment from 'moment'
import classnames from 'classnames'
import { RANGE_USE_PLAN } from '../../../constants/routes'
import { PrimaryButton } from '../../common'
import VersionToolbar from './VersionToolbar'
import Status from '../../common/Status'
import { useUser } from '../../../providers/UserProvider'

const VersionsToolbar = ({
  versions,
  selectedVersion,
  onSelectVersion,
  planId
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const user = useUser()

  const handleClose = () => setAnchorEl(null)
  const handleOpen = event => setAnchorEl(event.currentTarget)

  const versionOptions = versions.map(v => ({
    key: v.version,
    value: v,
    text: `v${v.version}`,
    version: v
  }))

  const StyledMenuItem = withStyles(() => ({
    root: {
      width: 550,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    }
  }))(MuiMenuItem)

  return (
    <>
      <Menu attached="top">
        <Menu.Item>
          <PrimaryButton as={Link} to={`${RANGE_USE_PLAN}/${planId}`}>
            <Icon name="arrow left" />
            Back to RUP
          </PrimaryButton>
        </Menu.Item>

        <Menu.Item onClick={handleOpen}>
          {selectedVersion ? `v${selectedVersion.version}` : 'Select a version'}{' '}
          <Icon name="caret down" />
        </Menu.Item>
        <MuiMenu
          placeholder="Select a version"
          onClose={handleClose}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}>
          {versionOptions.map((option, index) => (
            <StyledMenuItem
              key={option.key}
              selected={selectedVersion === option.value}
              onClick={e => {
                onSelectVersion(e, { value: option.value })
                handleClose()
              }}>
              <ListItemAvatar>
                <Avatar
                  style={{
                    background:
                      option.version.isCurrentLegalVersion === true
                        ? 'green'
                        : null
                  }}>
                  {versionOptions.length - index}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<div style={{ color: 'grey' }}>Reason</div>}
                secondary={
                  <div style={{ color: 'black', height: 20 }}>
                    {option.version.legalReason}
                  </div>
                }
              />
              <ListItemText
                primary={<div style={{ color: 'grey' }}>Legal Start</div>}
                secondary={
                  <div style={{ color: 'black' }}>
                    {moment(option.version.effectiveLegalStart).format(
                      'MMM DD YYYY'
                    )}
                  </div>
                }
              />
              <ListItemText
                primary={<div style={{ color: 'grey' }}>Legal End</div>}
                secondary={
                  <div style={{ color: 'black' }}>
                    {moment(option.version.effectiveLegalEnd).format(
                      'MMM DD YYYY'
                    )}
                  </div>
                }
              />
              <Status
                status={option.version.status}
                user={user}
                isForVersionsList={true}
                className={classnames('versions_status_icon', {
                  greyed: option.version.isCurrentLegalVersion === false
                })}
                style={{ marginRight: 25 }}
              />
            </StyledMenuItem>
          ))}
        </MuiMenu>

        {selectedVersion && (
          <VersionToolbar planId={planId} version={selectedVersion.version} />
        )}
      </Menu>
    </>
  )
}

export default VersionsToolbar
