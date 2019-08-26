import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import { TextField, CollapsibleBox } from '../../common'
import { NOT_PROVIDED, ACTION_NOTE } from '../../../constants/strings'
import { oxfordComma } from '../../../utils'
import MinisterIssueAction from './MinisterIssueAction'

const MinisterIssueBox = ({
  issue: { detail, objective, pastures = [], identified, actions = [], type },
  ministerIssueIndex,
  activeMinisterIssueIndex,
  onMinisterIssueClicked
}) => (
  <CollapsibleBox
    contentIndex={ministerIssueIndex}
    activeContentIndex={activeMinisterIssueIndex}
    onContentClicked={onMinisterIssueClicked}
    header={
      <div>
        <Icon name="warning sign" style={{ marginRight: '7px' }} />
        Issue Type: {type}
      </div>
    }
    headerRight={
      <div className="rup__missue__identified">
        {'Identified: '}
        {identified ? (
          <Icon name="check circle" color="green" />
        ) : (
          <Icon name="remove circle" color="red" />
        )}
      </div>
    }
    collapsibleContent={
      <>
        <TextField label="Details" text={detail} />
        <TextField label="Objective" text={objective} />
        <TextField
          label="Pastures"
          text={oxfordComma(pastures.map(p => p.name))}
        />

        <div className="text-field__label">Actions</div>
        {actions.map(action => (
          <MinisterIssueAction key={action.id} {...action} />
        ))}
        <div className="text-field__text">
          {actions.length === 0 ? NOT_PROVIDED : ACTION_NOTE}
        </div>
      </>
    }
  />
)

MinisterIssueBox.propTypes = {
  issue: PropTypes.shape({
    type: PropTypes.string.isRequired,
    detail: PropTypes.string,
    objective: PropTypes.string,
    identified: PropTypes.bool,
    pastures: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
      })
    ),
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        other: PropTypes.string,
        detail: PropTypes.string,
        noGrazeEndDate: PropTypes.instanceOf(Date),
        noGrazeStartDate: PropTypes.instanceOf(Date)
      })
    )
  }),
  ministerIssueIndex: PropTypes.number.isRequired,
  activeMinisterIssueIndex: PropTypes.number.isRequired,
  onMinisterIssueClicked: PropTypes.func.isRequired
}

export default MinisterIssueBox
