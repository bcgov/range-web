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
} from '../../utils';
import { Banner } from '../common';
import { assignRole, assignDistrict } from '../../api';

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
    data: users,
    error,
    isValidating,
  } = useSWR(
    `${API.GET_USERS}/?orderCId=desc`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => {
      console.log(res);
      return res.data
    }),
  );
  const {
    data: roles,
  } = useSWR(
    `${API.GET_ROLES}`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => {
      console.log(res);
      return res.data
    }),
  );
  const {
    data: districts,
  } = useSWR(
    `${API.GET_DISTRICTS}`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => {
      console.log(res);
      return res.data
    }),
  );

  const handleAddRole = async () => {
    setAssigningRole(true);
    setAssigningError(null);
    setAssigningSuccess(null);
    try {
      await assignRole(user.id, role.id);
      setAssigningSuccess('Role assigned to account successfully');
    } catch (e) {
      setAssigningError(`Error assigning role to account: ${e.message ?? e?.data?.error}`);
    } finally {
      setAssigningRole(false);
    }
  }

  const handleAddDistrict = async () => {
    setAssigningDistrict(true);
    setAssigningDistrictError(null);
    setAssigningDistrictSuccess(null);
    try {
      await assignDistrict(user.id, district.id);
      setAssigningDistrictSuccess('District assigned to account successfully');
    } catch (e) {
      setAssigningDistrictError(`Error assigning district to account: ${e.message ?? e?.data?.error}`);
    } finally {
      setAssigningDistrict(false);
    }
  }

  const [user, setUser] = useState(null);
  const [whatToAssign, setWhatToAssign] = useState(null);
  const [role, setRole] = useState(null);
  const [district, setDistrict] = useState(null);
  const [assigningRole, setAssigningRole] = useState(false);
  const [assigningError, setAssigningError] = useState(null);
  const [assigningSuccess, setAssigningSuccess] = useState(null);
  const [assigningDistrict, setAssigningDistrict] = useState(false);
  const [assigningDistrictError, setAssigningDistrictError] = useState(null);
  const [assigningDistrictSuccess, setAssigningDistrictSuccess] = useState(null);

  return (
    <section className="manage-client">
      <Banner
        header={strings.ASSIGN_ROLES_AND_DISTRICTS_BANNER_HEADER}
        content={strings.ASSIGN_ROLES_AND_DISTRICTS_BANNER_CONTENT}
      />
      <div className="manage-client__content">
        <div className="manage-client__steps">
          <h2>
            Would you like to assign a role or district?:
          </h2>
          <div className="button-container">
            <Button 
              variant="contained"
              onClick={() => setWhatToAssign("Role")}
              disabled={whatToAssign === "Role"}>
              Role
            </Button>
            <Button
              variant="contained"
              onClick={() => setWhatToAssign("District")}
              disabled={whatToAssign === "District"}>
              District
            </Button>
          </div>

          {whatToAssign && 
          <>
            <h3>
              Step 1: Select the user who you&apos;d like to edit:
            </h3>
            {error && (
              <Typography color="error">
              index.js Error occurred fetching user:{' '}
              {error?.message ?? error?.data?.error ?? JSON.stringify(error)}
              </Typography>
            )}
            {isValidating && !users && <CircularProgress />}
            {users && (
              <>
                <Autocomplete
                  id="user-autocomplete-select"
                  options={users}
                  value={user}
                  openOnFocus
                  onChange={(e, user) => {
                    setUser(user);
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
          </>
          }

          {whatToAssign === "Role" &&
          <>
            <h3>Step 2: Choose role you would like to assign:</h3>
            <Autocomplete
                id="user-autocomplete-select"
                options={roles}
                value={role}
                openOnFocus
                onChange={(e, role) => {
                  setRole(role);
                }}
                getOptionLabel={(option) => option.description}
                // getOptionSelected={(option) => option.id === user.id}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Role"
                    variant="outlined"
                  />
                )}
                renderOption={(option) => (
                  <Grid container alignItems="center">
                    <Grid item xs>
                      <Typography>
                        {option.description}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
            />
            {role && user && (
              <>
                <h3>Step 3: Confirm assigning of role</h3>
                <Button
                  className={classes.addButton}
                  type="button"
                  onClick={handleAddRole}
                  disabled={user === null || role === null || assigningRole}
                  variant="contained"
                  color="primary"
                >
                  Assign Role
                  {assigningRole && (
                    <Fade
                      in={assigningRole}
                      style={{
                        transitionDelay: assigningRole ? '800ms' : '0ms',
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
            )}
            {assigningError && <Typography color="error">{assigningError}</Typography>}
            {assigningSuccess && (
              <Typography className={classes.successMessage}>
                {assigningSuccess}
              </Typography>
            )}
          </>
          }

          {whatToAssign === "District" &&
          <>
            <h3>Step 2: Search for and select the corresponding district you&apos;d like to assign:</h3>
            <Autocomplete
              id="user-autocomplete-select"
              options={districts}
              value={district}
              openOnFocus
              onChange={(e, district) => {
                setDistrict(district);
              }}
              getOptionLabel={(option) => `${option.userId} - ${option.code}`}
              style={{ width: 400 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select District"
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
                    <Typography>
                      Current user ID associated: {option.userId}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            />
            {district && user && (
            <>
              <h3>Step 3: Confirm assigning of district</h3>
              <Button
                className={classes.addButton}
                type="button"
                onClick={handleAddDistrict}
                disabled={user === null || district === null || assigningDistrict}
                variant="contained"
                color="primary"
              >
                Assign District
                {assigningDistrict && (
                  <Fade
                    in={assigningDistrict}
                    style={{
                      transitionDelay: assigningDistrict ? '800ms' : '0ms',
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
            )}
            {assigningDistrictError && <Typography color="error">{assigningDistrictError}</Typography>}
            {assigningDistrictSuccess && (
              <Typography className={classes.successMessage}>
                {assigningDistrictSuccess}
              </Typography>
            )}
          </>
          }
        </div>
      </div>
    </section>
  );
};

export default AssignRolesAndDistrictsPage;
