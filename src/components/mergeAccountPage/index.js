import React, { useState } from 'react';
import useSWR from 'swr';
import {
  Button,
  CircularProgress,
  TextField,
  Grid,
  Typography,
  makeStyles,
  Fade,
} from '@material-ui/core';
import { DataGrid } from '@mui/x-data-grid';
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
import { mergeAccounts } from '../../api';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  progress: {
    marginLeft: theme.spacing(2),
  },
  mergeButton: {
    marginLeft: theme.spacing(2),
  },
  noSelection: {
    padding: theme.spacing(2),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  successMessage: {
    color: 'green',
  },
}));

const columns = [
  { field: 'ssoId', headerName: 'Id', width: 150 },
  { field: 'givenName', headerName: 'Given Name', width: 150 },
  { field: 'email', headerName: 'Email', width: 150 },
  { field: 'active', headerName: 'Active', width: 150 },
  { field: 'clientNumber', headerName: 'Client Number', width: 150 },
];
const MergeAccountPage = () => {
  const classes = useStyles();

  const [destinationAccount, setDestinationAccountId] = useState(null);
  const [sourceAccountIds, setSourceAccountIds] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeError, setMergeError] = useState(null);
  const [mergeSuccess, setMergeSuccess] = useState(null);

  const {
    data: users,
    error,
    isValidating,
  } = useSWR(
    `${API.GET_USERS}/?orderCId=desc&excludeBy=username&exclude=idir`,
    (key) => axios.get(key, getAuthHeaderConfig()).then((res) => res.data),
  );
  const handleMergeClick = async () => {
    setIsMerging(true);
    setMergeError(null);
    setMergeSuccess(null);
    try {
      await mergeAccounts(sourceAccountIds, destinationAccount.id);
      setMergeSuccess('Accounts merged successfully');
    } catch (e) {
      setMergeError(`Error merging accounts: ${e.message ?? e?.data?.error}`);
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <section className="merge-account">
      <Banner
        header={strings.MERGE_ACCOUNT}
        content={strings.MERGE_ACCOUNT_BANNER_CONTENT_LINE1}
        contentLine2={strings.MERGE_ACCOUNT_BANNER_CONTENT_LINE2}
      />
      <div className="merge-account__content">
        <div className="merge-account__steps">
          <h3>
            Step 1: Search and select the account (agreement holder) which
            you&apos;d like to move to a different account:
          </h3>
          {error && (
            <Typography color="error">
              Error occurred fetching user:{' '}
              {error?.message ?? error?.data?.error ?? JSON.stringify(error)}
            </Typography>
          )}
          {isValidating && !users && <CircularProgress />}
          {users && (
            <DataGrid
              rows={users}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              onRowSelectionModelChange={(selectionModel) => {
                console.log(destinationAccount);
                console.log(selectionModel);
                setSourceAccountIds(selectionModel);
              }}
            />
          )}
          <h3>Step 2: Search for and select the destination account:</h3>
          <div className={classes.actionSection}>
            <div className={classes.actions}>
              {users && (
                <Autocomplete
                  id="user-autocomplete-select"
                  options={users}
                  value={destinationAccount}
                  openOnFocus
                  onChange={(e, user) => {
                    setDestinationAccountId(user);
                  }}
                  getOptionLabel={(option) => getUserFullName(option)}
                  getOptionSelected={(option) =>
                    option.id === destinationAccount.id
                  }
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
                        <Typography variant="body2" color="textSecondary">
                          {option.email}
                        </Typography>
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
              )}
              <Button
                className={classes.mergeButton}
                type="button"
                onClick={handleMergeClick}
                disabled={
                  sourceAccountIds.length === 0 ||
                  destinationAccount === null ||
                  sourceAccountIds.indexOf(destinationAccount.id) != -1 ||
                  isMerging
                }
                variant="contained"
                color="primary"
              >
                Merge
                {isMerging && (
                  <Fade
                    in={isMerging}
                    style={{
                      transitionDelay: isMerging ? '800ms' : '0ms',
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
            </div>
            {mergeError && <Typography color="error">{mergeError}</Typography>}
            {mergeSuccess && (
              <Typography className={classes.successMessage}>
                {mergeSuccess}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MergeAccountPage;
