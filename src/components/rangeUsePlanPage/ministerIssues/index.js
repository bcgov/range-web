import React, { useState } from 'react'
import PropTypes from 'prop-types'

import MinisterIssueBox from './MinisterIssueBox'

const MinisterIssues = ({ issues }) => {
  const [activeMinisterIssue, setActiveMinisterIssue] = useState(issues[0].id)

  return (
    <div className="rup__missues">
      <div className="rup__content-title">
        {"Minister's Issues and Actions"}
      </div>
      <div className="rup__divider" />

      {issues.length > 0 ? (
        <ul className="collaspible-boxes">
          {issues.map(issue => (
            <MinisterIssueBox
              key={issue.id}
              issue={issue}
              ministerIssueIndex={issue.id}
              activeMinisterIssueIndex={activeMinisterIssue}
              onMinisterIssueClicked={index => () =>
                setActiveMinisterIssue(
                  index === activeMinisterIssue ? -1 : index
                )}
            />
          ))}
        </ul>
      ) : (
        <div className="rup__section-not-found">None identified.</div>
      )}
    </div>
  )
}

MinisterIssues.propTypes = {
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string,
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
    })
  )
}

MinisterIssues.defaultProps = {
  issues: []
}

export default MinisterIssues
