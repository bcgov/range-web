import React, { useState } from 'react';
import useSWR from 'swr';
import { CircularProgress, TextField, Grid, Typography, makeStyles, Paper } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import PersonIcon from '@material-ui/icons/Person';
import * as strings from '../../constants/strings';
import * as API from '../../constants/api';
import { axios, formatDateToNow, getAuthHeaderConfig, getUserFullName } from '../../utils';
import { Banner } from '../common';
import ClientLinkList from './ClientLinkList';

interface UserOption {
  id: number;
  email: string;
  ssoId?: string;
  givenName?: string;
  familyName?: string;
  lastLoginAt?: string;
  [key: string]: any;
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
}));

const ManageClientPage: React.FC = () => {
  const classes = useStyles();

  const {
    data: users,
    error,
    isValidating,
  } = useSWR<UserOption[]>(`${API.GET_USERS}/?orderCId=desc&excludeBy=username&exclude=idir`, (key: string) =>
    axios.get(key, getAuthHeaderConfig()).then((res: any) => res.data),
  );

  const [user, setUser] = useState<UserOption | null>(null);

  return (
    <section className="manage-client">
      <Banner header={strings.MANAGE_CLIENT_BANNER_HEADER} content={strings.MANAGE_CLIENT_BANNER_CONTENT} />
      <div className="manage-client__content">
        <div className="manage-client__steps">
          <h3>Step 1: Search and select the user (agreement holder) you&apos;d like to link:</h3>
          {error && (
            <Typography color="error">
              index.js Error occurred fetching user:{' '}
              {(error as any)?.message ?? (error as any)?.data?.error ?? JSON.stringify(error)}
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
                onChange={(_e: any, selectedUser: UserOption | null) => {
                  setUser(selectedUser);
                }}
                getOptionLabel={(option: UserOption) => `${getUserFullName(option)} (${option.ssoId || ''})`}
                filterOptions={(options: UserOption[], { inputValue }: { inputValue: string }) => {
                  const search = inputValue.trim().toLowerCase();
                  return options.filter((option) => {
                    const name = getUserFullName(option).toLowerCase();
                    const ssoId = String(option.ssoId || '').toLowerCase();
                    return name.includes(search) || ssoId.includes(search);
                  });
                }}
                getOptionSelected={(option: UserOption, value: UserOption) => option.id === value.id}
                style={{ width: 400 }}
                renderInput={(params: any) => <TextField {...params} label="Select user" variant="outlined" />}
                renderOption={(option: UserOption) => (
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
            </>
          )}
          <h3>Step 2: Search for and select the corresponding clients:</h3>
          {user ? (
            <ClientLinkList userId={user.id} />
          ) : (
            <Paper className={classes.noSelection}>
              <Typography color="textSecondary">Please select a user</Typography>
            </Paper>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManageClientPage;
