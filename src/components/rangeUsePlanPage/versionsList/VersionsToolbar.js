import React from 'react'
import { Menu, Icon, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { RANGE_USE_PLAN } from '../../../constants/routes'
import { PrimaryButton } from '../../common'
import VersionToolbar from './VersionToolbar'

const VersionsToolbar = ({
  versions,
  selectedVersion,
  onSelectVersion,
  planId
}) => {
  const versionOptions = versions.map(v => ({
    key: v.version,
    value: v,
    text: `v${v.version}`
  }))

  return (
    <>
      <Menu attached="top">
        <Menu.Item>
          <PrimaryButton as={Link} to={`${RANGE_USE_PLAN}/${planId}`}>
            <Icon name="arrow left" />
            Back to RUP
          </PrimaryButton>
        </Menu.Item>

        <Dropdown
          item
          options={versionOptions}
          value={selectedVersion}
          placeholder="Select a version"
          onChange={onSelectVersion}
        />

        {selectedVersion && (
          <VersionToolbar planId={planId} version={selectedVersion.version} />
        )}
      </Menu>
    </>
  )
}

export default VersionsToolbar
