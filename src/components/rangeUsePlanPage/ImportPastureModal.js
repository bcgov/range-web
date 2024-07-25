import {
  CircularProgress,
  Collapse,
  DialogContent,
  Divider,
  IconButton,
  List,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { AddBox, ExpandLess, ExpandMore } from '@material-ui/icons';
import {
  Dialog,
  DialogActions,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { ListItem } from 'semantic-ui-react';
import {
  GET_PASTURES_FOR_DISTRICT,
  GET_USER_DISTRICTS,
} from '../../constants/api';
import { axios, getAuthHeaderConfig } from '../../utils';
import { PrimaryButton } from '../common';
import { debounce } from 'lodash';
import { useUser } from '../../providers/UserProvider';

const useStyles = makeStyles({
  divider: {
    height: '2px',
    backgroundColor: 'rgb(0,0,0,1)',
  },
  dialogPaper: {
    maxWidth: '60% !important',
    width: '60%',
    height: '100vh',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  },
  evenItem: {
    backgroundColor: '#d3d3d3',
  },
  oddItem: {
    backgroundColor: '#ffffff',
  },
});

const ImportPastureModal = ({ dialogOpen, onClose, onImport }) => {
  const [pastures, setPastures] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtId, setDistrictId] = useState(null);
  const [open, setOpen] = useState({});
  const [isLoading, setLoading] = useState(false);
  const classes = useStyles();
  const [filteredPastures, setFilteredPastures] = useState([]);
  const user = useUser();
  const handleClick = (id) => {
    setOpen((prevOpen) => ({ ...prevOpen, [id]: !prevOpen[id] }));
  };
  const handleSearchChange = (event) => {
    pastureFilter(event.target.value);
  };
  const handleDistrictChange = (event) => {
    setDistrictId(event.target.value);
  };
  const fetchPastures = async (districtId) => {
    setLoading(true);
    const response = await axios.get(
      GET_PASTURES_FOR_DISTRICT(districtId),
      getAuthHeaderConfig(),
    );
    setLoading(false);
    setPastures(response.data);
    setFilteredPastures(response.data);
  };

  const fetchDistricts = async (userId) => {
    const response = await axios.get(
      GET_USER_DISTRICTS(userId),
      getAuthHeaderConfig(),
    );
    setDistricts(response.data);
    setDistrictId(response.data[0]?.id);
  };

  const pastureFilter = useCallback(
    debounce(async (term) => {
      if (term.trim() === '') {
        setFilteredPastures(pastures);
      }
      setFilteredPastures(
        pastures.filter((pasture) => {
          return (
            pasture.name.toLowerCase().includes(term.toLowerCase()) ||
            pasture.agreementId.toLowerCase().includes(term.toLowerCase())
          );
        }),
      );
    }, 500),
    [pastures],
  );

  useEffect(() => {
    if (dialogOpen) {
      fetchDistricts(user.id);
    }
  }, [dialogOpen]);

  useEffect(() => {
    if (districtId) fetchPastures(districtId);
  }, [districtId]);

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogContent>
        <>
          <div>
            <TextField
              autoFocus
              label="Filter Pastures"
              variant="outlined"
              style={{ width: '50%', marginRight: 20 }}
              onChange={handleSearchChange}
            />
            <Select value={districtId} onChange={handleDistrictChange}>
              {districts.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.code}
                </MenuItem>
              ))}
            </Select>
          </div>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <List>
              {filteredPastures.map((pasture, index) => (
                <div key={pasture.id}>
                  <ListItem
                    className={`${index % 2 === 0 ? classes.evenItem : classes.oddItem}  ${classes.listItem}`}
                    key={index}
                    onClick={() => handleClick(pasture.id)}
                  >
                    <Typography style={{ width: '60%' }}>
                      <strong>
                        {pasture.name} - {pasture.agreementId}
                      </strong>
                    </Typography>
                    <div>
                      <IconButton
                        edge="end"
                        size="small"
                        style={{ marginRight: 40 }}
                        onClick={() => onImport(pasture)}
                      >
                        <AddBox></AddBox>
                        Import
                      </IconButton>
                      <IconButton edge="end" size="small">
                        {open[pasture.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </div>
                  </ListItem>
                  <Collapse
                    in={open[pasture.id]}
                    timeout="auto"
                    unmountOnExit
                    className={`${index % 2 === 0 ? classes.evenItem : classes.oddItem}`}
                  >
                    <div className="main">
                      <Typography variant="body1">
                        <strong>Allowable AUM:</strong> {pasture.allowableAum}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Grace Days:</strong> {pasture.graceDays}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Notes:</strong> {pasture.notes}
                      </Typography>
                      {pasture.plantCommunities?.length > 0 && (
                        <div>
                          <Typography variant="h6">
                            Plant Communities
                          </Typography>
                          {pasture.plantCommunities.map((community) => (
                            <div key={community.id}>
                              <Divider className={classes.divider} />
                              <Typography variant="body1">
                                <strong>Name:</strong> {community.name}
                              </Typography>
                              <Typography variant="body1">
                                <strong>Purpose of Action:</strong>{' '}
                                {community.purposeOfAction}
                              </Typography>
                              <Typography variant="body1">
                                <strong>Elevation:</strong>{' '}
                                {community.elevation?.name}
                              </Typography>
                              <Typography variant="body1">
                                <strong>Community Type:</strong>{' '}
                                {community.communityType?.name}
                              </Typography>
                              {community.indicatorPlants?.length > 0 && (
                                <div>
                                  <Typography variant="h6">
                                    Indicator Plants
                                  </Typography>
                                  {community.indicatorPlants.map((plant) => (
                                    <Typography key={plant.id} variant="body2">
                                      {plant.plantSpecies?.name} (Leaf Stage:{' '}
                                      {plant.plantSpecies?.leafStage}, Stubble
                                      Height:{' '}
                                      {plant.plantSpecies?.stubbleHeight},
                                      Criteria: {plant.criteria})
                                    </Typography>
                                  ))}
                                </div>
                              )}
                              {community.plantCommunityActions.length > 0 && (
                                <div>
                                  <Typography variant="h6">Actions</Typography>
                                  {community.plantCommunityActions.map(
                                    (action) => (
                                      <Typography
                                        key={action.id}
                                        variant="body2"
                                      >
                                        {action.actionType?.name}:{' '}
                                        {action.details}
                                      </Typography>
                                    ),
                                  )}
                                </div>
                              )}
                              {community.monitoringAreas.length > 0 && (
                                <div>
                                  <Typography variant="h6">
                                    Monitoring Areas
                                  </Typography>
                                  {community.monitoringAreas.map((area) => (
                                    <Typography key={area.id} variant="body2">
                                      {area.name} (Location: {area.location},
                                      Latitude: {area.latitude}, Longitude:{' '}
                                      {area.longitude}, Rangeland Health:{' '}
                                      {area.rangelandHealth?.name})
                                    </Typography>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Collapse>
                  <Divider />
                </div>
              ))}
            </List>
          )}
        </>
      </DialogContent>
      <DialogActions>
        <PrimaryButton onClick={() => onClose()}>Close</PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default ImportPastureModal;
