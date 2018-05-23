import { CREATED, DRAFT, COMPLETED, CHANGE_REQUESTED, PENDING } from '../constants/variables';
import {
  RUP_CHANGE_REQUESTED_FOR_AH_CONTENT,
  RUP_COMPLETE_FOR_AH_CONTENT,
  RUP_CREATED_FOR_AH_CONTENT,
  RUP_IN_DRAFT_FOR_AH_CONTENT,
  RUP_PENDING_FOR_AH_CONTENT,
} from '../constants/strings';

class PlanStatus {
  constructor(s) {
    this.id = s && s.id;
    this.code = s && s.code;
    this.name = s && s.name;
  }

  /**
   * check status of the range use plan
   *
   * @returns {boolean}
   */
  get isCreated() {
    return this.name === CREATED;
  }

  get isInDraft() {
    return this.name === DRAFT;
  }

  get isCompleted() {
    return this.name === COMPLETED;
  }

  get isChangedRequested() {
    return this.name === CHANGE_REQUESTED;
  }

  get isPending() {
    return this.name === PENDING;
  }

  get bannerContentForAH() {
    let content = '';
    if (this.isCreated) {
      content = RUP_CREATED_FOR_AH_CONTENT;
    } else if (this.isInDraft) {
      content = RUP_IN_DRAFT_FOR_AH_CONTENT;
    } else if (this.isPending) {
      content = RUP_PENDING_FOR_AH_CONTENT;
    } else if (this.isChangedRequested) {
      content = RUP_CHANGE_REQUESTED_FOR_AH_CONTENT;
    } else if (this.isCompleted) {
      content = RUP_COMPLETE_FOR_AH_CONTENT;
    }
    return content;
  }
}

export default PlanStatus;
