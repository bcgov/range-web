import React, { useState } from 'react'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import classnames from 'classnames'
import Status from '../../common/Status'

const VersionsDropdownList = ({ versions, open }) => {
  const versionOptions = versions.map(v => ({
    key: v.version,
    value: v,
    text: `v${v.version}`,
    version: v
  }))

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box margin={0} style={{ marginBottom: '10px' }}>
            <Typography variant="h6" gutterBottom component="div">
              Versions
            </Typography>
            <Table size="small" aria-label="dates">
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: 'grey' }}>Legal Start</TableCell>
                  <TableCell style={{ color: 'grey' }}>Legal End</TableCell>
                  <TableCell style={{ color: 'grey', align: 'left' }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {versionOptions.map((option, index) => (
                  <TableRow key={index} hover={true}>
                    <TableCell component="th" scope="row">
                      {moment(option.version.effectiveLegalStart).format(
                        'MMM DD YYYY h:mm a'
                      )}
                    </TableCell>
                    <TableCell>
                      {option.version.effectiveLegalEnd == null
                        ? 'Present'
                        : moment(option.version.effectiveLegalEnd).format(
                            'MMM DD YYYY h:mm a'
                          )}
                    </TableCell>
                    <TableCell>
                      <Status
                        status={option.version.status}
                        className={classnames({
                          greyed: option.version.effectiveLegalEnd !== null
                        })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  )
}

export default VersionsDropdownList
