import React, { useState } from 'react';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { PASTURES } from '../../../constants/fields';
import { Input, TextArea } from 'formik-semantic-ui';
import { Dropdown, Icon } from 'semantic-ui-react';
import { CollapsibleBox } from '../../common';
import * as strings from '../../../constants/strings';
import { IMAGE_SRC } from '../../../constants/variables';
import PlantCommunities from '../plantCommunities';
import { getIn, connect } from 'formik';
import PercentField from '../../common/form/PercentField';
import InputModal from '../../common/InputModal';
import MultiParagraphDisplay from '../../common/MultiParagraphDisplay';

const dropdownOptions = [
  { key: 'copy', value: 'copy', text: 'Copy' },
  { key: 'delete', value: 'delete', text: 'Delete' },
];

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

const PastureBox: React.FC<PastureBoxProps> = ({
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
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const isError = !!getIn(formik.errors, namespace);
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
                {isError ? <Icon name="warning sign" /> : <img src={IMAGE_SRC.PASTURE_ICON} alt="pasture icon" />}
              </div>
              {titleText}: {pasture.name}
            </div>

            <IfEditable permission={PASTURES.NAME}>
              <div>
                {activeIndex === index && (
                  <Icon
                    name="edit"
                    onClick={(e: React.MouseEvent) => {
                      setModalOpen(true);
                      e.stopPropagation();
                    }}
                  />
                )}
                <Dropdown
                  className="rup__pasture__actions"
                  trigger={<i className="ellipsis vertical icon" />}
                  options={dropdownOptions}
                  icon={null}
                  value={null as any}
                  pointing="right"
                  onClick={(e: any) => e.stopPropagation()}
                  onChange={(_e: any, { value }: any) => {
                    if (value === 'copy') onCopy();
                    if (value === 'delete') onDelete();
                  }}
                  selectOnBlur={false}
                />
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
                    component={Input}
                    displayValue={pasture.allowableAum}
                    label={strings.ALLOWABLE_AUMS}
                    tip={strings.ALLOWABLE_AUMS_TIP}
                    fast
                    inputProps={{
                      placeholder: `Approved maximum AUM allocation, if applicable`,
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
                      label: '%',
                      labelPosition: 'right',
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
                    component={Input}
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
              component={TextArea}
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
};

export default connect(
  React.memo(
    PastureBox,
    (prevProps: PastureBoxProps, nextProps: PastureBoxProps) =>
      prevProps.pasture === nextProps.pasture && prevProps.activeIndex === nextProps.activeIndex,
  ),
);
