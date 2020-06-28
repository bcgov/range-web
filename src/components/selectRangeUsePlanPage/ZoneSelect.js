import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import ListItemText from '@material-ui/core/ListItemText'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 250,
    maxWidth: 400,
    marginTop: -3,
    marginRight: 0,
    marginLeft: 20
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  listItemTextPrimary: {
    fontSize: '12px',
    fontColor: '#002C71'
  },
  listItemTextSecondary: {
    fontSize: '16px',
    color: 'grey'
  }
}))

const checkBoxStyles = theme => ({
  root: {
    '&$checked': {
      color: 'rgb(0, 30, 79)'
    },
    marginTop: '12.6px'
  },
  checked: {}
})

const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox)

const ITEM_HEIGHT = 78
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      color: 'grey'
    }
  }
}

export default function ZoneSelect({
  zones,
  userZones,
  zoneUsers,
  unassignedZones,
  setSearchSelectedZones
}) {
  const classes = useStyles()
  const theme = useTheme()
  const [selectedZones, setSelectedZones] = useState([])
  const [zoneMap, setZoneMap] = useState()

  useEffect(() => {
    if (userZones) {
      const initialSelectedZones = userZones.map(zone => zone.id)
      setSelectedZones(initialSelectedZones)
    }
  }, [])

  useEffect(() => {
    if (zones) {
      const zoneMap = zones.reduce(
        (acc, zone) => ({ ...acc, [zone.id]: zone }),
        {}
      )
      setZoneMap(zoneMap)
    }
  }, [zones])

  const handleChange = event => {
    if (event.target.value !== undefined && event.target.value.length !== 0) {
      setSelectedZones(event.target.value)
    }
  }

  const handleClose = () => {
    setSearchSelectedZones(selectedZones)
  }

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Select Zones</InputLabel>
      <Select
        onClick={handleChange}
        onClose={handleClose}
        value={selectedZones}
        multiple
        renderValue={zoneIds =>
          zoneIds.map(id => zoneMap[id].description).join(',  ')
        }
        MenuProps={{
          getContentAnchorEl: () => null,
          ...MenuProps
        }}>
        <MenuItem value="" disabled>
          <span style={{ color: 'black', opacity: 2.0 }}>Assigned Zones</span>
        </MenuItem>

        {zoneUsers &&
          userZones &&
          userZones.map(zone => {
            const user = zoneUsers.find(user => user.id === zone.userId)

            return (
              <MenuItem
                alignItems="flex-start"
                style={{ backgroundColor: 'transparent' }}
                key={zone.id}
                value={zone.id}>
                <CustomCheckbox checked={selectedZones.indexOf(zone.id) > -1} />
                <ListItemText
                  classes={{
                    primary: classes.listItemTextPrimary,
                    secondary: classes.listItemTextSecondary
                  }}
                  primary={
                    <span style={{ color: '#002C71' }}>
                      {user.givenName} {user.familyName}
                    </span>
                  }
                  secondary={<span>{zone.description}</span>}
                />
              </MenuItem>
            )
          })}

        <MenuItem disabled value="">
          <span style={{ color: 'black', opacity: 2.0 }}>Unassigned Zones</span>
        </MenuItem>

        {zoneUsers &&
          unassignedZones &&
          unassignedZones.map(zone => {
            const user = zoneUsers.find(user => user.id === zone.userId)

            return (
              <MenuItem
                alignItems="flex-start"
                key={zone.id}
                value={zone.id}
                style={{ backgroundColor: 'transparent' }}>
                <CustomCheckbox
                  //onChange={handleChange}
                  checked={selectedZones.indexOf(zone.id) > -1}
                />
                <ListItemText
                  classes={{
                    primary: classes.listItemTextPrimary,
                    secondary: classes.listItemTextSecondary
                  }}
                  primary={
                    <span style={{ color: '#002C71' }}>
                      {user.givenName} {user.familyName}
                    </span>
                  }
                  secondary={<span>{zone.description}</span>}
                />
              </MenuItem>
            )
          })}
      </Select>
    </FormControl>
  )
}
