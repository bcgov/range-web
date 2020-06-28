import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import uuid from 'uuid-v4'
import { Icon, Dropdown } from 'semantic-ui-react'
import { ACTION_NOTE } from '../../../constants/strings'
import EditableMinisterIssueActionBox from './EditableMinisterIssueActionBox'
import {
  ministerIssueUpdated,
  openInputModal,
  openConfirmationModal
} from '../../../actions'
import { deleteRUPMinisterIssueAction } from '../../../actionCreators'
import { REFERENCE_KEY } from '../../../constants/variables'
import { PrimaryButton } from '../../common'

class AddableMinisterIssueActionList extends Component {
  static propTypes = {
    ministerIssue: PropTypes.shape({
      ministerIssueActions: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    references: PropTypes.shape({}).isRequired,
    ministerIssueUpdated: PropTypes.func.isRequired,
    openInputModal: PropTypes.func.isRequired,
    deleteRUPMinisterIssueAction: PropTypes.func.isRequired
  }

  renderMinisterIssueAction = (action, actionIndex) => {
    const { id } = action

    return (
      <EditableMinisterIssueActionBox
        key={id}
        action={action}
        actionIndex={actionIndex}
        handleActionChange={this.handleMIActionChange}
        handleActionDelete={this.handleMIActionDelete}
        {...this.props}
      />
    )
  }

  handleMIActionChange = (action, actionIndex) => {
    const { ministerIssue: mi, ministerIssueUpdated } = this.props
    const ministerIssue = { ...mi }
    ministerIssue.ministerIssueActions[actionIndex] = action

    ministerIssueUpdated({ ministerIssue })
  }

  handleMIActionDelete = actionIndex => {
    const {
      ministerIssue: mi,
      ministerIssueUpdated,
      deleteRUPMinisterIssueAction
    } = this.props
    const ministerIssue = { ...mi }
    const [deletedAction] = ministerIssue.ministerIssueActions.splice(
      actionIndex,
      1
    )
    const planId = ministerIssue && ministerIssue.planId
    const issueId = ministerIssue && ministerIssue.id
    const actionId = deletedAction && deletedAction.id
    const onDeleted = () => {
      ministerIssueUpdated({ ministerIssue })
    }

    // delete the action saved in server
    if (planId && issueId && actionId && !uuid.isUUID(actionId)) {
      deleteRUPMinisterIssueAction(planId, issueId, actionId).then(onDeleted)
    } else {
      // or delete the action saved only in Redux
      onDeleted()
    }
  }

  onActionTypeOptionClicked = (e, { value: actionTypeId }) => {
    const { ministerIssue: mi, ministerIssueUpdated } = this.props
    const ministerIssue = { ...mi }
    const action = {
      id: uuid(),
      detail: '',
      actionTypeId,
      other: ''
    }
    ministerIssue.ministerIssueActions.push(action)
    ministerIssueUpdated({ ministerIssue })

    this.openInputModalWhenOtherTypeSelected(action)
  }

  openInputModalWhenOtherTypeSelected = action => {
    const actionTypeId = action && action.actionTypeId
    const { openInputModal, references } = this.props
    const actionTypes =
      references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || []
    const otherActionType = actionTypes.find(t => t.name === 'Other')

    // open a modal when the option 'other' is selected
    if (otherActionType && actionTypeId === otherActionType.id) {
      openInputModal({
        id: 'minister_issue_action_other',
        title: 'Other Name',
        value: action,
        onSubmit: this.onOtherSubmited
      })
    }
  }

  onOtherSubmited = (input, { value: action }) => {
    const { ministerIssue } = this.props
    const newAction = {
      ...action,
      other: input
    }
    const actionIndex = ministerIssue.ministerIssueActions.findIndex(
      a => a.id === action.id
    )
    if (actionIndex < 0) return

    this.handleMIActionChange(newAction, actionIndex)
  }

  render() {
    const { ministerIssue, references } = this.props
    const ministerIssueActions =
      (ministerIssue && ministerIssue.ministerIssueActions) || []
    const actionTypes =
      references[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || []
    const actionTypeOptions = actionTypes.map(miat => {
      return {
        key: miat.id,
        value: miat.id,
        text: miat.name
      }
    })

    return (
      <Fragment>
        {ministerIssueActions.length === 0 && (
          <div className="rup__missue__action__not-found">No actions</div>
        )}

        {ministerIssueActions.length > 0 &&
          ministerIssueActions.map(this.renderMinisterIssueAction)}

        <div className="rup__missue__action__note">{ACTION_NOTE}</div>

        <Dropdown
          trigger={
            <PrimaryButton inverted compact style={{ marginTop: '10px' }}>
              <Icon name="add circle" />
              Add Action
            </PrimaryButton>
          }
          options={actionTypeOptions}
          icon={null}
          pointing="left"
          onChange={this.onActionTypeOptionClicked}
          selectOnBlur={false}
        />
      </Fragment>
    )
  }
}

export default connect(null, {
  ministerIssueUpdated,
  openInputModal,
  openConfirmationModal,
  deleteRUPMinisterIssueAction
})(AddableMinisterIssueActionList)
