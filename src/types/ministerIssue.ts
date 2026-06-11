/**
 * An action associated with a Minister Issue.
 */
export interface MinisterIssueAction {
  id: number;
  detail: string | null;
  actionTypeId: number;
  noGrazeStartMonth: number | null;
  noGrazeStartDay: number | null;
  noGrazeEndMonth: number | null;
  noGrazeEndDay: number | null;
}

/**
 * A minister's issue on a Plan — raised by a Decision Maker.
 */
export interface MinisterIssue {
  id: number;
  planId: number;
  detail: string | null;
  objective: string | null;
  identified: boolean;
  ministerIssueActions: MinisterIssueAction[];
  pastures: number[];
}
