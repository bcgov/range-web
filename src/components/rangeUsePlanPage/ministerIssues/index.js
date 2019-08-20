import { connect } from 'react-redux'

import MinisterIssues from './MinisterIssues'

const mapStateToProps = ({ PLAN }, props) => {
  const issues = props.issues.map(id => {
    const issue = PLAN.ministerIssues[id]
    const pastures = issue.pastures.map(id => PLAN.pastures[id])

    return {
      ...issue,
      type: issue.ministerIssueType.name,
      actions: issue.ministerIssueActions.map(action => ({
        ...action,
        type: action.ministerIssueActionType.name
      })),
      pastures
    }
  })

  return { issues }
}

export default connect(mapStateToProps)(MinisterIssues)
