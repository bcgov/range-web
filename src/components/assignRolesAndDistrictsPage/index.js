import React, { useState } from 'react';
import useSWR from 'swr';
import {
  CircularProgress,
  TextField,
  Grid,
  Typography,
  makeStyles,
  // Button,
  // Fade,
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
// import { assignRole, assignDistricts } from '../../api';

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
  } = useSWR(`${API.GET_USERS}/?orderCId=desc`, (key) =>
    axios.get(key, getAuthHeaderConfig()).then((res) => {
      return res.data;
    }),
  );
  const { data: roles } = useSWR(`${API.GET_ROLES}`, (key) =>
    axios.get(key, getAuthHeaderConfig()).then((res) => {
      return res.data;
    }),
  );
  const { data: districts } = useSWR(`${API.GET_DISTRICTS}`, (key) =>
    axios.get(key, getAuthHeaderConfig()).then((res) => {
      return res.data;
    }),
  );

  // const handleAddRole = async () => {
  //   setAssigningRole(true);
  //   setAssigningError(null);
  //   setAssigningSuccess(null);
  //   try {
  //     await assignRole(user.id, role.id);
  //     setAssigningSuccess('Role assigned to account successfully');
  //   } catch (e) {
  //     setAssigningError(`Error assigning role to account: ${e.message ?? e?.data?.error}`);
  //   } finally {
  //     setAssigningRole(false);
  //   }
  // }

  // const handleAddDistricts = async () => {
  //   setAssigningDistricts(true);
  //   setAssigningDistrictsError(null);
  //   setAssigningDistrictsSuccess(null);
  //   try {
  //     await assignDistricts(user.id, selectedDistricts.map((district) => district.id));
  //     setAssigningDistrictsSuccess('Districts assigned to account successfully');
  //   } catch (e) {
  //     setAssigningDistrictsError(`Error assigning districts to account: ${e.message ?? e?.data?.error}`);
  //   } finally {
  //     setAssigningDistricts(false);
  //   }
  // }

  const pullRoleAndDistrict = (user) => {
    // Role
    setRole(getUserRoleObj(user));

    // District
    axios.get(`${API.GET_DISTRICTS}/${user.id}`, getAuthHeaderConfig()).then((res) => {
      setSelectedDistricts([...res.data]);
      return res.data
    })

  }

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  // const [assigningRole, setAssigningRole] = useState(false);
  // const [assigningError, setAssigningError] = useState(null);
  // const [assigningSuccess, setAssigningSuccess] = useState(null);
  // const [assigningDistricts, setAssigningDistricts] = useState(false);
  // const [assigningDistrictsError, setAssigningDistrictsError] = useState(null);
  // const [assigningDistrictsSuccess, setAssigningDistrictsSuccess] = useState(null);


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
              {assigningError && (
                <Typography color="error">{assigningError}</Typography>
              )}
              {assigningSuccess && (
                <Typography className={classes.successMessage}>
                  {assigningSuccess}
                </Typography>
              )}
            </>
          )}

          {whatToAssign === 'District' && (
            <>
              <h3>
                Step 2: Search for and select the corresponding districts
                you&apos;d like to assign:
              </h3>
              <Autocomplete
                id="user-autocomplete-select"
                multiple
                options={districts}
                // value={district}
                openOnFocus
                onChange={(e, districts) => {
                  setSelectedDistricts(districts);
                }}
                getOptionLabel={(option) => `${option.userId} - ${option.code}`}
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
                      <Typography>{option.description}</Typography>
                      <Typography>
                        Current user ID associated: {option.userId}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
            />

            {/* Districts */}
            <Autocomplete
              id="user-autocomplete-select"
              multiple
              options={districts}
              value={selectedDistricts}
              openOnFocus
              onChange={(e, districts) => {
                setSelectedDistricts(districts);
              }}
              getOptionLabel={(option) => `${option.userId} - ${option.code}`}
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
                    <Typography>
                      Current user ID associated: {option.userId}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            />
          </>}

        </div>
      </div>
    </section>
  );
};

export default AssignRolesAndDistrictsPage;
