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
  // Paper,
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
import { assignRole } from '../../api';

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

const AssignRolesPage = () => {
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

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [assigningRole, setAssigningRole] = useState(false);
  const [assigningError, setAssigningError] = useState(null);
  const [assigningSuccess, setAssigningSuccess] = useState(null);

  return (
    <section className="manage-client">
      <Banner
        header={strings.ASSIGN_ROLES_BANNER_HEADER}
        content={strings.ASSIGN_ROLES_BANNER_CONTENT}
      />
      <div className="manage-client__content">
        <div className="manage-client__steps">
          <h3>
            Step 1: Select the user whose role you&apos;d like to link:
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
                      {getUserFullName(option)}
                      <Typography color="textSecondary">
                        {getUserRole(option)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDateToNow(option.lastLoginAt)}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              />
            </>
          )}
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
        </div>
      </div>
    </section>
  );
};

export default AssignRolesPage;
