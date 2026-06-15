import React, { useState, useCallback } from 'react';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { PASTURES } from '../../../constants/fields';
import { CollapsibleBox, MuiIcon } from '../../common';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextFieldMui from '@mui/material/TextField';
import * as strings from '../../../constants/strings';
import { IMAGE_SRC } from '../../../constants/variables';
import PlantCommunities from '../plantCommunities';
import { getIn, connect } from 'formik';
import PercentField from '../../common/form/PercentField';
import InputModal from '../../common/InputModal';
import MultiParagraphDisplay from '../../common/MultiParagraphDisplay';

function TextAreaField(props: any) {
  const { name, inputProps, label, displayValue } = props;
  const [field, meta] = require('formik').useField(name);
  const showReadOnly = !!displayValue && !meta.value;
  if (showReadOnly) {
    return <TextFieldMui label={label} value={displayValue} fullWidth disabled multiline minRows={3} />;
  }
  return (
    <TextFieldMui
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

interface PastureData {
  id: string | number;
  name: string;
  allowableAum?: number;
  pldPercent?: number;
  graceDays?: number;
  notes?: string;
  plantCommunities?: any[];
  planId?: string | number;
}

interface PastureBoxProps {
  pasture: PastureData;
  index: number;
  activeIndex: number;
  onClick: (index: number) => void;
  onCopy: () => void;
  onDelete: () => void;
  namespace: string;
  formik?: any;
  titleText: string;
  isGrazingSchedule: boolean;
}

function PastureBox({
  pasture,
  index,
  activeIndex,
  onClick,
  onCopy,
  onDelete,
  namespace,
  formik,
  titleText,
  isGrazingSchedule,
}: PastureBoxProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const isError = !!getIn(formik.errors, namespace);

  const handleMenuOpen = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  }, []);
  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  return (
    <>
      <CollapsibleBox
        key={pasture.id}
        contentIndex={index}
        activeContentIndex={activeIndex}
        onContentClick={() => onClick(index)}
        error={isError}
        header={
          <div className="rup__pasture">
            <div className="rup__pasture__title">
              <div style={{ width: '30px' }}>
                {isError ? <MuiIcon name="warning sign" /> : <img src={IMAGE_SRC.PASTURE_ICON} alt="pasture icon" />}
              </div>
              {titleText}: {pasture.name}
            </div>

            <IfEditable permission={PASTURES.NAME}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {activeIndex === index && (
                  <MuiIcon
                    name="edit"
                    onClick={(e: React.MouseEvent) => {
                      setModalOpen(true);
                      e.stopPropagation();
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                <IconButton onClick={handleMenuOpen} size="small">
                  <MuiIcon name="ellipsis vertical" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={!!menuAnchorEl}
                  onClose={handleMenuClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuClose();
                  }}
                >
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy();
                    }}
                  >
                    Copy
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </div>
            </IfEditable>
          </div>
        }
        collapsibleContent={
          <>
            <div className="rup__row">
              {isGrazingSchedule && (
                <div className="rup__cell-4">
                  <PermissionsField
                    name={`${namespace}.allowableAum`}
                    permission={PASTURES.ALLOWABLE_AUMS}
                    displayValue={pasture.allowableAum}
                    label={strings.ALLOWABLE_AUMS}
                    tip={strings.ALLOWABLE_AUMS_TIP}
                    fast
                    inputProps={{
                      placeholder: 'Approved maximum AUM allocation, if applicable',
                    }}
                  />
                </div>
              )}
              {isGrazingSchedule && (
                <div className="rup__cell-4">
                  <PermissionsField
                    name={`${namespace}.pldPercent`}
                    permission={PASTURES.PLD}
                    component={PercentField}
                    displayValue={(pasture.pldPercent || 0) * 100 + '%'}
                    label={strings.PRIVATE_LAND_DEDUCTION}
                    tip={strings.PRIVATE_LAND_DEDUCTION_TIP}
                    inputProps={{
                      type: 'number',
                      placeholder: 'Percentage of use occuring on private land',
                    }}
                    fast
                  />
                </div>
              )}
              {isGrazingSchedule && (
                <div className="rup__cell-4">
                  <PermissionsField
                    name={`${namespace}.graceDays`}
                    permission={PASTURES.GRACE_DAYS}
                    displayValue={pasture.graceDays}
                    label={strings.GRACE_DAYS}
                    fast
                    inputProps={{
                      placeholder:
                        'Acceptable +/- days for livestock movement. Can be tailored by staff in schedule rows.',
                    }}
                  />
                </div>
              )}
            </div>
            <PermissionsField
              name={`${namespace}.notes`}
              permission={PASTURES.NOTES}
              displayValue={pasture.notes}
              component={TextAreaField}
              displayComponent={MultiParagraphDisplay}
              label={`${titleText} Notes (non legal content)`}
              fluid
              fast
              inputProps={{
                placeholder: `${titleText} specific information (ie. not schedule, plant community or Minister's Issue specific). Ex. relevant history or topographical considerations.`,
              }}
            />

            <PlantCommunities
              plantCommunities={pasture.plantCommunities || []}
              namespace={namespace}
              planId={pasture.planId}
              pastureId={pasture.id}
            />
          </>
        }
      />
      <InputModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(name: string) => {
          formik.setFieldValue(`${namespace}.name`, name);
          setModalOpen(false);
        }}
        title={`Edit ${titleText} name`}
        placeholder={`${titleText} name`}
      />
    </>
  );
}

export default connect(
  React.memo(
    PastureBox,
    (prevProps: PastureBoxProps, nextProps: PastureBoxProps) =>
      prevProps.pasture === nextProps.pasture && prevProps.activeIndex === nextProps.activeIndex,
  ),
);
