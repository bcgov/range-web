import React from 'react';
import { FieldArray, connect } from 'formik';
import uuid from 'uuid-v4';
import { IfEditable } from '../../common/PermissionsField';
import { PLANT_COMMUNITY } from '../../../constants/fields';
import { PrimaryButton, MuiIcon } from '../../common';
import PlantCommunityAction from './PlantCommunityAction';
import { deletePlantCommunityAction } from '../../../api';
import useConfirm from '../../../providers/ConfrimationModalProvider';

interface PlantCommunityActionsBoxProps {
  actions: any[];
  planId: any;
  pastureId: any;
  communityId: any;
  namespace: string;
}

function PlantCommunityActionsBox({
  actions,
  planId,
  pastureId,
  communityId,
  namespace,
}: PlantCommunityActionsBoxProps) {
  const confirm = useConfirm()!;

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
              onDelete={async () => {
                const choice = await confirm({
                  titleText: 'Delete Action',
                  contentText: 'Are you sure you want to delete this action?',
                });
                if (!choice) return;
                const act = actions[index];
                if (!uuid.isUUID(act.id)) {
                  await deletePlantCommunityAction(planId, pastureId, communityId, act.id);
                }
                remove(index);
              }}
            />
          ))}
          <IfEditable permission={PLANT_COMMUNITY.ACTIONS.NAME}>
            <PrimaryButton
              type="button"
              className="icon labeled rup__plant-communities__add-button"
              onClick={() => push({ actionTypeId: null, details: '', id: uuid() })}
            >
              <MuiIcon name="add circle" />
              Add Action
            </PrimaryButton>
          </IfEditable>
        </>
      )}
    />
  );
}

export default connect(PlantCommunityActionsBox);
