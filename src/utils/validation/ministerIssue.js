import { UNIDENTIFIED_MINISTER_ISSUES } from '../../constants/strings'
import { ELEMENT_ID } from '../../constants/variables'

export const handleMinisterIssueValidation = grazingSchedules => {
  if (grazingSchedules.find(schedule => !schedule.approved)) {
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
