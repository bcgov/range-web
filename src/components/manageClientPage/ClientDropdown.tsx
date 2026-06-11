import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { CircularProgress, TextField, Typography, Grid } from '@material-ui/core';
import { throttle } from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import * as API from '../../constants/api';
import { axios, getAuthHeaderConfig } from '../../utils';

interface ClientOption {
  clientNumber: string;
  name: string;
  locationCodes: string[];
}

interface ClientDropdownProps {
  onChange: (client: ClientOption | null) => void;
  value: ClientOption | null;
}

function ClientDropdown({ onChange, value }: ClientDropdownProps) {
  const [inputValue, setInputValue] = useState('');

  const {
    data: clients = [],
    error,
    isValidating,
  } = useSWR<ClientOption[]>(
    `${API.SEARCH_CLIENTS}/?term=${inputValue}&groupByClientNumber=true`,
    (key: string) => axios.get(key, getAuthHeaderConfig()).then((res: any) => res.data),
    {
      revalidateOnFocus: false,
    },
  );

  const debouncedSetInputValue = useMemo(() => throttle(setInputValue, 300), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetInputValue(event.target.value);
  };

  if (error) {
    return <div>Error fetching clients: {JSON.stringify(error)}</div>;
  }

  return (
    <Autocomplete
      id="client-autocomplete-select"
      options={clients}
      loading={isValidating}
      getOptionLabel={(option: ClientOption) => option.name}
      openOnFocus
      includeInputInList
      style={{ flexGrow: 1 }}
      onChange={(_e: any, newValue: ClientOption | null) => {
        onChange(newValue);
      }}
      clearOnEscape
      value={value}
      renderInput={(params: any) => (
        <TextField
          {...params}
          label="Select client"
          variant="outlined"
          onChange={handleChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isValidating ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(client: ClientOption) => {
        return (
          <Grid container alignItems="center">
            <Grid item xs>
              {client.name}

              <Typography variant="body2" color="textSecondary">
                Client # {client.clientNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Loc #s {client.locationCodes.join(', ')}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default ClientDropdown;
