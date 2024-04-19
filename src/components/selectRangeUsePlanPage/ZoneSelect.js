import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { getUserFullName, axios, getAuthHeaderConfig } from '../../utils';
import * as API from '../../constants/api';
import { useQueryParam, DelimitedNumericArrayParam } from 'use-query-params';
import { FormControlLabel } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 250,
    maxWidth: 400,
    marginTop: -3,
    marginRight: 0,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  listItemTextPrimary: {
    fontSize: '12px',
    fontColor: '#002C71',
  },
  listItemTextSecondary: {
    fontSize: '16px',
    color: 'grey',
  },
}));

const checkBoxStyles = () => ({
  root: {
    '&$checked': {
      color: 'rgb(0, 30, 79)',
    },
    marginTop: '12.6px',
  },
  checked: {},
});

const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);

const ITEM_HEIGHT = 78;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      color: 'grey',
    },
  },
};

export function ZoneSelectAll({ zones, setSearchSelectedZones }) {
  const classes = useStyles();
  const [selectedZones = [], setSelectedZones] = useQueryParam(
    'selectedZones',
    DelimitedNumericArrayParam,
  );
  const [zoneMap, setZoneMap] = useState();
  const [selectAllZones, setSelectAllZones] = useState(true);
  const [deselectAllZones, setDeselectAllZones] = useState(false);

  const {
    data: users,
    error,
    isValidating,
  } = useSWR(
    `${API.GET_USERS}/?orderCId=desc&excludeBy=username&exclude=bceid`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => res.data),
  );

  const setAllZonesSelected = () => {
    const initialSelectedZones = zones.map((zone) => zone.id);
    setSelectedZones(initialSelectedZones);
    setSearchSelectedZones(initialSelectedZones);
  };

  useEffect(() => {
    if (selectedZones.length === 0) {
      setAllZonesSelected();
    } else {
      if (!selectedZones.length) {
        setAllZonesSelected();
      } else {
        setSelectedZones(selectedZones);
        setSearchSelectedZones(selectedZones);
      }
    }
  }, []);

  useEffect(() => {
    if (zones) {
      const zoneMap = zones.reduce(
        (acc, zone) => ({ ...acc, [zone.id]: zone }),
        {},
      );
      setZoneMap(zoneMap);
      setAllZonesSelected();
    }
  }, [zones]);

  const handleChange = (event) => {
    if (event.target.value !== undefined) {
      setSelectedZones(event.target.value);
    }
  };

  const handleClose = () => {
    setSearchSelectedZones(selectedZones);
    if (zones?.length === selectedZones?.length) {
      setSelectAllZones(true);
    } else {
      setSelectAllZones(false);
    }
    if (selectedZones?.length > 0) {
      setDeselectAllZones(false);
    }
  };

  if ((isValidating && !users) || !zoneMap) {
    return <span>Loading zones</span>;
  }

  if (error) {
    return <span>Error fetching users</span>;
  }

  return (
    <div className={classes.formControl}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectAllZones}
            onChange={(event) => {
              setSelectAllZones(event.target.checked);
              if (event.target.checked) {
                setAllZonesSelected();
                setDeselectAllZones(!event.target.checked);
              }
            }}
            name="selectAllZones"
            color="primary"
          />
        }
        label="Select All Zones"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={deselectAllZones}
            onChange={(event) => {
              setDeselectAllZones(event.target.checked);
              if (event.target.checked) {
                setSearchSelectedZones([]);
                setSelectedZones([]);
                setSelectAllZones(!event.target.checked);
              }
            }}
            name="deselectAllZones"
            color="primary"
          />
        }
        label="Deselect All Zones"
      />
      <FormControl className={classes.formControl}>
        <InputLabel>Select Individual Zones</InputLabel>
        <Select
          onClick={handleChange}
          onClose={handleClose}
          value={selectedZones}
          multiple
          renderValue={(zoneIds) =>
            zoneIds.map((id) => zoneMap[id].description).join(',  ')
          }
          MenuProps={{
            getContentAnchorEl: () => null,
            ...MenuProps,
          }}
        >
          <MenuItem value="" disabled>
            <span style={{ color: 'black', opacity: 2.0 }}>All Zones</span>
          </MenuItem>

          {users &&
            zones &&
            zones.map((zone) => {
              const user = users.find((user) => user.id === zone.userId);

              return (
                <MenuItem
                  alignItems="flex-start"
                  key={zone.id}
                  value={zone.id}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <CustomCheckbox
                    checked={selectedZones.indexOf(zone.id) > -1}
                  />
                  <ListItemText
                    classes={{
                      primary: classes.listItemTextPrimary,
                      secondary: classes.listItemTextSecondary,
                    }}
                    primary={
                      <span style={{ color: '#002C71' }}>
                        {getUserFullName(user)}
                      </span>
                    }
                    secondary={<span>{zone.description}</span>}
                  />
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
}

export default function ZoneSelect({
  zones,
  userZones,
  unassignedZones,
  setSearchSelectedZones,
}) {
  const classes = useStyles();
  const [selectedZones = [], setSelectedZones] = useQueryParam(
    'selectedZones',
    DelimitedNumericArrayParam,
  );
  const [zoneMap, setZoneMap] = useState();
  const [selectAllZones, setSelectAllZones] = useState(true);
  const [deselectAllZones, setDeselectAllZones] = useState(false);

  const {
    data: users,
    error,
    isValidating,
  } = useSWR(
    `${API.GET_USERS}/?orderCId=desc&excludeBy=username&exclude=bceid`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => res.data),
  );

  useEffect(() => {
    if (userZones && userZones.length > 0) {
      if (selectedZones.length === 0) {
        setAllZonesSelected();
      } else {
        const filteredSelectedZones = selectedZones.filter((zoneID) => {
          return (
            userZones.some((userZone) => userZone.id === zoneID) ||
            unassignedZones.some(
              (unassignedZone) => unassignedZone.id === zoneID,
            )
          );
        });

        if (!filteredSelectedZones.length) {
          setAllZonesSelected();
        } else {
          setSelectedZones(filteredSelectedZones);
          setSearchSelectedZones(filteredSelectedZones);
        }
      }
    } else {
      setSearchSelectedZones(selectedZones);
    }
  }, []);

  useEffect(() => {
    if (zones) {
      const zoneMap = zones.reduce(
        (acc, zone) => ({ ...acc, [zone.id]: zone }),
        {},
      );
      setZoneMap(zoneMap);
      setAllZonesSelected();
    }
  }, [zones]);

  const handleChange = (event) => {
    if (event.target.value !== undefined) {
      setSelectedZones(event.target.value);
    }
  };

  const handleClose = () => {
    setSearchSelectedZones(selectedZones);
    if (zones?.length === selectedZones?.length) {
      setSelectAllZones(true);
    } else {
      setSelectAllZones(false);
    }
    if (selectedZones?.length > 0) {
      setDeselectAllZones(false);
    }
  };

  const setAllZonesSelected = () => {
    const initialSelectedZones = zones.map((zone) => zone.id);
    setSelectedZones(initialSelectedZones);
    setSearchSelectedZones(initialSelectedZones);
  };

  if ((isValidating && !users) || !zoneMap) {
    return <span>Loading zones</span>;
  }

  if (error) {
    return <span>Error fetching users</span>;
  }

  return (
    <div className={classes.formControl}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectAllZones}
            onChange={(event) => {
              setSelectAllZones(event.target.checked);
              if (event.target.checked) {
                setAllZonesSelected();
                setDeselectAllZones(!event.target.checked);
              }
            }}
            name="selectAllZones"
            color="primary"
          />
        }
        label="Select All Zones"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={deselectAllZones}
            onChange={(event) => {
              setDeselectAllZones(event.target.checked);
              if (event.target.checked) {
                setSearchSelectedZones([]);
                setSelectedZones([]);
                setSelectAllZones(!event.target.checked);
              }
            }}
            name="deselectAllZones"
            color="primary"
          />
        }
        label="Deselect All Zones"
      />
      <FormControl className={classes.formControl}>
        <InputLabel>Select Individual Zones</InputLabel>
        <Select
          onClick={handleChange}
          onClose={handleClose}
          value={selectedZones}
          multiple
          renderValue={(zoneIds) =>
            zoneIds.map((id) => zoneMap[id].description).join(',  ')
          }
          MenuProps={{
            getContentAnchorEl: () => null,
            ...MenuProps,
          }}
        >
          <MenuItem value="" disabled>
            <span style={{ color: 'black', opacity: 2.0 }}>Assigned Zones</span>
          </MenuItem>

          {users &&
            userZones &&
            userZones.map((zone) => {
              const user = users.find((user) => user.id === zone.userId);

              return (
                <MenuItem
                  alignItems="flex-start"
                  style={{ backgroundColor: 'transparent' }}
                  key={zone.id}
                  value={zone.id}
                >
                  <CustomCheckbox
                    checked={selectedZones.indexOf(zone.id) > -1}
                  />
                  <ListItemText
                    classes={{
                      primary: classes.listItemTextPrimary,
                      secondary: classes.listItemTextSecondary,
                    }}
                    primary={
                      <span style={{ color: '#002C71' }}>
                        {getUserFullName(user)}
                      </span>
                    }
                    secondary={<span>{zone.description}</span>}
                  />
                </MenuItem>
              );
            })}

          <MenuItem disabled value="">
            <span style={{ color: 'black', opacity: 2.0 }}>
              Unassigned Zones
            </span>
          </MenuItem>

          {users &&
            unassignedZones &&
            unassignedZones.map((zone) => {
              const user = users.find((user) => user.id === zone.userId);

              return (
                <MenuItem
                  alignItems="flex-start"
                  key={zone.id}
                  value={zone.id}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <CustomCheckbox
                    checked={selectedZones.indexOf(zone.id) > -1}
                  />
                  <ListItemText
                    classes={{
                      primary: classes.listItemTextPrimary,
                      secondary: classes.listItemTextSecondary,
                    }}
                    primary={
                      <span style={{ color: '#002C71' }}>
                        {getUserFullName(user)}
                      </span>
                    }
                    secondary={<span>{zone.description}</span>}
                  />
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </div>
  );
}
