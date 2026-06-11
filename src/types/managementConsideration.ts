/**
 * A management consideration for the range use plan area.
 */
export interface ManagementConsideration {
  id: number;
  planId: number;
  detail: string | null;
  considerationTypeId?: number | null;
  url?: string | null;
  considerationType?: { id: number; name: string; active: boolean };
}
