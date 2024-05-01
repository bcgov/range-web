import React, { useState } from 'react';
import useSWR from 'swr';
import {
  CircularProgress,
  TextField,
  Grid,
  Typography,
  makeStyles,
  Button,
  Fade
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
} from '../../utils';
import { Banner } from '../common';
import { assignDistrict } from '../../api';

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

const AssignDistrictPage = () => {
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
    data: districts,
  } = useSWR(
    `${API.GET_DISTRICTS}`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => {
      console.log(res);
      return res.data
    }),
  );

  const handleAddDistrict = async () => {
    setAssigningDistrict(true);
    setAssigningError(null);
    setAssigningSuccess(null);
    try {
      await assignDistrict(user.id, district.id);
      setAssigningSuccess('District assigned to account successfully');
    } catch (e) {
      setAssigningError(`Error assigning district to account: ${e.message ?? e?.data?.error}`);
    } finally {
      setAssigningDistrict(false);
    }
  }

  const [user, setUser] = useState(null);
  const [district, setDistrict] = useState(null);
  const [assigningDistrict, setAssigningDistrict] = useState(false);
  const [assigningError, setAssigningError] = useState(null);
  const [assigningSuccess, setAssigningSuccess] = useState(null);

  return (
    <section className="manage-client">
      <Banner
        header={strings.ASSIGN_DISTRICT_BANNER_HEADER}
        content={strings.ASSIGN_DISTRICT_BANNER_CONTENT}
      />
      <div className="manage-client__content">
        <div className="manage-client__steps">
          <h3>
            Step 1: Search and select the user you&apos;d like to assign a district to:
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
                getOptionLabel={(option) => `${option.id} - ${getUserFullName(option)}`}
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
                      <Typography variant="body2" color="textSecondary">
                        {option.ssoId}
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

export default AssignDistrictPage;
