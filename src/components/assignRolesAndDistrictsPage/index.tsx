import React, { useState } from 'react';
import useSWR from 'swr';
import { CircularProgress, TextField, Grid, Typography, makeStyles, Button, Fade } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import * as strings from '../../constants/strings';
import * as API from '../../constants/api';
import { axios, formatDateToNow, getAuthHeaderConfig, getUserFullName, getUserRole, getUserRoleObj } from '../../utils';
import { Banner } from '../common';
import { assignRole, assignDistricts } from '../../api';

interface UserOption {
  id: number;
  email?: string;
  ssoId?: string;
  givenName?: string;
  familyName?: string;
  lastLoginAt?: string;
  roleId?: number;
  [key: string]: any;
}

interface RoleOption {
  id: number;
  description: string;
}

interface DistrictOption {
  id: number;
  code: string;
  description: string;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  progress: {
    marginLeft: theme.spacing(2),
  },
  noSelection: {
    padding: theme.spacing(2),
  },
  addButton: {},
  buttonProgress: {},
  successMessage: {
    color: 'green',
  },
}));

const AssignRolesAndDistrictsPage: React.FC = () => {
  const classes = useStyles();

  const {
    data: usersFromData,
    error,
    isValidating,
  } = useSWR<UserOption[]>(`${API.GET_USERS}/?orderCId=desc`, (key: string) =>
    axios.get(key, getAuthHeaderConfig()).then((res: any) => {
      setUsers(res.data);
      return res.data;
    }),
  );
  const { data: roles } = useSWR<RoleOption[]>(`${API.GET_ROLES}`, (key: string) =>
    axios.get(key, getAuthHeaderConfig()).then((res: any) => {
      return res.data;
    }),
  );
  const { data: districtsFromData } = useSWR<DistrictOption[]>(`${API.GET_DISTRICTS}`, (key: string) =>
    axios.get(key, getAuthHeaderConfig()).then((res: any) => {
      setDistricts(res.data);
      return res.data;
    }),
  );

  const handleSave = async () => {
    if (!user || !role) return;
    setAssigning(true);
    setAssigningError(null);
    setAssigningSuccess(null);
    try {
      if (role.id === -1) {
        setAssigningError('No role has been selected');
        return;
      }
      await assignRole(user.id, role.id);
      await assignDistricts(user.id, selectedDistricts);
      setAssigningSuccess('Role and Districts assigned to account successfully');
      axios.get(`${API.GET_USERS}/?orderCId=desc`, getAuthHeaderConfig()).then((res: any) => {
        setUsers([...res.data]);
        return res.data;
      });
      axios.get(`${API.GET_DISTRICTS}`, getAuthHeaderConfig()).then((res: any) => {
        setDistricts([...res.data]);
        return res.data;
      });
    } catch (e: any) {
      setAssigningError(`Error assigning to account: ${e.message ?? e?.data?.error}`);
    } finally {
      setAssigning(false);
    }
  };

  const pullRoleAndDistrict = (selectedUser: UserOption) => {
    // Role
    setRole(getUserRoleObj(selectedUser));

    // District
    axios.get(`${API.GET_DISTRICTS}/${selectedUser.id}`, getAuthHeaderConfig()).then((res: any) => {
      setSelectedDistricts([...res.data]);
      return res.data;
    });
  };

  const [users, setUsers] = useState<UserOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [user, setUser] = useState<UserOption | null>(null);
  const [role, setRole] = useState<RoleOption | null>(null);
  const [selectedDistricts, setSelectedDistricts] = useState<DistrictOption[]>([]);
  const [assigning, setAssigning] = useState(false);
  const [assigningError, setAssigningError] = useState<string | null>(null);
  const [assigningSuccess, setAssigningSuccess] = useState<string | null>(null);

  return (
    <section className="manage-client">
      <Banner header={strings.ASSIGN_ROLES_AND_DISTRICTS} content={strings.ASSIGN_ROLES_AND_DISTRICT_BANNER_CONTENT} />
      <div className="manage-client__content">
        <div className="manage-client__steps">
          <h3>Select the user who you&apos;d like to edit:</h3>
          {error && (
            <Typography color="error">
              index.js Error occurred fetching user:{' '}
              {(error as any)?.message ?? (error as any)?.data?.error ?? JSON.stringify(error)}
            </Typography>
          )}
          {isValidating && !usersFromData && <CircularProgress />}
          {usersFromData && (
            <>
              <Autocomplete
                id="user-autocomplete-select"
                options={users?.length > 0 ? users : usersFromData}
                value={user}
                openOnFocus
                onChange={(_e: any, selectedUser: UserOption | null) => {
                  setUser(selectedUser);
                  if (selectedUser) pullRoleAndDistrict(selectedUser);
                }}
                getOptionLabel={(option: UserOption) => getUserFullName(option)}
                getOptionSelected={(option: UserOption, value: UserOption) => option.id === value.id}
                style={{ width: 400 }}
                renderInput={(params: any) => <TextField {...params} label="Select user" variant="outlined" />}
                renderOption={(option: UserOption) => (
                  <Grid container alignItems="center">
                    <Grid item>
                      <PersonIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                      {option.id} - {getUserFullName(option)}
                      <Typography color="textSecondary">{getUserRole(option)}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDateToNow(option.lastLoginAt)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {option.ssoId}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              />
            </>
          )}

          <br></br>

          {user && selectedDistricts && (
            <>
              {/* Roles */}
              <Autocomplete
                id="user-autocomplete-select"
                options={[...(roles || []), { id: -1, description: 'No role in database yet' }]}
                value={role}
                openOnFocus
                onChange={(_e: any, selectedRole: RoleOption | null) => {
                  setRole(selectedRole);
                }}
                getOptionLabel={(option: RoleOption) => option.description}
                style={{ width: 400 }}
                renderInput={(params: any) => <TextField {...params} label="Role" variant="outlined" />}
                renderOption={(option: RoleOption) => (
                  <Grid container alignItems="center">
                    <Grid item xs>
                      <Typography>{option.description}</Typography>
                    </Grid>
                  </Grid>
                )}
              />

              <br></br>

              {/* Districts */}
              <Autocomplete
                id="user-autocomplete-select"
                multiple
                options={districts.length > 0 ? districts : districtsFromData || []}
                value={selectedDistricts}
                openOnFocus
                onChange={(_e: any, newDistricts: DistrictOption[]) => {
                  setSelectedDistricts(newDistricts);
                }}
                getOptionLabel={(option: DistrictOption) => `${option.code}`}
                style={{ width: 400 }}
                renderInput={(params: any) => <TextField {...params} label="Select Districts" variant="outlined" />}
                renderOption={(option: DistrictOption) => (
                  <Grid container alignItems="center">
                    <Grid item xs>
                      <Typography variant="body2" color="textPrimary">
                        {option.code}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ID: {option.id}
                      </Typography>
                      <Typography>{option.description}</Typography>
                    </Grid>
                  </Grid>
                )}
              />
            </>
          )}

          {role && selectedDistricts && user && (
            <>
              <br></br>
              <Button
                className={classes.addButton}
                type="button"
                onClick={handleSave}
                disabled={
                  user === null ||
                  selectedDistricts === null ||
                  role === null ||
                  (role?.id === 4 && selectedDistricts?.length > 0)
                }
                variant="contained"
                color="primary"
              >
                Assign User Role/Districts
                {assigning && (
                  <Fade
                    in={assigning}
                    style={{
                      transitionDelay: assigning ? '800ms' : '0ms',
                    }}
                    unmountOnExit
                  >
                    <CircularProgress className={classes.buttonProgress} size={24} />
                  </Fade>
                )}
              </Button>
            </>
          )}

          {assigningError && <Typography color="error">{assigningError}</Typography>}
          {role?.id === 4 && selectedDistricts?.length > 0 && (
            <Typography color="error">Range Agreement Holders cannot be assigned districts.</Typography>
          )}

          {assigningSuccess && <Typography className={classes.successMessage}>{assigningSuccess}</Typography>}
        </div>
      </div>
    </section>
  );
};

export default AssignRolesAndDistrictsPage;
