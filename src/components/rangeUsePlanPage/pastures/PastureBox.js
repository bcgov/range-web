import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

const PastureBox = ({ pasture, index, activeIndex, onClick, onCopy, onDelete, namespace, formik }) => {
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
              Pasture: {pasture.name}
            </div>

            <IfEditable permission={PASTURES.NAME}>
              <div>
                {activeIndex === index && (
                  <Icon
                    name="edit"
                    onClick={(e) => {
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
                  value={null}
                  pointing="right"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e, { value }) => {
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
                    placeholder: 'Approved maximum AUM allocation for this pasture if applicable',
                  }}
                />
              </div>
              <div className="rup__cell-4">
                <PermissionsField
                  name={`${namespace}.pldPercent`}
                  permission={PASTURES.PLD}
                  component={PercentField}
                  displayValue={pasture.pldPercent * 100 + '%'}
                  label={strings.PRIVATE_LAND_DEDUCTION}
                  tip={strings.PRIVATE_LAND_DEDUCTION_TIP}
                  inputProps={{
                    label: '%',
                    labelPosition: 'right',
                    type: 'number',
                    placeholder: 'Percentage of use in this pasture occuring on private land',
                  }}
                  fast
                />
              </div>
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
            </div>
            <PermissionsField
              name={`${namespace}.notes`}
              permission={PASTURES.NOTES}
              displayValue={pasture.notes}
              component={TextArea}
              displayComponent={MultiParagraphDisplay}
              label={strings.PASTURE_NOTES}
              fluid
              fast
              inputProps={{
                placeholder:
                  "Pasture specific information (ie. not schedule, plant community or Minister's Issue specific). Ex. relevant history or topographical considerations.",
              }}
            />

            <PlantCommunities
              plantCommunities={pasture.plantCommunities}
              namespace={namespace}
              canEdit={true}
              planId={pasture.planId}
              pastureId={pasture.id}
            />
          </>
        }
      />
      <InputModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(name) => {
          formik.setFieldValue(`${namespace}.name`, name);
          setModalOpen(false);
        }}
        title="Edit pasture name"
        placeholder="Pasture name"
      />
    </>
  );
};

PastureBox.propTypes = {
  index: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  pasture: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  namespace: PropTypes.string.isRequired,
};

export default connect(
  React.memo(
    PastureBox,
    (prevProps, nextProps) =>
      prevProps.pasture === nextProps.pasture && prevProps.activeIndex === nextProps.activeIndex,
  ),
);
