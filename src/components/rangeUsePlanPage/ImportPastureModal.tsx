import {
  CircularProgress,
  Collapse,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { AddBox, ExpandLess, ExpandMore } from '@material-ui/icons';
import { Dialog, DialogActions, MenuItem, Select, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { ListItem } from 'semantic-ui-react';
import { GET_PASTURES_FOR_DISTRICT, GET_USER_DISTRICTS } from '../../constants/api';
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

interface ImportPastureModalProps {
  dialogOpen: boolean;
  onClose: () => void;
  onImport: (item: any) => void;
  mode?: 'pasture' | 'plantCommunity';
}

const ImportPastureModal = ({ dialogOpen, onClose, onImport, mode = 'pasture' }: ImportPastureModalProps) => {
  const [pastures, setPastures] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [districtId, setDistrictId] = useState<any>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [pcOpen, setPcOpen] = useState<Record<string, boolean>>({});
  const [isLoading, setLoading] = useState(false);
  const classes = useStyles();
  const [filteredPastures, setFilteredPastures] = useState<any[]>([]);
  const user = useUser();
  const isPlantCommunityMode = mode === 'plantCommunity';
  const modalTitle = isPlantCommunityMode ? 'Import Plant Community' : 'Import Pasture';
  const filterPlaceholder = 'Filter';
  const handleClick = (id: string) => {
    setOpen((prevOpen) => ({ ...prevOpen, [id]: !prevOpen[id] }));
  };
  const handlePcClick = (id: string) => {
    setPcOpen((prevOpen) => ({ ...prevOpen, [id]: !prevOpen[id] }));
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pastureFilter(event.target.value);
  };
  const handleDistrictChange = (event: any) => {
    setDistrictId(event.target.value);
  };
  const fetchPastures = async (distId: any) => {
    setLoading(true);
    const response = await axios.get(GET_PASTURES_FOR_DISTRICT(distId), getAuthHeaderConfig());
    setLoading(false);
    const filtered = isPlantCommunityMode ? response.data.filter((p: any) => p.plantCommunities?.length > 0) : response.data;
    setPastures(filtered);
    setFilteredPastures(filtered);
  };

  const fetchDistricts = async (userId: any) => {
    const response = await axios.get(GET_USER_DISTRICTS(userId), getAuthHeaderConfig());
    setDistricts(response.data);
    setDistrictId(response.data[0]?.id);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pastureFilter = useCallback(
    debounce(async (term: string) => {
      if (term.trim() === '') {
        setFilteredPastures(pastures);
      }
      setFilteredPastures(
        pastures.filter((pasture: any) => {
          const pastureMatch =
            pasture.name.toLowerCase().includes(term.toLowerCase()) ||
            pasture.agreementId.toLowerCase().includes(term.toLowerCase());
          if (isPlantCommunityMode) {
            const pcMatch = pasture.plantCommunities?.some((pc: any) =>
              (pc.name || pc.communityType?.name)?.toLowerCase().includes(term.toLowerCase()),
            );
            return pastureMatch || pcMatch;
          }
          return pastureMatch;
        }),
      );
    }, 500),
    [pastures, isPlantCommunityMode],
  );

  useEffect(() => {
    if (dialogOpen && user) {
      fetchDistricts(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen]);

  useEffect(() => {
    if (districtId) fetchPastures(districtId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId]);

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle>{modalTitle}</DialogTitle>
      <DialogContent>
        <>
          <div>
            <TextField
              autoFocus
              label={filterPlaceholder}
              variant="outlined"
              style={{ width: '50%', marginRight: 20 }}
              onChange={handleSearchChange}
            />
            <Select value={districtId} onChange={handleDistrictChange}>
              {districts.map((district: any) => (
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
              {filteredPastures.map((pasture: any, index: number) => (
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
                      {!isPlantCommunityMode && (
                        <IconButton
                          edge="end"
                          size="small"
                          style={{ marginRight: 40 }}
                          onClick={() => onImport(pasture)}
                        >
                          <AddBox></AddBox>
                          Import
                        </IconButton>
                      )}
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
                        <strong>Allowable AUM/Tonne:</strong> {pasture.allowableAum}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Grace Days:</strong> {pasture.graceDays}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Notes:</strong> {pasture.notes}
                      </Typography>
                      {pasture.plantCommunities?.length > 0 && (
                        <div>
                          <Typography variant="h6">Plant Communities</Typography>
                          {pasture.plantCommunities.map((community: any, pcIndex: number) => (
                            <div key={community.id}>
                              <ListItem
                                className={`${pcIndex % 2 === 0 ? classes.evenItem : classes.oddItem}  ${classes.listItem}`}
                                onClick={() => handlePcClick(community.id)}
                              >
                                <Typography style={{ width: '60%' }}>
                                  <strong>Name:</strong> {community.name || community.communityType?.name}
                                </Typography>
                                <div>
                                  {isPlantCommunityMode && (
                                    <IconButton
                                      edge="end"
                                      size="small"
                                      style={{ marginRight: 40 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onImport(community);
                                      }}
                                    >
                                      <AddBox></AddBox>
                                      Import
                                    </IconButton>
                                  )}
                                  <IconButton edge="end" size="small">
                                    {pcOpen[community.id] ? <ExpandLess /> : <ExpandMore />}
                                  </IconButton>
                                </div>
                              </ListItem>
                              <Collapse
                                in={pcOpen[community.id]}
                                timeout="auto"
                                unmountOnExit
                                className={`${pcIndex % 2 === 0 ? classes.evenItem : classes.oddItem}`}
                              >
                                <div className="main">
                                  <Typography variant="body1">
                                    <strong>Purpose of Action:</strong> {community.purposeOfAction}
                                  </Typography>
                                  <Typography variant="body1">
                                    <strong>Elevation:</strong> {community.elevation?.name}
                                  </Typography>
                                  <Typography variant="body1">
                                    <strong>Community Type:</strong> {community.communityType?.name}
                                  </Typography>
                                  {community.indicatorPlants?.length > 0 && (
                                    <div>
                                      <Typography variant="h6">Indicator Plants</Typography>
                                      {community.indicatorPlants.map((plant: any) => (
                                        <Typography key={plant.id} variant="body2">
                                          {plant.plantSpecies?.name} (Leaf Stage: {plant.plantSpecies?.leafStage},
                                          Stubble Height: {plant.plantSpecies?.stubbleHeight}, Criteria:{' '}
                                          {plant.criteria})
                                        </Typography>
                                      ))}
                                    </div>
                                  )}
                                  {community.plantCommunityActions.length > 0 && (
                                    <div>
                                      <Typography variant="h6">Actions</Typography>
                                      {community.plantCommunityActions.map((action: any) => (
                                        <Typography key={action.id} variant="body2">
                                          {action.actionType?.name}: {action.details}
                                        </Typography>
                                      ))}
                                    </div>
                                  )}
                                  {community.monitoringAreas.length > 0 && (
                                    <div>
                                      <Typography variant="h6">Monitoring Areas</Typography>
                                      {community.monitoringAreas.map((area: any) => (
                                        <Typography key={area.id} variant="body2">
                                          {area.name} (Location: {area.location}, Latitude: {area.latitude}, Longitude:{' '}
                                          {area.longitude}, Rangeland Health: {area.rangelandHealth?.name})
                                        </Typography>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </Collapse>
                              <Divider className={classes.divider} />
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
