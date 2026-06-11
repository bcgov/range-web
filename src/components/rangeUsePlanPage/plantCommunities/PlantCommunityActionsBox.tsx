import React, { useState } from 'react';
import { FieldArray, connect } from 'formik';
import uuid from 'uuid-v4';
import { IfEditable } from '../../common/PermissionsField';
import { PLANT_COMMUNITY } from '../../../constants/fields';
import { Button, Confirm } from 'semantic-ui-react';
import PlantCommunityAction from './PlantCommunityAction';
import { deletePlantCommunityAction } from '../../../api';

interface PlantCommunityActionsBoxProps {
  actions: any[];
  planId: any;
  pastureId: any;
  communityId: any;
  namespace: string;
}

const PlantCommunityActionsBox: React.FC<PlantCommunityActionsBoxProps> = ({ actions, planId, pastureId, communityId, namespace }) => {
  const [toRemove, setToRemove] = useState<number | null>(null);

  return (
    <FieldArray
      name={`${namespace}.plantCommunityActions`}
      validateOnChange={false}
      render={({ push, remove }) => (
        <>
          {actions.map((action: any, index: number) => (
            <PlantCommunityAction
              action={action}
              key={action.id || `action${index}`}
              namespace={`${namespace}.plantCommunityActions.${index}`}
              onDelete={() => {
                setToRemove(index);
              }}
            />
          ))}
          <Confirm
            open={toRemove !== null}
            onCancel={() => {
              setToRemove(null);
            }}
            onConfirm={async () => {
              const action = actions[toRemove!];

              if (!uuid.isUUID(action.id)) {
                await deletePlantCommunityAction(planId, pastureId, communityId, action.id);
              }

              remove(toRemove!);
              setToRemove(null);
            }}
          />
          <IfEditable permission={PLANT_COMMUNITY.ACTIONS.NAME}>
            <Button
              primary
              type="button"
              className="icon labeled rup__plant-communities__add-button"
              onClick={() => push({ actionTypeId: null, details: '', id: uuid() })}
            >
              <i className="add circle icon" />
              Add Action
            </Button>
          </IfEditable>
        </>
      )}
    />
  );
};

export default connect(PlantCommunityActionsBox);
