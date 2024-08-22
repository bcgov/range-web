import React, { useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  makeStyles,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextareaAutosize,
} from '@material-ui/core';
import * as strings from '../../constants/strings';
import * as API from '../../constants/api';
import { axios, getAuthHeaderConfig } from '../../utils';
import { Banner } from '../common';
import { updateEmailTemplate } from '../../api';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: 400,
  },
  noSelection: {
    padding: theme.spacing(2),
  },
  successMessage: {
    color: 'green',
  },
  gridRow: {
    marginTop: theme.spacing(2),
  },
}));

const EmailTemplatePage = () => {
  const classes = useStyles();
  const [emailTemplates, setEmailTemplates] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  async function getEmailTemplates() {
    const res = await axios.get(`${API.GET_EMAIL_TEMPLATE}`, getAuthHeaderConfig());
    setEmailTemplates(res.data);
    setSelectedTemplate(res.data[0]);
  }
  useEffect(() => {
    getEmailTemplates();
  }, []);

  const handleTemplateChaneg = async (event) => {
    if (emailTemplates) setSelectedTemplate(emailTemplates.find((element) => element.id === event.target.value));
  };
  const handleUpdateClick = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    try {
      await updateEmailTemplate(
        selectedTemplate.id,
        selectedTemplate.name,
        selectedTemplate.fromEmail,
        selectedTemplate.subject,
        selectedTemplate.body,
      );
      setUpdateSuccess('Template updated successfully');
    } catch (e) {
      setUpdateError(`Error updating temaplate: ${e.message ?? e?.data?.error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="email-template">
      <Banner header={strings.EMAIL_TEMPLATE} content={strings.UPDATE_EMAIL_TEMPLATE_BANNER_CONTENT} />
      <div className="email-template__content">
        {emailTemplates && selectedTemplate && (
          <Grid container direction="column">
            <Grid className={classes.gridRow}>
              <FormControl className={classes.formControl}>
                <InputLabel>Template Name</InputLabel>
                <Select value={selectedTemplate.id} onChange={handleTemplateChaneg}>
                  {emailTemplates.map((emailTemplate) => (
                    <MenuItem key={emailTemplate.id} value={emailTemplate.id}>
                      {emailTemplate.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid className={classes.gridRow}>
              <TextField
                label="From Email"
                variant="outlined"
                value={selectedTemplate.fromEmail}
                onChange={(event) =>
                  setSelectedTemplate({
                    ...selectedTemplate,
                    fromEmail: event.target.value,
                  })
                }
              />
            </Grid>
            <Grid className={classes.gridRow}>
              <TextField
                label="Subject"
                variant="outlined"
                value={selectedTemplate.subject}
                onChange={(event) => {
                  setSelectedTemplate({
                    ...selectedTemplate,
                    subject: event.target.value,
                  });
                }}
              />
            </Grid>
            <Grid className={classes.gridRow}>
              <TextareaAutosize
                placeholder="Email Body (HTML)"
                variant="outlined"
                minRows={10}
                value={selectedTemplate.body}
                onChange={(event) => {
                  setSelectedTemplate({
                    ...selectedTemplate,
                    body: event.target.value,
                  });
                }}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid className={classes.gridRow}>
              <Button
                className={classes.updateButton}
                type="button"
                onClick={handleUpdateClick}
                variant="contained"
                color="primary"
              >
                Update
                {isUpdating && (
                  <Fade
                    in={isUpdating}
                    style={{
                      transitionDelay: isUpdating ? '800ms' : '0ms',
                    }}
                    unmountOnExit
                  >
                    <CircularProgress className={classes.buttonProgress} size={24} />
                  </Fade>
                )}
              </Button>
            </Grid>
            {updateError && <Typography color="error">{updateError}</Typography>}
            {updateSuccess && <Typography className={classes.successMessage}>{updateSuccess}</Typography>}
          </Grid>
        )}
      </div>
    </section>
  );
};

export default EmailTemplatePage;
