import React, { useMemo, useState } from 'react'
import useSWR from 'swr'
import {
  CircularProgress,
  TextField,
  Typography,
  Grid
} from '@material-ui/core'
import { throttle } from 'lodash'
import { Autocomplete } from '@material-ui/lab'
import * as API from '../../constants/api'
import { axios, getAuthHeaderConfig } from '../../utils'

const ClientDropdown = ({ onChange, value }) => {
  const [inputValue, setInputValue] = useState('')

  const { data: clients = [], error, isValidating } = useSWR(
    `${API.SEARCH_CLIENTS}/?term=${inputValue}`,
    key => axios.get(key, getAuthHeaderConfig()).then(res => res.data),
    {
      revalidateOnFocus: false
    }
  )

  const debouncedSetInputValue = useMemo(() => throttle(setInputValue, 300), [])

  const handleChange = event => {
    debouncedSetInputValue(event.target.value)
  }

  if (error) {
    return <div>Error fetching clients: {JSON.stringify(error)}</div>
  }

  return (
    <Autocomplete
      id="client-autocomplete-select"
      options={clients}
      loading={isValidating}
      getOptionLabel={option => option.name}
      openOnFocus
      includeInputInList
      style={{ flexGrow: 1 }}
      onChange={(e, newValue) => {
        onChange(newValue)
      }}
      clearOnEscape
      value={value}
      renderInput={params => (
        <TextField
          {...params}
          label="Select client"
          variant="outlined"
          onChange={handleChange}
          multiple={false}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isValidating ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
      renderOption={client => {
        return (
          <Grid container alignItems="center">
            <Grid item xs>
              {client.name}

              <Typography variant="body2" color="textSecondary">
                Client # {client.clientNumber}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Loc # {client.locationCode}
              </Typography>
            </Grid>
          </Grid>
        )
      }}
    />
  )
}

export default ClientDropdown
