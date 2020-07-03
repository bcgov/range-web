import React, { useEffect, useState } from 'react'
import * as API from '../../../constants/api'
import { Loading, PrimaryButton } from '../../common'
import useSWR from 'swr'
import { getAuthHeaderConfig, axios, getUserFullName } from '../../../utils'
import { Autocomplete } from '@material-ui/lab'
import PersonIcon from '@material-ui/icons/Person'
import { Grid } from 'semantic-ui-react'
import { Typography, TextField, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center'
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  },
  container: {
    maxWidth: 800,
    width: '100%'
  },
  autocomplete: {
    width: 400
  },
  autocompleteOption: {
    height: 100
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30
  }
}))

const fetcher = key =>
  axios.get(key, getAuthHeaderConfig()).then(res => res.data)

const ManageAgentsPage = ({ match }) => {
  const classes = useStyles()
  const [clientAgreements, setClientAgreements] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [errorSaving, setErrorSaving] = useState(null)

  const { planId } = match.params

  const { data, isValidating: isValidatingClients, error } = useSWR(
    API.GET_CLIENT_AGREEMENTS(planId),
    fetcher
  )

  const { data: users, isValidating: isValidatingUsers } = useSWR(
    `${API.GET_USERS}/?orderCId=desc&excludeBy=username&exclude=idir`,
    fetcher
  )

  useEffect(() => {
    if (!clientAgreements) {
      setClientAgreements(data)
    }
  }, [data])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      for (const clientAgreement of clientAgreements) {
        await axios.put(
          API.UPDATE_CLIENT_AGREEMENT(planId, clientAgreement.id),
          { agentId: clientAgreement.agent?.id ?? null },
          getAuthHeaderConfig()
        )
      }
    } catch (e) {
      setErrorSaving(e)
    }

    setIsSaving(false)
  }

  if (error) {
    return <span>Error: {error?.message}</span>
  }

  if (
    (!clientAgreements && isValidatingClients) ||
    (!users && isValidatingUsers)
  ) {
    return <Loading />
  }

  if (clientAgreements) {
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <h1>Manage agents</h1>
          {clientAgreements.map(clientAgreement => (
            <div key={clientAgreement.id} className={classes.row}>
              <div>
                {clientAgreement.client.name}{' '}
                {clientAgreement.client.clientNumber}-
                {clientAgreement.client.locationCode}
              </div>
              <div>
                <Autocomplete
                  id="user-autocomplete-select"
                  options={users}
                  value={clientAgreement.agent}
                  openOnFocus
                  onChange={(e, user) => {
                    setClientAgreements(c =>
                      c.map(ca =>
                        ca.id === clientAgreement.id
                          ? {
                              ...ca,
                              agent: user
                            }
                          : ca
                      )
                    )
                  }}
                  getOptionLabel={option => getUserFullName(option)}
                  getOptionSelected={option =>
                    option.id === clientAgreement.agentId
                  }
                  style={{ width: 300 }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Select user"
                      variant="outlined"
                      fullWidth
                      className={classes.autocomplete}
                    />
                  )}
                  renderOption={option => {
                    return (
                      <Grid
                        container
                        alignItems="center"
                        className={classes.autocompleteOption}>
                        <Grid item>
                          <PersonIcon className={classes.icon} />
                        </Grid>
                        <Grid item xs>
                          {getUserFullName(option)}

                          <Typography variant="body2" color="textSecondary">
                            {option.email}
                          </Typography>
                        </Grid>
                      </Grid>
                    )
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {isSaving && <Loading />}
        <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
        {errorSaving && <span>Error: {errorSaving?.message}</span>}
      </div>
    )
  }

  return <Loading />
}

export default ManageAgentsPage
