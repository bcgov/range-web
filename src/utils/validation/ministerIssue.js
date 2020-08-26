import { UNIDENTIFIED_MINISTER_ISSUES } from '../../constants/strings'
import { ELEMENT_ID } from '../../constants/variables'

export const handleMinisterIssueValidation = ministerIssues => {
  if (ministerIssues.find(issue => !issue.identified)) {
    return [
      {
        error: true,
        message: UNIDENTIFIED_MINISTER_ISSUES,
        elementId: ELEMENT_ID.MINISTER_ISSUES
      }
    ]
  }

  return []
}
