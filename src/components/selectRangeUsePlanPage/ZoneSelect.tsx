import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { getUserFullName } from '../../utils';
import { FormControlLabel } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => ({
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

interface ZoneInfo {
  selectedZones: any[];
  selectAllZones: boolean;
  [key: string]: any;
}

interface ZoneSelectAllProps {
  zones: any[];
  users: any[];
  zoneInfo: ZoneInfo;
  setZoneInfo: (info: ZoneInfo) => void;
}

export function ZoneSelectAll({ zones, users, zoneInfo, setZoneInfo }: ZoneSelectAllProps) {
  const classes = useStyles();
  useEffect(() => {
    selectAllZones(zoneInfo.selectAllZones);
  }, []);
  const selectAllZones = (flag = true) => {
    if (flag)
      setZoneInfo({
        ...zoneInfo,
        selectedZones: zones.map((zone) => zone.id),
        selectAllZones: true,
      });
    else setZoneInfo({ ...zoneInfo, selectedZones: [], selectAllZones: false });
  };
  const handleChange = (event: any) => {
    const selectedZones = event.target.value;
    let selectAll = false;
    if (selectedZones !== undefined) {
      if (selectedZones.length === zones.length) {
        selectAll = true;
      } else if (selectedZones.length === 0) {
        selectAll = false;
      }
      setZoneInfo({
        ...zoneInfo,
        selectedZones: selectedZones,
        selectAllZones: selectAll,
      });
    }
  };

  return (
    <div className={classes.formControl}>
      <FormControlLabel
        control={
          <Checkbox
            checked={zoneInfo?.selectAllZones === true}
            onChange={(event: any) => {
              selectAllZones(event.target.checked);
            }}
            name="selectAllZones"
            color="primary"
          />
        }
        label="Select All Zones"
      />
      <FormControl className={classes.formControl}>
        <InputLabel>Select Individual Zones</InputLabel>
        <Select
          onClick={handleChange}
          value={zoneInfo?.selectedZones}
          multiple
          renderValue={(zoneIds: any) => {
            if (zoneInfo.selectAllZones) return '';
            return (zoneIds as any[]).map((id: any) => zones.find((zone) => zone.id === id)?.description).join(',  ');
          }}
          MenuProps={{
            getContentAnchorEl: () => null as any,
            ...MenuProps,
          }}
        >
          <MenuItem value="" disabled>
            <span style={{ color: 'black', opacity: 2.0 }}>All Zones</span>
          </MenuItem>

          {zones &&
            zones.map((zone) => {
              const user = users?.find((u: any) => u.id === zone.userId);
              return (
                <MenuItem
                  alignItems="flex-start"
                  key={zone.id}
                  value={zone.id}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <CustomCheckbox checked={zoneInfo?.selectedZones.indexOf(zone.id) > -1} />
                  <ListItemText
                    classes={{
                      primary: classes.listItemTextPrimary,
                      secondary: classes.listItemTextSecondary,
                    }}
                    primary={<span style={{ color: '#002C71' }}>{getUserFullName(user)}</span>}
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

interface ZoneSelectProps {
  zones: any[];
  unassignedZones: any[];
  userZones: any[];
  users: any[];
  setZoneInfo: (info: ZoneInfo) => void;
  zoneInfo: ZoneInfo;
}

export function ZoneSelect({ zones, unassignedZones, userZones, users, setZoneInfo, zoneInfo }: ZoneSelectProps) {
  const classes = useStyles();
  useEffect(() => {
    selectAllZones(zoneInfo.selectAllZones);
  }, [zoneInfo.selectAllZones]);

  const handleChange = (event: any) => {
    if (event.target.value) {
      const selectedZones = event.target.value;
      let selectAll = false;
      if (selectAll)
        if (selectedZones.length === zones.length) {
          selectAll = true;
        } else if (selectedZones.length === 0) {
          selectAll = false;
        }
      setZoneInfo({
        ...zoneInfo,
        selectedZones: selectedZones,
        selectAllZones: selectAll,
      });
    }
  };

  const selectAllZones = (select: boolean) => {
    if (select) {
      setZoneInfo({
        ...zoneInfo,
        selectedZones: userZones.concat(unassignedZones).map((zone) => zone.id),
        selectAllZones: select,
      });
    } else setZoneInfo({ ...zoneInfo, selectAllZones: select, selectedzones: [] });
  };
  return (
    <div className={classes.formControl}>
      <FormControlLabel
        control={
          <Checkbox
            checked={zoneInfo.selectAllZones}
            onChange={(event: any) => {
              selectAllZones(event.target.checked);
            }}
            name="selectAllZones"
            color="primary"
          />
        }
        label="Select All Zones"
      />
      <FormControl className={classes.formControl}>
        <InputLabel>Select Individual Zones</InputLabel>
        <Select
          onClick={handleChange}
          value={zoneInfo.selectedZones}
          multiple
          renderValue={(zoneIds: any) => {
            if (zoneInfo.selectAllZones) return '';
            return (zoneIds as any[]).map((id: any) => zones.find((zone) => zone.id === id).description).join(',  ');
          }}
          MenuProps={{
            getContentAnchorEl: () => null as any,
            ...MenuProps,
          }}
        >
          <MenuItem value="" disabled>
            <span style={{ color: 'black', opacity: 2.0 }}>Assigned Zones</span>
          </MenuItem>

          {userZones &&
            userZones.map((zone) => {
              const user = users.find((u: any) => u.id === zone.userId);
              return (
                <MenuItem
                  alignItems="flex-start"
                  style={{ backgroundColor: 'transparent' }}
                  key={zone.id}
                  value={zone.id}
                >
                  <CustomCheckbox checked={zoneInfo.selectedZones?.indexOf(zone.id) > -1} />
                  <ListItemText
                    classes={{
                      primary: classes.listItemTextPrimary,
                      secondary: classes.listItemTextSecondary,
                    }}
                    primary={<span style={{ color: '#002C71' }}>{getUserFullName(user)}</span>}
                    secondary={<span>{zone.description}</span>}
                  />
                </MenuItem>
              );
            })}

          <MenuItem disabled value="">
            <span style={{ color: 'black', opacity: 2.0 }}>Unassigned Zones</span>
          </MenuItem>

          {users &&
            unassignedZones &&
            unassignedZones.map((zone) => {
              const user = users.find((u: any) => u.id === zone.userId);
              return (
                <MenuItem
                  alignItems="flex-start"
                  key={zone.id}
                  value={zone.id}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <CustomCheckbox checked={zoneInfo.selectedZones?.indexOf(zone.id) > -1} />
                  <ListItemText
                    classes={{
                      primary: classes.listItemTextPrimary,
                      secondary: classes.listItemTextSecondary,
                    }}
                    primary={<span style={{ color: '#002C71' }}>{getUserFullName(user)}</span>}
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
