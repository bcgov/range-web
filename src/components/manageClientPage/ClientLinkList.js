import React, { useState } from 'react'
import useSWR from 'swr'
import {
  CircularProgress,
  List,
  Paper,
  Typography,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  makeStyles,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Toolbar,
  Fade
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import * as API from '../../constants/api'
import { axios, getAuthHeaderConfig, getUserFullName } from '../../utils'
import { useToast } from '../../providers/ToastProvider'
import ClientDropdown from './ClientDropdown'
import { createClientLink, deleteClientLink } from '../../api'
import { green } from '@material-ui/core/colors'
import { useEffect } from 'react'

const useStyles = makeStyles(theme => ({
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  list: {
    marginBottom: theme.spacing(2)
  },
  actionSection: {
    padding: theme.spacing(2)
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  addButton: {
    marginLeft: theme.spacing(2)
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  toolbarTitle: { flex: '1 1 100%' },
  noClients: {
    padding: theme.spacing(2),
    width: '100%',
    textAlign: 'center'
  }
}))

const ClientLinkList = ({ userId }) => {
  const classes = useStyles()
  const [selectedClient, setSelectedClient] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [clientToDelete, setClientToDelete] = useState(false)
  const { errorToast } = useToast()

  const {
    data: user,
    error,
    isValidating,
    mutate
  } = useSWR(`${API.GET_USERS}/${userId}`, key =>
    axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )

  useEffect(() => {
    setCreateError(null)
    setSelectedClient(null)
  }, [userId])

  const handleCloseDialog = () => setClientToDelete(null)

  const handleAddClick = async () => {
    setIsCreating(true)
    setCreateError(null)
    try {
      await createClientLink(userId, selectedClient.id)

      mutate({
        ...user,
        clients: [...(user.clients ?? []), selectedClient]
      })

      setSelectedClient(null)
    } catch (e) {
      const errorMessage = `Error linking client: ${e.message ??
        e?.data?.error}`
      setCreateError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteClick = async client => {
    setIsDeleting(true)

    try {
      await deleteClientLink(userId, client.id)

      mutate({
        ...user,
        clients: (user.clients ?? []).filter(client => client.id !== client.id)
      })

      setClientToDelete(null)
    } catch (e) {
      const errorMessage = `Error removing client link: ${e.message ??
        e?.data?.error}`
      errorToast(errorMessage)
      console.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!userId) {
    return <Paper>Please select a user</Paper>
  }

  if (error) {
    return (
      <Paper>
        <div>Error fetching user: {error?.message ?? error?.data?.error}</div>
      </Paper>
    )
  }

  if (isValidating && !user)
    return (
      <Fade
        in={isValidating}
        style={{
          transitionDelay: isValidating ? '800ms' : '0ms'
        }}
        unmountOnExit>
        <CircularProgress className={classes.buttonProgress} size={24} />
      </Fade>
    )

  if (user) {
    return (
      <>
        <Paper className={classes.root}>
          <Toolbar className={classes.toolbar}>
            <Typography
              className={classes.toolbarTitle}
              variant="h6"
              id="tableTitle"
              component="div">
              Link clients
            </Typography>

            {isValidating && <CircularProgress size={24} />}
          </Toolbar>

          {!user && (
            <Typography component="p" color="textSecondary">
              Select a user
            </Typography>
          )}

          {user && (
            <List className={classes.list}>
              {user.clients?.map(client => (
                <div key={client.id}>
                  <ListItem key={client.id}>
                    <ListItemText
                      primary={client.name}
                      secondary={`Client # ${client.clientNumber} - ${client.locationCode}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => setClientToDelete(client)}>
                        <DeleteIcon disabled={isDeleting} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </div>
              ))}
              {(!user.clients || user.clients?.length === 0) && (
                <Typography
                  className={classes.noClients}
                  color="textSecondary"
                  component="div">
                  No clients linked
                </Typography>
              )}
            </List>
          )}

          <div className={classes.actionSection}>
            <div className={classes.actions}>
              <ClientDropdown
                onChange={client => {
                  setSelectedClient(client)
                  setCreateError(null)
                }}
                value={selectedClient}
              />

              <Button
                className={classes.addButton}
                type="button"
                onClick={handleAddClick}
                disabled={selectedClient === null || isCreating}
                variant="contained"
                color="primary">
                Add link
                {isCreating && (
                  <Fade
                    in={isCreating}
                    style={{
                      transitionDelay: isCreating ? '800ms' : '0ms'
                    }}
                    unmountOnExit>
                    <CircularProgress
                      className={classes.buttonProgress}
                      size={24}
                    />
                  </Fade>
                )}
              </Button>
            </div>
            {createError && (
              <Typography color="error">{createError}</Typography>
            )}
          </div>
        </Paper>

        <Dialog
          open={Boolean(clientToDelete)}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">Delete client link?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete the link between the user{' '}
              {getUserFullName(user)} ({user.email}) and the client{' '}
              {clientToDelete?.name} (Client #{clientToDelete?.clientNumber} -{' '}
              {clientToDelete?.locationCode})?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteClick(clientToDelete)}
              color="primary"
              autoFocus
              disabled={isDeleting}>
              Delete
              {isDeleting && (
                <Fade
                  in={isDeleting}
                  style={{
                    transitionDelay: isDeleting ? '800ms' : '0ms'
                  }}
                  unmountOnExit>
                  <CircularProgress
                    className={classes.buttonProgress}
                    size={24}
                  />
                </Fade>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }

  return null
}

export default ClientLinkList
