import React, { useState } from 'react';
import uuid from 'uuid-v4';
import MonitoringAreaRow from './MonitoringAreaBox';
import { FieldArray } from 'formik';
import AddMonitoringAreaButton from './AddMonitoringAreaButton';
import InputModal from '../../../common/InputModal';
import { IfEditable } from '../../../common/PermissionsField';
import { MONITORING_AREAS } from '../../../../constants/fields';
import { deleteMonitoringArea } from '../../../../api';
import { resetMonitoringAreaId } from '../../../../utils/helper';

interface MonitoringAreaListProps {
  monitoringAreas: any[];
  planId: any;
  pastureId: any;
  communityId: any;
  namespace: string;
}

const MonitoringAreaList: React.FC<MonitoringAreaListProps> = ({ monitoringAreas, planId, pastureId, communityId, namespace }) => {
  const [areaToCopy, setAreaToCopy] = useState<any>();

  return (
    <div className="rup__plant-community__m-areas">
      <FieldArray
        name={namespace}
        validateOnChange={false}
        render={({ push, remove }) => (
          <>
            <IfEditable permission={MONITORING_AREAS.NAME}>
              <AddMonitoringAreaButton
                onClick={() => {
                  setAreaToCopy({
                    rangelandHealth: 0,
                    purposeTypeIds: [],
                    location: '',
                    latitute: 0,
                    longtitude: 0,
                    transect_azimuth: 0,
                    other_purpose: '',
                    id: uuid(),
                  });
                }}
              />
            </IfEditable>
            <IfEditable permission={MONITORING_AREAS.NAME} invert>
              {monitoringAreas.length === 0 && <div>No monitoring areas</div>}
            </IfEditable>
            {monitoringAreas.map((monitoringArea: any, index: number) => (
              <MonitoringAreaRow
                key={monitoringArea.id}
                monitoringArea={monitoringArea}
                namespace={`${namespace}.${index}`}
                onRemove={async () => {
                  const area = monitoringAreas[index];

                  if (!uuid.isUUID(area.id)) {
                    await deleteMonitoringArea(planId, pastureId, communityId, area.id);
                  }

                  remove(index);
                }}
                onCopy={() => setAreaToCopy(monitoringArea)}
              />
            ))}

            <InputModal
              open={Boolean(areaToCopy)}
              onSubmit={(name: string) => {
                setAreaToCopy(undefined);
                push(
                  resetMonitoringAreaId({
                    ...areaToCopy,
                    name,
                  }),
                );
              }}
              onClose={() => setAreaToCopy(undefined)}
              title="Monitoring Area Name"
            />
          </>
        )}
      />
    </div>
  );
};

export default MonitoringAreaList;
