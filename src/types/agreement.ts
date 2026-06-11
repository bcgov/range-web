import { User , Client } from './user';
import { Plan } from './plan';
import { Status } from './status';

/**
 * Range usage for an agreement in a given year.
 */
export interface Usage {
  id: number;
  agreementId: string;
  year: number;
  authorizedAum: number;
  temporaryIncrease: number;
  totalAnnualUse: number;
  totalNonUse: number;
}

/**
 * A livestock identifier linked to an agreement.
 */
export interface LivestockIdentifier {
  id: number;
  agreementId: string;
  location: string | null;
  livestockType?: { id: number; name: string };
}

/**
 * Zone — a geographic management area assigned to a Range Officer.
 */
export interface Zone {
  id: number;
  code: string;
  description: string;
  districtId: number;
  district?: District;
  user?: User;
}

/**
 * District — a geographic administrative area containing zones.
 */
export interface District {
  id: number;
  code: string;
  description: string;
}

/**
 * Agreement type reference.
 */
export interface AgreementType {
  id: number;
  code: string;
  description: string;
}

/**
 * Agreement exemption status reference.
 */
export interface AgreementExemptionStatus {
  id: number;
  code: string;
  description: string;
}

/**
 * A range tenure agreement between the province and Agreement Holders.
 */
export interface Agreement {
  id: string;
  forestFileId: string;
  agreementStartDate: string;
  agreementEndDate: string;
  zoneId: number;
  agreementTypeId: number;
  retired: boolean | null;
  usageStatus: number | null;
  percentageUse: number | null;
  hasCurrentSchedule: boolean | null;
  exemptionStatus: string | null;

  /** Joined/computed relations */
  zone: Zone | null;
  agreementType: AgreementType | null;
  agreementExemptionStatus: AgreementExemptionStatus | null;
  plan: AgreementPlan | null;
  clients: Client[];
  usage: Usage[];
  livestockIdentifiers: LivestockIdentifier[];

  /** Computed getters (from backend) */
  isGrazingSchedule?: boolean;
  isHayCuttingSchedule?: boolean;
  isNoUse?: boolean;
  isOverUse?: boolean;
  usageStatusText?: string;
  percentageUseAmount?: number;
  hasOverUse?: boolean;
}

/**
 * The plan summary embedded within an Agreement (not the full Plan).
 */
export interface AgreementPlan {
  id: number;
  agreementId: string;
  statusId: number;
  rangeName: string;
  planStartDate: string | null;
  planEndDate: string | null;
  status: Status;
  extensionStatus: number | null;
  extensionRequiredVotes: number | null;
  extensionReceivedVotes: number | null;
  replacementOf: number | null;
  replacementPlanId: number | null;
}
