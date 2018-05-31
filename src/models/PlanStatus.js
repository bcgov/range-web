//
// MyRA
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//
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
