import React, { useState } from 'react';
import useSWR from 'swr';
import {
  CircularProgress,
  TextField,
  Grid,
  Typography,
  makeStyles,
  Button,
  Fade,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import * as strings from '../../constants/strings';
import * as API from '../../constants/api';
import {
  axios,
  formatDateToNow,
  getAuthHeaderConfig,
  getUserFullName,
  getUserRole,
  getUserRoleObj,
} from '../../utils';
import { Banner } from '../common';
import { assignRole, assignDistricts } from '../../api';

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
}));

const AssignRolesAndDistrictsPage = () => {
  const classes = useStyles();

  const {
    data: usersFromData,
    error,
    isValidating,
  } = useSWR(
    `${API.GET_USERS}/?orderCId=desc`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => {
      setUsers(res.data);
      return res.data
    }),
  );
  const { data: roles } = useSWR(
    `${API.GET_ROLES}`, (key) =>
    axios.get(key, getAuthHeaderConfig()).then((res) => {
      return res.data;
    }),
  );
  const { data: districtsFromData } = useSWR(
    `${API.GET_DISTRICTS}`, (key) =>
    axios.get(key, getAuthHeaderConfig()).then((res) => {
      setDistricts(res.data);
      return res.data;
    }),
  );

  const handleSave = async () => {
    setAssigning(true);
    setAssigningError(null);
    setAssigningSuccess(null);
    try {
      if (role.id === -1) {
        setAssigningError("No role has been selected");
        return;
      }
      await assignRole(user.id, role.id);
      await assignDistricts(user.id, selectedDistricts);
      setAssigningSuccess('Role and Districts assigned to account successfully');
      axios.get(`${API.GET_USERS}/?orderCId=desc`, getAuthHeaderConfig()).then((res) => {
        setUsers([...res.data]);
        return res.data
      });
      axios.get(`${API.GET_DISTRICTS}`, getAuthHeaderConfig()).then((res) => {
        setDistricts([...res.data]);
        return res.data;
      });
    } catch (e) {
      setAssigningError(`Error assigning to account: ${e.message ?? e?.data?.error}`);
    } finally {
      setAssigning(false);
    }
  }

  const pullRoleAndDistrict = (user) => {
    // Role
    setRole(getUserRoleObj(user));

    // District
    axios.get(`${API.GET_DISTRICTS}/${user.id}`, getAuthHeaderConfig()).then((res) => {
      setSelectedDistricts([...res.data]);
      return res.data
    })
  }

  const [users, setUsers] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [assigningError, setAssigningError] = useState(null);
  const [assigningSuccess, setAssigningSuccess] = useState(null);


  return (
    <section className="manage-client">
      <Banner
        header={strings.ASSIGN_ROLES_AND_DISTRICTS}
        content={strings.ASSIGN_ROLES_AND_DISTRICT_BANNER_CONTENT}
      />
      <div className="manage-client__content">
        <div className="manage-client__steps">

          <h3>
            Select the user who you&apos;d like to edit:
          </h3>
          {error && (
            <Typography color="error">
            index.js Error occurred fetching user:{' '}
            {error?.message ?? error?.data?.error ?? JSON.stringify(error)}
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
                onChange={(e, user) => {
                  setUser(user);
                  pullRoleAndDistrict(user);
                }}
                getOptionLabel={(option) => getUserFullName(option)}
                getOptionSelected={(option) => option.id === user.id}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select user"
                    variant="outlined"
                  />
                )}
                renderOption={(option) => (
                  <Grid container alignItems="center">
                    <Grid item>
                      <PersonIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                    {option.id} - {getUserFullName(option)}
                      <Typography color="textSecondary">
                        {getUserRole(option)}
                      </Typography>
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

          {user && selectedDistricts && <>
            {/* Roles */}
            <Autocomplete
              id="user-autocomplete-select"
              options={
                [
                  ...roles, 
                  {id: -1, description: 'No role in database yet'}
                ]
              }
              value={role}
              openOnFocus
              onChange={(e, role) => {
                setRole(role);
              }}
              getOptionLabel={(option) => option.description}
              style={{ width: 400 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role"
                  variant="outlined"
                />
              )}
              renderOption={(option) => (
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
              options={districts.length > 0 ? districts : districtsFromData}
              value={selectedDistricts}
              openOnFocus
              onChange={(e, districts) => {
                setSelectedDistricts(districts);
              }}
              getOptionLabel={(option) => `${option.code}`}
              style={{ width: 400 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Districts"
                  variant="outlined"
                />
              )}
              renderOption={(option) => (
                <Grid container alignItems="center">
                  <Grid item xs>
                  <Typography variant="body2" color="textPrimary">
                      {option.code}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID: {option.id}
                    </Typography>
                    <Typography>
                      {option.description}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            />
          </>}

          {role && selectedDistricts && user && (
            <>
              <br></br>
              <Button
                className={classes.addButton}
                type="button"
                onClick={handleSave}
                disabled={user === null || selectedDistricts === null || role === null}
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
                    <CircularProgress
                      className={classes.buttonProgress}
                      size={24}
                    />
                  </Fade>
                )}
              </Button>
            </>
            )
          }

          {assigningError && <Typography color="error">{assigningError}</Typography>}

          {assigningSuccess && (
            <Typography className={classes.successMessage}>
              {assigningSuccess}
            </Typography>
          )}

        </div>
      </div>
    </section>
  );
};

export default AssignRolesAndDistrictsPage;
