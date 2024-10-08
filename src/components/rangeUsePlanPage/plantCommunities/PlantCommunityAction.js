import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import { Form, Icon, Dropdown as PlainDropdown, Grid } from 'semantic-ui-react';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { PLANT_COMMUNITY } from '../../../constants/fields';
import { TextArea } from 'formik-semantic-ui';
import DayMonthPicker from '../../common/form/DayMonthPicker';
import moment from 'moment';
import HelpfulDropdown from '../../common/form/HelpfulDropdown';

const PlantCommunityAction = ({ action, namespace, onDelete, formik }) => {
  const references = useReferences();
  const placeholders = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE];
  const actionTypes = references[REFERENCE_KEY.PLANT_COMMUNITY_ACTION_TYPE].map((type) => ({
    placeholder: placeholders.find((p) => p.id === type.id).placeholder,
    ...type,
  }));

  const otherType = actionTypes.find((type) => type.name === 'Other');
  const [otherOption, setOtherOption] = useState({
    key: otherType?.id,
    value: otherType?.id,
    text: action?.name || otherType?.name || 'Other',
  });

  const actionOptions = actionTypes
    .map((type) => ({
      key: type.id,
      value: type.id,
      text: type.name,
    }))
    .concat(otherOption)
    .filter((o) => o.text !== 'Other');

  const valueInputRef = useRef(null);

  return (
    <Grid>
      <Grid.Column width="4">
        <PermissionsField
          name={`${namespace}.actionTypeId`}
          permission={PLANT_COMMUNITY.ACTIONS.NAME}
          component={HelpfulDropdown}
          help="To select a value, start typing. If a predefined option doesn't exist, you can provide your own value"
          options={actionOptions}
          displayValue={
            actionOptions.find((option) => option.value === action.actionTypeId)
              ? actionOptions.find((option) => option.value === action.actionTypeId).text
              : ''
          }
          label="Action"
          fieldProps={{
            required: true,
          }}
          inputProps={{
            allowAdditions: true,
            search: true,
            fluid: true,
            additionLabel: 'Other: ',
            selectOnBlur: true,
            onKeyDown: (e) => {
              if (e.keyCode === 13) {
                valueInputRef.current.focus();
              }
            },
            onAddItem: (e, { value }) => {
              setOtherOption({
                ...otherOption,
                text: value,
              });

              formik.setFieldValue(`${namespace}.actionTypeId`, otherOption.value);
              formik.setFieldValue(`${namespace}.name`, value);
            },
          }}
        />
      </Grid.Column>

      <Grid.Column width="11">
        <PermissionsField
          name={`${namespace}.details`}
          permission={PLANT_COMMUNITY.ACTIONS.DETAIL}
          displayValue={action.details}
          component={TextArea}
          label="Details"
          fieldProps={{
            required: true,
          }}
          inputProps={{
            rows: 5,
            ref: valueInputRef,
            placeholder:
              actionTypes?.find((type) => type.id === action.actionTypeId)?.placeholder ?? otherType?.placeholder,
          }}
        />

        {actionOptions.find((option) => option.value === action.actionTypeId) &&
          actionOptions.find((option) => option.value === action.actionTypeId).text === 'Timing' && (
            <Form.Group widths="equal">
              <PermissionsField
                monthName={`${namespace}.noGrazeStartMonth`}
                dayName={`${namespace}.noGrazeStartDay`}
                permission={PLANT_COMMUNITY.ACTIONS.NO_GRAZING_PERIOD}
                displayValue={moment(`${action.noGrazeStartMonth} ${action.noGrazeStartDay}`, 'MM DD').format(
                  'MMMM Do',
                )}
                component={DayMonthPicker}
                label="No Graze Start"
                fluid
              />

              <PermissionsField
                monthName={`${namespace}.noGrazeEndMonth`}
                dayName={`${namespace}.noGrazeEndDay`}
                permission={PLANT_COMMUNITY.ACTIONS.NO_GRAZING_PERIOD}
                displayValue={moment(`${action.noGrazeEndMonth} ${action.noGrazeEndDay}`, 'MM DD').format('MMMM Do')}
                component={DayMonthPicker}
                label="No Graze End"
                fluid
              />
            </Form.Group>
          )}
      </Grid.Column>

      <IfEditable permission={PLANT_COMMUNITY.ACTIONS.NAME}>
        <Grid.Column width="1" verticalAlign="middle">
          <PlainDropdown
            trigger={<Icon name="ellipsis vertical" />}
            options={[
              {
                key: 'delete',
                value: 'delete',
                text: 'Delete',
              },
            ]}
            style={{ display: 'flex', alignItems: 'center' }}
            icon={null}
            pointing="right"
            onClick={(e) => e.stopPropagation()}
            onChange={(e, { value }) => {
              if (value === 'delete') {
                onDelete();
              }
            }}
            selectOnBlur={false}
          />
        </Grid.Column>
      </IfEditable>
    </Grid>
  );
};

PlantCommunityAction.propTypes = {
  action: PropTypes.object.isRequired,
  namespace: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  formik: PropTypes.object.isRequired,
};

export default connect(PlantCommunityAction);
