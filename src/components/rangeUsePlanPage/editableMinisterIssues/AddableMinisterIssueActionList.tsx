import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'uuid-v4';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ACTION_NOTE } from '../../../constants/strings';
import EditableMinisterIssueActionBox from './EditableMinisterIssueActionBox';
import { ministerIssueUpdated, openInputModal, openConfirmationModal } from '../../../actions';
import { deleteRUPMinisterIssueAction } from '../../../actionCreators';
import { REFERENCE_KEY } from '../../../constants/variables';
import { PrimaryButton, MuiIcon } from '../../common';
import { AppDispatch } from '../../../configureStore';

interface AddableMinisterIssueActionListProps {
  ministerIssue: any;
  references: any;
}

const AddableMinisterIssueActionList = ({ ministerIssue, references }: AddableMinisterIssueActionListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMIActionChange = (action: any, actionIndex: number) => {
    const mi = { ...ministerIssue };
    mi.ministerIssueActions[actionIndex] = action;
    dispatch(ministerIssueUpdated({ ministerIssue: mi }));
  };

  const handleMIActionDelete = (actionIndex: number) => {
    const mi = { ...ministerIssue };
    const [deletedAction] = mi.ministerIssueActions.splice(actionIndex, 1);
    const planId = mi && mi.planId;
    const issueId = mi && mi.id;
    const actionId = deletedAction && deletedAction.id;
    const onDeleted = () => {
      dispatch(ministerIssueUpdated({ ministerIssue: mi }));
    };

    // delete the action saved in server
    if (planId && issueId && actionId && !uuid.isUUID(actionId)) {
      (dispatch(deleteRUPMinisterIssueAction(planId, issueId, actionId)) as any).then(onDeleted);
    } else {
      // or delete the action saved only in Redux
      onDeleted();
    }
  };

  const openInputModalWhenOtherTypeSelected = (action: any) => {
    const actionTypeId = action && action.actionTypeId;
    const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
    const otherActionType = actionTypes.find((t: any) => t.name === 'Other');

    // open a modal when the option 'other' is selected
    if (otherActionType && actionTypeId === otherActionType.id) {
      dispatch(
        openInputModal({
          id: 'minister_issue_action_other',
          title: 'Other Name',
          value: action,
          onSubmit: (input: string, { value: actionValue }: any) => {
            const newAction = {
              ...actionValue,
              other: input,
            };
            const idx = ministerIssue.ministerIssueActions.findIndex((a: any) => a.id === actionValue.id);
            if (idx < 0) return;
            handleMIActionChange(newAction, idx);
          },
        }),
      );
    }
  };

  const onActionTypeOptionClicked = (actionTypeId: string) => {
    const mi = { ...ministerIssue };
    const action = {
      id: uuid(),
      detail: '',
      actionTypeId,
      other: '',
    };
    mi.ministerIssueActions.push(action);
    dispatch(ministerIssueUpdated({ ministerIssue: mi }));

    openInputModalWhenOtherTypeSelected(action);
    setAnchorEl(null);
  };

  const renderMinisterIssueAction = (action: any, actionIndex: number) => {
    const { id } = action;

    return (
      <EditableMinisterIssueActionBox
        key={id}
        action={action}
        actionIndex={actionIndex}
        handleActionChange={handleMIActionChange}
        handleActionDelete={handleMIActionDelete}
        references={references}
        openConfirmationModal={(config: any) => dispatch(openConfirmationModal(config))}
      />
    );
  };

  const ministerIssueActions = (ministerIssue && ministerIssue.ministerIssueActions) || [];
  const actionTypes = references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];

  return (
    <Fragment>
      {ministerIssueActions.length === 0 && <div className="rup__missue__action__not-found">No actions</div>}

      {ministerIssueActions.length > 0 && ministerIssueActions.map(renderMinisterIssueAction)}

      <div className="rup__missue__action__note">{ACTION_NOTE}</div>

      <PrimaryButton inverted compact style={{ marginTop: '10px' }} onClick={(e: any) => setAnchorEl(e.currentTarget)}>
        <MuiIcon name="add circle" />
        Add Action
      </PrimaryButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {actionTypes.map((miat: any) => (
          <MenuItem key={miat.id} onClick={() => onActionTypeOptionClicked(miat.id)}>
            {miat.name}
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};

export default AddableMinisterIssueActionList;
