import React, { useEffect, useState } from 'react';
import * as API from '../../../constants/api';
import { Loading, PrimaryButton, MuiIcon } from '../../common';
import useSWR from 'swr';
import { getAuthHeaderConfig, axios, getUserFullName, formatDateFromServer } from '../../../utils';
import Autocomplete from '@mui/material/Autocomplete';
import PersonIcon from '@mui/icons-material/Person';
import Grid from '@mui/material/Grid';
import { Typography, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { RANGE_USE_PLAN } from '../../../constants/routes';

const fetcher = (key: string) => axios.get(key, getAuthHeaderConfig()).then((res: any) => res.data);

interface ManageAgentsPageProps {
  match: {
    params: {
      planId: string;
    };
  };
}

function ManageAgentsPage({ match }: ManageAgentsPageProps) {
  const [clientAgreements, setClientAgreements] = useState<any[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [errorSaving, setErrorSaving] = useState<any>(null);

  const { planId } = match.params;

  const { data, isValidating: isValidatingClients, error } = useSWR(API.GET_CLIENT_AGREEMENTS(planId), fetcher);

  const { data: users, isValidating: isValidatingUsers } = useSWR(
    `${API.GET_USERS}/?orderCId=desc&excludeBy=username&exclude=idir`,
    fetcher,
  );

  useEffect(() => {
    if (!clientAgreements) setClientAgreements(data);
  }, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    setHasSaved(false);
    try {
      for (const clientAgreement of clientAgreements!) {
        await axios.put(
          API.UPDATE_CLIENT_AGREEMENT(planId, clientAgreement.id),
          { agentId: clientAgreement.agent?.id ?? null },
          getAuthHeaderConfig(),
        );
      }
      setHasSaved(true);
    } catch (e: any) {
      setErrorSaving(e);
    }
    setIsSaving(false);
  };

  if (error) return <span>Error: {error?.message}</span>;

  if ((!clientAgreements && isValidatingClients) || (!users && isValidatingUsers)) return <Loading />;

  if (clientAgreements) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <div style={{ maxWidth: '70%', width: '100%' }}>
          <PrimaryButton as={Link} to={`${RANGE_USE_PLAN}/${planId}`}>
            <MuiIcon name="arrow left" />
            Back to RUP
          </PrimaryButton>
          <h1>Manage agents for {clientAgreements[0]?.agreementId}</h1>
          {clientAgreements.map((clientAgreement: any) => {
            const clientNumber = clientAgreement.client?.clientNumber;
            const linkedUser = users?.find((u: any) => u?.clientNumber === clientNumber);

            return (
              <div
                key={clientAgreement.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  marginBottom: 30,
                }}
              >
                <div>
                  <div>
                    {clientAgreement.client.name} {clientAgreement.client.clientNumber}-
                    {clientAgreement.client.locationCode}
                  </div>
                  {linkedUser && (
                    <Typography variant="body2" color="textSecondary" component="div">
                      {getUserFullName(linkedUser)}
                    </Typography>
                  )}
                </div>
                <div>
                  <Autocomplete
                    id={`user-autocomplete-select-${clientAgreement.id}`}
                    options={users}
                    value={clientAgreement.agent}
                    openOnFocus
                    onChange={(e: any, user: any) => {
                      setClientAgreements((c) =>
                        c!.map((ca: any) => (ca.id === clientAgreement.id ? { ...ca, agent: user } : ca)),
                      );
                    }}
                    getOptionLabel={(option: any) => `${getUserFullName(option)} (${option.ssoId || ''})`}
                    filterOptions={(options: any[], { inputValue }: any) => {
                      const search = inputValue.trim().toLowerCase();
                      return options.filter((option: any) => {
                        const name = getUserFullName(option).toLowerCase();
                        const ssoId = (option.ssoId || '').toLowerCase();
                        return name.includes(search) || ssoId.includes(search);
                      });
                    }}
                    isOptionEqualToValue={(option: any, val: any) => option.id === val.id}
                    style={{ width: 300 }}
                    renderInput={(params: any) => (
                      <TextField {...params} label="Select user" variant="outlined" sx={{ width: 600 }} />
                    )}
                    renderOption={(props: any, option: any) => {
                      const { key, ...liProps } = props;
                      return (
                        <Grid container alignItems="center" key={key} {...liProps}>
                          <Grid item>
                            <PersonIcon sx={{ color: 'text.secondary', mr: 2 }} />
                          </Grid>
                          <Grid item xs>
                            <Typography variant="body1" component="div">
                              {getUserFullName(option)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="div">
                              {option.email}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="div">
                              {option.ssoId}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="div">
                              Last Login: {formatDateFromServer(option.lastLoginAt)}
                            </Typography>
                          </Grid>
                        </Grid>
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {isSaving && <Loading />}
        <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
        {hasSaved && <span style={{ color: '#0a9600' }}>Successfully saved!</span>}
        {errorSaving && <span>Error: {errorSaving?.message}</span>}
      </div>
    );
  }

  return <Loading />;
}

export default ManageAgentsPage;
