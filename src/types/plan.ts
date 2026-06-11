import { Status } from './status';
import { User } from './user';
import { Pasture } from './pasture';
import { Schedule } from './schedule';
import { MinisterIssue } from './ministerIssue';
import { InvasivePlantChecklist } from './invasivePlantChecklist';
import { AdditionalRequirement } from './additionalRequirement';
import { ManagementConsideration } from './managementConsideration';

/**
 * A record of a plan status change.
 */
export interface PlanStatusHistory {
  id: number;
  planId: number;
  fromPlanStatusId: number | null;
  toPlanStatusId: number;
  note: string | null;
  createdAt: string;
  user?: User;
  fromPlanStatus?: Status;
  toPlanStatus?: Status;
}

/**
 * An Agreement Holder's confirmation (signature) on a plan.
 */
export interface PlanConfirmation {
  id: number;
  planId: number;
  clientId: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

/**
 * A file attachment on a plan.
 */
export interface PlanFile {
  id: number;
  planId: number;
  url: string;
  name?: string | null;
  createdAt?: string;
  user?: User;
}

/**
 * A plan extension request.
 */
export interface PlanExtensionRequest {
  id: number;
  planId: number;
  requesterId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  requester?: User;
}

/**
 * A Range Use Plan — the primary document managed in MYRA.
 */
export interface Plan {
  id: number;
  rangeName: string;
  planStartDate: string | null;
  planEndDate: string | null;
  notes: string | null;
  altBusinessName: string | null;
  agreementId: string;
  statusId: number;
  uploaded: boolean;
  amendmentTypeId: number | null;
  createdAt: string;
  updatedAt: string;
  effectiveAt: string | null;
  submittedAt: string | null;
  creatorId: number;
  canonicalId: number | null;
  isRestored: boolean | null;
  conditions: string | null;
  proposedConditions: string | null;
  livestockDistributionDetail: string | null;
  extensionStatus: number | null;
  extensionRequiredVotes: number | null;
  extensionReceivedVotes: number | null;
  replacementOf: number | null;
  extensionDate: string | null;
  extensionRejectedBy: number | null;
  replacementPlanId: number | null;

  /** Joined/eager-loaded relations */
  status: Status;
  creator?: User;
  pastures: Pasture[];
  schedules: Schedule[];
  ministerIssues: MinisterIssue[];
  planStatusHistory: PlanStatusHistory[];
  confirmations: PlanConfirmation[];
  invasivePlantChecklist: InvasivePlantChecklist | Record<string, never>;
  additionalRequirements: AdditionalRequirement[];
  managementConsiderations: ManagementConsideration[];
  files: PlanFile[];
  planExtensionRequests?: PlanExtensionRequest[];
  agreement?: import('./agreement').Agreement;

  /** Computed fields */
  requestedExtension?: boolean | null;
  requestedExtensionUserId?: number | null;
}
