import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { oxfordComma } from '../../../../utils';
import { MONITORING_AREAS } from '../../../../constants/fields';
import { MONITOING_AREA_PURPOSE_TIP } from '../../../../constants/strings';
import { Input, Dropdown, TextArea } from 'formik-semantic-ui';
import PermissionsField, { IfEditable } from '../../../common/PermissionsField';
import { REFERENCE_KEY } from '../../../../constants/variables';
import { connect } from 'formik';
import { useReferences } from '../../../../providers/ReferencesProvider';
import LocationButton from '../../../common/LocationButton';
import { Icon, Confirm, Dropdown as PlainDropdown, Form } from 'semantic-ui-react';
import InputModal from '../../../common/InputModal';

const MonitoringAreaBox = ({ monitoringArea, namespace, formik, onRemove, onCopy }) => {
  const { latitude, location, longitude, name, purposeTypeIds, rangelandHealthId } = monitoringArea;

  const [removeDialogOpen, setDialogOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const references = useReferences();

  const rangelandHealthTypes = references[REFERENCE_KEY.MONITORING_AREA_HEALTH];
  const rangelandHealthOptions = rangelandHealthTypes.map((type) => ({
    key: type.id,
    value: type.id,
    text: type.name,
  }));

  const purposeTypes = references[REFERENCE_KEY.MONITORING_AREA_PURPOSE_TYPE];
  const purposeOptions = purposeTypes.map((type) => ({
    key: type.id,
    value: type.id,
    text: type.name,
  }));

  return (
    <div className="rup__plant-community__m-area__box">
      <div className="rup__plant-community__m-area__header">
        <span>
          <Icon name="map marker alternate" />
          Monitoring Area: {name}
        </span>

        <div>
          <IfEditable permission={MONITORING_AREAS.NAME}>
            <Icon
              name="edit"
              onClick={(e) => {
                e.stopPropagation();
                setEditModalOpen(true);
              }}
            />
          </IfEditable>

          <PlainDropdown
            trigger={<Icon name="ellipsis vertical" />}
            options={[
              {
                key: 'copy',
                value: 'copy',
                text: 'Copy',
              },
              {
                key: 'delete',
                value: 'delete',
                text: 'Delete',
              },
            ]}
            icon={null}
            pointing="right"
            onClick={(e) => e.stopPropagation()}
            onChange={(e, { value }) => {
              if (value === 'delete') {
                setDialogOpen(true);
              }
              if (value === 'copy') {
                onCopy();
              }
            }}
            selectOnBlur={false}
          />
        </div>

        <Confirm
          open={removeDialogOpen}
          onCancel={() => {
            setDialogOpen(false);
          }}
          onConfirm={() => {
            setDialogOpen(false);
            onRemove();
          }}
        />
      </div>
      <PermissionsField
        name={`${namespace}.location`}
        permission={MONITORING_AREAS.LOCATION}
        component={TextArea}
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
        component={Dropdown}
        options={rangelandHealthOptions}
        displayValue={rangelandHealthTypes.find((r) => r.id === rangelandHealthId)?.name ?? ''}
        label="Rangeland Health"
      />

      <PermissionsField
        name={`${namespace}.purposeTypeIds`}
        permission={MONITORING_AREAS.PURPOSE}
        tip={MONITOING_AREA_PURPOSE_TIP}
        component={Dropdown}
        options={purposeOptions}
        fieldProps={{ required: true }}
        inputProps={{
          multiple: true,
        }}
        displayValue={oxfordComma(
          purposeTypeIds.map((purposeTypeId) => purposeTypes.find((p) => p.id === purposeTypeId)?.name),
        )}
        label="Purposes"
      />

      <Form.Group widths="equal">
        <PermissionsField
          name={`${namespace}.latitude`}
          permission={MONITORING_AREAS.LATITUDE}
          component={Input}
          displayValue={latitude}
          label="Latitude"
          inputProps={{
            type: 'number',
          }}
        />
        <PermissionsField
          name={`${namespace}.longitude`}
          permission={MONITORING_AREAS.LONGTITUDE}
          component={Input}
          displayValue={longitude}
          label="Longitude"
          inputProps={{
            type: 'number',
          }}
        />
        <IfEditable permission={MONITORING_AREAS.LATITUDE}>
          <LocationButton
            onLocation={({ coords: { longitude, latitude } }) => {
              formik.setFieldValue(`${namespace}.longitude`, longitude);
              formik.setFieldValue(`${namespace}.latitude`, latitude);
            }}
          >
            <Icon name="compass" />
            Get Location
          </LocationButton>
        </IfEditable>
      </Form.Group>

      <InputModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={(name) => {
          formik.setFieldValue(`${namespace}.name`, name);
          setEditModalOpen(false);
        }}
        title="Edit monitoring area name"
        placeholder="Monitoring area name"
      />
    </div>
  );
};

MonitoringAreaBox.propTypes = {
  monitoringArea: PropTypes.shape({}).isRequired,
  namespace: PropTypes.string.isRequired,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
  }),
  onRemove: PropTypes.func,
  onCopy: PropTypes.func,
};

export default connect(MonitoringAreaBox);
