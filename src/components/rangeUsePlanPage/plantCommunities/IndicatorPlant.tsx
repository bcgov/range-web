import React, { useState, useRef } from 'react';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { STUBBLE_HEIGHT } from '../../../constants/fields';
import { Dropdown, Icon, Grid as SUIGrid } from 'semantic-ui-react';
const Grid = SUIGrid as any;
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { Form } from 'formik-semantic-ui';
import DecimalField from '../../common/form/DecimalField';
import HelpfulDropdown from '../../common/form/HelpfulDropdown';

interface IndicatorPlantProps {
  plant: any;
  namespace: string;
  valueType: string;
  onDelete: () => void;
  formik: any;
}

const IndicatorPlant: React.FC<IndicatorPlantProps> = ({ plant, namespace, valueType, onDelete, formik }) => {
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

  return (
    <Grid key={plant.id}>
      <Grid.Column mobile="15">
        <Form.Group widths="equal" style={{ margin: 0 }}>
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
                  valueInputRef.current.focus();
                }
              },
              onChange: (_e: any, { value }: any) => {
                if (typeof value !== 'string') {
                  const plantValue = species.find((s: any) => s.id === value)[valueType];
                  if (plantValue) {
                    formik.setFieldValue(`${namespace}.value`, plantValue);
                  }
                }
              },
            }}
          />

          <PermissionsField
            permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}
            name={`${namespace}.value`}
            component={DecimalField}
            displayValue={plant.value}
            inputProps={{
              ref: valueInputRef,
            }}
          />
        </Form.Group>
      </Grid.Column>

      <Grid.Column mobile="1" verticalAlign="middle">
        <IfEditable permission={STUBBLE_HEIGHT.INDICATOR_PLANTS}>
          <Dropdown
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
            onClick={(e: any) => e.stopPropagation()}
            value={null as any}
            onChange={(_e: any, { value }: any) => {
              if (value === 'delete') {
                onDelete();
              }
            }}
            selectOnBlur={false}
          />
        </IfEditable>
      </Grid.Column>
    </Grid>
  );
};

export default IndicatorPlant;
