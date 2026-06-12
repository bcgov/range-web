import React, { useState } from 'react';
import uuid from 'uuid-v4';
import { PrimaryButton, InfoTip, MuiIcon } from '../../common';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { FieldArray } from 'formik';
import ManagementConsiderationRow from './ManagementConsiderationRow';
import { IfEditable } from '../../common/PermissionsField';
import * as strings from '../../../constants/strings';
import { MANAGEMENT_CONSIDERATIONS } from '../../../constants/fields';
import { deleteManagementConsideration } from '../../../api';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useConfirm from '../../../providers/ConfrimationModalProvider';

interface ManagementConsiderationsProps {
  planId: any;
  managementConsiderations: any[];
}

function ManagementConsiderations({ planId, managementConsiderations }: ManagementConsiderationsProps) {
  const references = useReferences();
  const considerTypes = (references as any)[REFERENCE_KEY.MANAGEMENT_CONSIDERATION_TYPE] || [];
  const considerTypeOptions = considerTypes.map((ct: any) => ({
    key: ct.id,
    value: ct.id,
    text: ct.name,
  }));

  const confirm = useConfirm()!;
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <FieldArray
      name={`managementConsiderations`}
      validateOnChange={false}
      render={({ push, remove }) => (
        <>
          <div className="rup__m-considerations">
            <div className="rup__popup-header">
              <div className="rup__content-title">{strings.MANAGEMENT_CONSIDERATIONS}</div>
              <InfoTip header={strings.MANAGEMENT_CONSIDERATIONS} content={strings.MANAGEMENT_CONSIDERATIONS_TIP} />
            </div>
            <div className="rup__divider" />

            <div className="rup__m-considerations__note">
              Content in this section is non-legal and is intended to provide additional information about management
              within the agreement area.
            </div>

            <div className="rup__m-considerations__box">
              {managementConsiderations.length === 0 ? (
                <div className="rup__m-considerations__no-content">No management considerations provided</div>
              ) : (
                managementConsiderations.map((managementConsideration, index) => (
                  <ManagementConsiderationRow
                    key={index}
                    managementConsideration={managementConsideration}
                    namespace={`managementConsiderations.${index}`}
                    onDelete={async () => {
                      const choice = await confirm({
                        titleText: 'Delete Management Consideration',
                        contentText: 'Are you sure you want to delete this management consideration?',
                      });
                      if (!choice) return;
                      const consideration = managementConsiderations[index];
                      if (!uuid.isUUID(consideration.id)) {
                        await deleteManagementConsideration(planId, consideration.id);
                      }
                      remove(index);
                    }}
                  />
                ))
              )}

              <IfEditable permission={MANAGEMENT_CONSIDERATIONS.ADD}>
                <PrimaryButton
                  inverted
                  compact
                  style={{ marginTop: '10px' }}
                  type="button"
                  onClick={(e: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(e.currentTarget)}
                >
                  <MuiIcon name="add circle" />
                  Add Consideration
                </PrimaryButton>
                <Menu anchorEl={menuAnchorEl} open={!!menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
                  {considerTypeOptions.map((opt: any) => (
                    <MenuItem
                      key={opt.key}
                      onClick={() => {
                        setMenuAnchorEl(null);
                        push({
                          id: uuid(),
                          considerationTypeId: opt.value,
                          detail: '',
                          url: '',
                        });
                      }}
                    >
                      {opt.text}
                    </MenuItem>
                  ))}
                </Menu>
              </IfEditable>
            </div>
          </div>
        </>
      )}
    />
  );
}

export default ManagementConsiderations;
