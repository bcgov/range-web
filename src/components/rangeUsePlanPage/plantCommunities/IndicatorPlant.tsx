import React, { useState, useRef } from 'react';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { STUBBLE_HEIGHT } from '../../../constants/fields';
import { MuiIcon } from '../../common';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import DecimalField from '../../common/form/DecimalField';
import HelpfulDropdown from '../../common/form/HelpfulDropdown';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';

interface IndicatorPlantProps {
  plant: any;
  namespace: string;
  valueType: string;
  onDelete: () => void;
  formik: any;
}

function IndicatorPlant({ plant, namespace, valueType, onDelete, formik }: IndicatorPlantProps) {
  const references = useReferences() as any;

  const species = references[REFERENCE_KEY.PLANT_SPECIES].filter((s: any) => !s.isShrubUse) || [];

  const otherSpecies = species.find((s: any) => s.name === 'Other');
  const [otherType, setOtherType] = useState({
    key: otherSpecies?.id,
    value: otherSpecies?.id,
    text: plant?.name || otherSpecies?.name || 'Other',
  });

  const options = species
    .map((s: any) => ({
      key: s.id,
      value: s.id,
      text: s.name,
    }))
    .concat(otherType)
    .filter((o: any) => o.text !== 'Other');

  const onAddItem = (_e: any, { value }: any) => {
    setOtherType({
      ...otherType,
      text: value,
    });

    formik.setFieldValue(`${namespace}.plantSpeciesId`, otherType.value);
    formik.setFieldValue(`${namespace}.name`, value);
  };

  const valueInputRef = useRef<any>(null);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Grid container key={plant.id} alignItems="center" spacing={1}>
      <Grid item xs={11}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <PermissionsField
              permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
              name={`${namespace}.plantSpeciesId`}
              component={HelpfulDropdown}
              help="To select a value, start typing. If a predefined option doesn't exist, you can provide your own value"
              placeholder="Indicator Plant"
              options={options}
              displayValue={
                options.find((o: any) => o.key === plant.plantSpeciesId)
                  ? options.find((o: any) => o.key === plant.plantSpeciesId).text
                  : ''
              }
              fieldProps={{ inline: true, fluid: true }}
              inputProps={{
                search: true,
                allowAdditions: true,
                additionLabel: 'Other: ',
                onAddItem,
                selectOnBlur: true,
                onKeyDown: (e: any) => {
                  if (e.keyCode === 13) {
                    valueInputRef.current?.focus();
                  }
                },
                onChange: (_e: any, { value }: any) => {
                  if (typeof value !== 'string') {
                    const plantValue = species.find((s: any) => s.id === value)?.[valueType];
                    if (plantValue) {
                      formik.setFieldValue(`${namespace}.value`, plantValue);
                    }
                  }
                },
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <PermissionsField
              permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
              name={`${namespace}.value`}
              component={DecimalField}
              displayValue={plant.value}
              inputProps={{
                ref: valueInputRef,
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        <IfEditable permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
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
                onDelete();
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </IfEditable>
      </Grid>
    </Grid>
  );
}

export default IndicatorPlant;
