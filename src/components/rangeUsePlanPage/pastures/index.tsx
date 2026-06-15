import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import { FieldArray, connect } from 'formik';
import uuid from 'uuid-v4';
import PastureBox from './PastureBox';
import { IfEditable } from '../../common/PermissionsField';
import * as strings from '../../../constants/strings';
import { PASTURES } from '../../../constants/fields';
import { InfoTip, InputModal, PrimaryButton, MuiIcon } from '../../common';
import { deletePasture } from '../../../api';
import { resetPastureId, generatePasture } from '../../../utils';
import ImportPastureModal from '../ImportPastureModal';
import { isGrazingSchedule, isHayCuttingSchedule } from '../../../utils/helper/agreement';
import useConfirm from '../../../providers/ConfrimationModalProvider';

interface PastureItem {
  id: string | number;
  name: string;
  plantCommunities: any[];
  planId?: string | number;
  [key: string]: any;
}

interface PasturesProps {
  pastures: PastureItem[];
  formik: any;
  agreementType: any;
}

function Pastures({ pastures, formik, agreementType }: PasturesProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isImportPastureModalOpen, setImportPastureModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [indexToCopy, setIndexToCopy] = useState<number | null>(null);
  const confirm = useConfirm()!;
  const titleText = isGrazingSchedule(agreementType)
    ? strings.PASTURES
    : isHayCuttingSchedule(agreementType)
      ? strings.AREAS
      : 'Invalid agreement Type';
  const tipText = isGrazingSchedule(agreementType)
    ? strings.PASTURES_TIP
    : isHayCuttingSchedule(agreementType)
      ? strings.AREAS_TIP
      : '';
  const handlePastureClick = useCallback(
    (index: number) => {
      setActiveIndex(activeIndex === index ? -1 : index);
    },
    [activeIndex],
  );

  return (
    <FieldArray
      name="pastures"
      validateOnChange={false}
      render={({ push, remove }) => (
        <div className="rup__pastures">
          <div className="rup__content-title--editable">
            <div className="rup__popup-header">
              <div className="rup__content-title">{titleText}</div>
              <InfoTip header={titleText} content={tipText} />
            </div>
            <IfEditable permission={PASTURES.NAME}>
              <div style={{ display: 'flex', gap: 8 }}>
                <PrimaryButton
                  type="button"
                  onClick={() => {
                    setImportPastureModalOpen(true);
                  }}
                  className="icon labeled rup__add-button"
                  startIcon={<MuiIcon name="add circle" />}
                >
                  Import {titleText}
                </PrimaryButton>
                <PrimaryButton
                  type="button"
                  onClick={() => {
                    setModalOpen(true);
                  }}
                  className="icon labeled rup__add-button"
                  startIcon={<MuiIcon name="add circle" />}
                >
                  Add {titleText}
                </PrimaryButton>
              </div>
              <ImportPastureModal
                dialogOpen={isImportPastureModalOpen}
                onClose={() => setImportPastureModalOpen(false)}
                onImport={(pasture: any) => {
                  setImportPastureModalOpen(false);
                  pasture.id = uuid();
                  push(pasture);
                }}
              />
            </IfEditable>
          </div>

          <InputModal
            open={isModalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={(name: string) => {
              const pasture = generatePasture(name);

              push(pasture);

              setModalOpen(false);
            }}
            title={`Add ${titleText}`}
            placeholder={`${titleText} name`}
          />

          <InputModal
            open={indexToCopy !== null}
            onClose={() => setIndexToCopy(null)}
            onSubmit={(name: string) => {
              const pasture = pastures[indexToCopy!];

              push(
                resetPastureId({
                  ...pasture,
                  name,
                  plantCommunities: pasture.plantCommunities.map((pc: any) => ({
                    ...pc,
                    monitoringAreas: [],
                  })),
                }),
              );

              setIndexToCopy(null);
            }}
            title={`Copy ${titleText}`}
            placeholder={`${titleText} name`}
          />

          <div className="rup__divider" />
          {pastures.length === 0 ? (
            <div className="rup__section-not-found">{`No ${titleText} provided.`}</div>
          ) : (
            <ul
              className={classnames('collaspible-boxes', {
                'collaspible-boxes--empty': pastures.length === 0,
              })}
            >
              {pastures.map((pasture, index) => (
                <PastureBox
                  key={pasture.id}
                  pasture={pasture}
                  index={index}
                  activeIndex={activeIndex}
                  onClick={handlePastureClick}
                  onCopy={() => setIndexToCopy(index)}
                  onDelete={async () => {
                    const pastureToDelete = pastures[index];
                    const choice = await confirm({
                      titleText: `Delete ${titleText} '${pastureToDelete.name}'`,
                      contentText:
                        'Are you sure? All related plant communities, monitoring areas and criteria, as well as any associated schedule rows, will be deleted',
                    });
                    if (!choice) return;

                    console.log(formik.values.schedules);
                    const schedules = _.flatten(
                      formik.values.schedules.map((schedule: any) => ({
                        ...schedule,
                        scheduleEntries: schedule.scheduleEntries.filter(
                          (entry: any) => entry.pastureId !== pastureToDelete.id,
                        ),
                      })),
                    );
                    formik.setFieldValue('schedules', schedules);

                    if (!uuid.isUUID(pastureToDelete.id as string)) {
                      await deletePasture(pastureToDelete.planId, pastureToDelete.id);
                    }

                    remove(index);
                  }}
                  namespace={`pastures.${index}`}
                  titleText={titleText}
                  isGrazingSchedule={isGrazingSchedule(agreementType)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    />
  );
}

export default connect(Pastures);
