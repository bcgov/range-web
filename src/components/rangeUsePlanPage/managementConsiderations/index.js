import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid-v4';
import { Dropdown, Icon, Confirm } from 'semantic-ui-react';
import { PrimaryButton, InfoTip } from '../../common';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { FieldArray } from 'formik';
import ManagementConsiderationRow from './ManagementConsiderationRow';
import { IfEditable } from '../../common/PermissionsField';
import * as strings from '../../../constants/strings';
import { MANAGEMENT_CONSIDERATIONS } from '../../../constants/fields';
import { deleteManagementConsideration } from '../../../api';

const ManagementConsiderations = ({ planId, managementConsiderations }) => {
  const references = useReferences();
  const considerTypes = references[REFERENCE_KEY.MANAGEMENT_CONSIDERATION_TYPE] || [];
  const considerTypeOptions = considerTypes.map((ct) => ({
    key: ct.id,
    value: ct.id,
    text: ct.name,
  }));

  const [toRemove, setToRemove] = useState(null);

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
                    onDelete={() => setToRemove(index)}
                  />
                ))
              )}

              <IfEditable permission={MANAGEMENT_CONSIDERATIONS.ADD}>
                <Dropdown
                  trigger={
                    <PrimaryButton inverted compact style={{ marginTop: '10px' }} type="button">
                      <Icon name="add circle" />
                      Add Consideration
                    </PrimaryButton>
                  }
                  options={considerTypeOptions}
                  icon={null}
                  pointing="left"
                  value={null}
                  onChange={(e, { value }) => {
                    push({
                      id: uuid(),
                      considerationTypeId: value,
                      detail: '',
                      url: '',
                    });
                  }}
                  selectOnBlur={false}
                />
              </IfEditable>
            </div>
          </div>

          <Confirm
            open={toRemove !== null}
            onCancel={() => {
              setToRemove(null);
            }}
            onConfirm={async () => {
              const consideration = managementConsiderations[toRemove];

              if (!uuid.isUUID(consideration.id)) {
                await deleteManagementConsideration(planId, consideration.id);
              }

              remove(toRemove);
              setToRemove(null);
            }}
          />
        </>
      )}
    />
  );
};

ManagementConsiderations.propTypes = {
  managementConsiderations: PropTypes.array.isRequired,
};

export default ManagementConsiderations;
