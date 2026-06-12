import React, { useState } from 'react';
import { useField , connect } from 'formik';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { oxfordComma } from '../../../../utils';
import { MONITORING_AREAS } from '../../../../constants/fields';
import { MONITOING_AREA_PURPOSE_TIP } from '../../../../constants/strings';
import PermissionsField, { IfEditable } from '../../../common/PermissionsField';
import { REFERENCE_KEY } from '../../../../constants/variables';
import { useReferences } from '../../../../providers/ReferencesProvider';
import LocationButton from '../../../common/LocationButton';
import InputModal from '../../../common/InputModal';
import { MuiIcon } from '../../../common';
import useConfirm from '../../../../providers/ConfrimationModalProvider';

function FormikSelect(props: any) {
  const { options, inputProps, label } = props;
  const [field, meta] = useField(props.name);
  const multiple = inputProps?.multiple;
  const value = multiple ? field.value || [] : field.value;
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

function TextAreaField(props: any) {
  const { name, inputProps, label, displayValue } = props;
  const [field, meta] = useField(name);
  const showReadOnly = !!displayValue && !meta.value;
  if (showReadOnly) {
    return <TextField label={label} value={displayValue} fullWidth disabled multiline minRows={3} />;
  }
  const placeholder = inputProps?.placeholder;
  return (
    <TextField
      {...field}
      label={label}
      placeholder={placeholder}
      error={meta.touched && !!meta.error}
      helperText={meta.touched ? meta.error : undefined}
      fullWidth
      multiline
      minRows={3}
    />
  );
}

interface MonitoringAreaBoxProps {
  monitoringArea: any;
  namespace: string;
  formik?: any;
  onRemove: () => void;
  onCopy: () => void;
}

function MonitoringAreaBox({ monitoringArea, namespace, formik, onRemove, onCopy }: MonitoringAreaBoxProps) {
  const { latitude, location, longitude, name, purposeTypeIds, rangelandHealthId } = monitoringArea;

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const confirm = useConfirm()!;

  const references = useReferences() as any;

  const rangelandHealthTypes = references[REFERENCE_KEY.MONITORING_AREA_HEALTH];
  const rangelandHealthOptions = rangelandHealthTypes.map((type: any) => ({
    key: type.id,
    value: type.id,
    text: type.name,
  }));

  const purposeTypes = references[REFERENCE_KEY.MONITORING_AREA_PURPOSE_TYPE];
  const purposeOptions = purposeTypes.map((type: any) => ({
    key: type.id,
    value: type.id,
    text: type.name,
  }));

  return (
    <div className="rup__plant-community__m-area__box">
      <div className="rup__plant-community__m-area__header">
        <span>
          <MuiIcon name="map marker alternate" />
          Monitoring Area: {name}
        </span>

        <div>
          <IfEditable permission={MONITORING_AREAS.NAME}>
            <IconButton
              onClick={(e: any) => {
                e.stopPropagation();
                setEditModalOpen(true);
              }}
              size="small"
            >
              <MuiIcon name="edit" />
            </IconButton>
          </IfEditable>

          <IconButton
            onClick={(e) => {
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
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchorEl(null);
            }}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchorEl(null);
                onCopy();
              }}
            >
              Copy
            </MenuItem>
            <MenuItem
              onClick={async () => {
                setMenuAnchorEl(null);
                const choice = await confirm({
                  titleText: 'Delete Monitoring Area',
                  contentText: 'Are you sure you want to delete this monitoring area?',
                });
                if (choice) {
                  onRemove();
                }
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </div>
      </div>

      <PermissionsField
        name={`${namespace}.location`}
        permission={MONITORING_AREAS.LOCATION}
        component={TextAreaField}
        displayValue={location}
        label="Location"
        inputProps={{
          placeholder: 'Descriptive',
        }}
        fieldProps={{ required: true }}
      />

      <PermissionsField
        name={`${namespace}.rangelandHealthId`}
        permission={MONITORING_AREAS.RANGELAND_HEALTH}
        component={FormikSelect}
        options={rangelandHealthOptions}
        displayValue={rangelandHealthTypes.find((r: any) => r.id === rangelandHealthId)?.name ?? ''}
        label="Rangeland Health"
      />

      <PermissionsField
        name={`${namespace}.purposeTypeIds`}
        permission={MONITORING_AREAS.PURPOSE}
        tip={MONITOING_AREA_PURPOSE_TIP}
        component={FormikSelect}
        options={purposeOptions}
        fieldProps={{ required: true }}
        inputProps={{
          multiple: true,
        }}
        displayValue={oxfordComma(
          purposeTypeIds.map((purposeTypeId: any) => purposeTypes.find((p: any) => p.id === purposeTypeId)?.name),
        )}
        label="Purposes"
      />

      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={5}>
          <PermissionsField
            name={`${namespace}.latitude`}
            permission={MONITORING_AREAS.LATITUDE}
            displayValue={latitude}
            label="Latitude"
            inputProps={{
              type: 'number',
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <PermissionsField
            name={`${namespace}.longitude`}
            permission={MONITORING_AREAS.LONGTITUDE}
            displayValue={longitude}
            label="Longitude"
            inputProps={{
              type: 'number',
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <IfEditable permission={MONITORING_AREAS.LATITUDE}>
            <LocationButton
              onLocation={({ coords: { longitude, latitude } }: any) => {
                formik.setFieldValue(`${namespace}.longitude`, longitude);
                formik.setFieldValue(`${namespace}.latitude`, latitude);
              }}
            >
              <MuiIcon name="compass" />
              Get Location
            </LocationButton>
          </IfEditable>
        </Grid>
      </Grid>

      <InputModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={(name: string) => {
          formik.setFieldValue(`${namespace}.name`, name);
          setEditModalOpen(false);
        }}
        title="Edit monitoring area name"
        placeholder="Monitoring area name"
      />
    </div>
  );
}

export default connect(MonitoringAreaBox);
