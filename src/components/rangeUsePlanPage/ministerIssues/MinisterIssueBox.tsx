import React, { useState } from 'react';
import uuid from 'uuid-v4';
import { CollapsibleBox, MuiIcon } from '../../common';
import { NOT_PROVIDED, ACTION_NOTE, IDENTIFIED_BY_MINISTER_TOGGLE_TIP } from '../../../constants/strings';
import { oxfordComma } from '../../../utils';
import MinisterIssueAction from './MinisterIssueAction';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { MINISTER_ISSUES } from '../../../constants/fields';
import { connect, getIn, FieldArray , useField } from 'formik';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import AddMinisterIssueActionButton from './AddMinisterIssueActionButton';
import moment from 'moment';
import { deleteMinisterIssueAction } from '../../../api';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import useConfirm from '../../../providers/ConfrimationModalProvider';

function FormikSelect(props: any) {
  const { options, inputProps, label } = props;
  const [field, meta] = useField(props.name);
  const multiple = inputProps?.multiple;
  const value = multiple ? field.value || [] : field.value ?? '';
  return (
    <TextField
      select
      {...field}
      label={label}
      value={value}
      onChange={(e) => {
        const val = multiple ? (e.target.value as unknown as string[]).filter(Boolean) : e.target.value;
        field.onChange({ target: { name: props.name, value: val } });
      }}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      size="small"
      SelectProps={multiple ? { multiple: true } : undefined}
    >
      {options.map((opt: any) => (
        <MenuItem key={opt.key || opt.value} value={opt.value}>
          {opt.text || opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

function FieldCheckbox(props: any) {
  const { name, label, displayValue, inputProps } = props;
  const [field] = useField(name);
  const showReadOnly = !!displayValue && !field.value;
  const checked = showReadOnly ? !!displayValue : !!field.value;
  return <FormControlLabel control={<MuiCheckbox checked={checked} {...field} {...inputProps} />} label={label} />;
}

function TextAreaField(props: any) {
  const { name, inputProps, label, displayValue } = props;
  const [field, meta] = useField(name);
  const showReadOnly = !!displayValue && !meta.value;
  if (showReadOnly) {
    return <TextField label={label} value={displayValue} fullWidth disabled multiline minRows={3} />;
  }
  return (
    <TextField
      {...field}
      {...inputProps}
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      multiline
      minRows={3}
    />
  );
}

interface MinisterIssueBoxProps {
  issue: any;
  ministerIssueIndex: number;
  activeMinisterIssueIndex: number;
  onMinisterIssueClicked: (index: number) => () => void;
  namespace: string;
  formik?: any;
  onDelete: () => void;
}

function MinisterIssueBox({
  issue,
  ministerIssueIndex,
  activeMinisterIssueIndex,
  onMinisterIssueClicked,
  namespace,
  formik,
  onDelete,
}: MinisterIssueBoxProps) {
  const confirm = useConfirm()!;

  const allPastures = getIn(formik.values, 'pastures') || [];
  const pasturesOptions = allPastures.map((pasture: any, index: number) => ({
    value: pasture.id,
    text: pasture.name || `Unnamed pasture ${index + 1}`,
    key: pasture.id,
  }));

  const types = (useReferences() as any)[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || [];
  const typeOptions = types.map((type: any) => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id,
  }));

  const { detail, objective, pastures = [], identified, ministerIssueActions = [], issueTypeId } = issue;
  const isError = !!getIn(formik.errors, namespace);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <CollapsibleBox
      contentIndex={ministerIssueIndex}
      activeContentIndex={activeMinisterIssueIndex}
      onContentClicked={onMinisterIssueClicked}
      error={isError}
      header={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <MuiIcon name="warning sign" style={{ marginRight: '7px' }} />
          <span style={{ marginRight: 10 }}>Issue Type:</span>
          <PermissionsField
            permission={ministerIssueIndex !== activeMinisterIssueIndex ? '' : MINISTER_ISSUES.TYPE}
            name={`${namespace}.issueTypeId`}
            component={FormikSelect}
            options={typeOptions}
            displayValue={
              types.find((t: any) => t.id === issueTypeId) ? types.find((t: any) => t.id === issueTypeId).name : ''
            }
            fast
            fieldProps={{ required: true }}
          />
        </div>
      }
      headerRight={
        <>
          <IfEditable permission={MINISTER_ISSUES.TYPE}>
            <div className="rup__missue__identified">
              {'Identified: '}
              {identified ? (
                <MuiIcon name="check circle" color="green" />
              ) : (
                <MuiIcon name="remove circle" color="red" />
              )}
            </div>
            <IconButton
              className="rup__pasture__actions"
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                setMenuAnchorEl(e.currentTarget);
              }}
              size="small"
            >
              <MuiIcon name="ellipsis vertical" />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={!!menuAnchorEl}
              onClose={() => setMenuAnchorEl(null)}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setMenuAnchorEl(null);
              }}
            >
              <MenuItem
                onClick={() => {
                  setMenuAnchorEl(null);
                  onDelete();
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </IfEditable>
        </>
      }
      collapsibleContent={
        <>
          <PermissionsField
            name={`${namespace}.identified`}
            permission={MINISTER_ISSUES.IDENTIFIED}
            component={FieldCheckbox}
            displayValue={identified}
            label="Identified by Minister"
            tip={IDENTIFIED_BY_MINISTER_TOGGLE_TIP}
            inputProps={{
              toggle: true,
            }}
            fast
            fieldProps={{ required: true }}
          />
          <PermissionsField
            name={`${namespace}.pastures`}
            permission={MINISTER_ISSUES.PASTURES}
            component={FormikSelect}
            options={pasturesOptions}
            displayValue={oxfordComma(
              pastures.map((pasture: any) =>
                allPastures.find((p: any) => p.id === pasture)
                  ? allPastures.find((p: any) => p.id === pasture).name
                  : '',
              ),
            )}
            label="Pastures"
            inputProps={{
              multiple: true,
              search: true,
            }}
            fast
          />
          <PermissionsField
            permission={MINISTER_ISSUES.DETAIL}
            name={`${namespace}.detail`}
            label="Details"
            component={TextAreaField}
            displayValue={detail}
            fast
            inputProps={{
              placeholder:
                'Accurate description of the issue including WHAT and WHERE the issue is and, if relevant, the TIMING of the issue',
            }}
            fieldProps={{ required: true }}
          />
          <PermissionsField
            permission={MINISTER_ISSUES.OBJECTIVE}
            name={`${namespace}.objective`}
            label="Objective"
            component={TextAreaField}
            displayValue={objective}
            fast
            inputProps={{
              placeholder:
                'Description of the conditions that will exist when the issue has been resolved (desired state).',
            }}
            fieldProps={{ required: true }}
          />

          <FieldArray
            name={`${namespace}.ministerIssueActions`}
            validateOnChange={false}
            render={({ push, remove }) => (
              <>
                <div className="text-field__label" style={{ marginBottom: 10 }}>
                  Actions
                </div>

                <IfEditable permission={MINISTER_ISSUES.ACTIONS.NAME}>
                  <AddMinisterIssueActionButton
                    onSubmit={(action: any) =>
                      push({
                        actionTypeId: action.id,
                        detail: '',
                        other: action.other,
                        noGrazeStartMonth: moment().month() + 1,
                        noGrazeStartDay: moment().date(),
                        noGrazeEndMonth: moment().month() + 1,
                        noGrazeEndDay: moment().date(),
                        id: uuid(),
                      })
                    }
                  />
                </IfEditable>
                {ministerIssueActions.map((action: any, i: number) => (
                  <MinisterIssueAction
                    key={action.id}
                    namespace={`${namespace}.ministerIssueActions.${i}`}
                    onDelete={async () => {
                      const choice = await confirm({
                        titleText: 'Delete Action',
                        contentText: 'Are you sure you want to delete this action?',
                      });
                      if (!choice) return;
                      const act = ministerIssueActions[i];
                      if (!uuid.isUUID(act.id)) {
                        await deleteMinisterIssueAction(issue.planId, issue.id, act.id);
                      }
                      remove(i);
                    }}
                    {...action}
                  />
                ))}
                <div className="text-field__text">{ministerIssueActions.length === 0 ? NOT_PROVIDED : ACTION_NOTE}</div>
              </>
            )}
          />
        </>
      }
    />
  );
}

export default connect(MinisterIssueBox);
