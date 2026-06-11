/**
 * An additional requirement on a Plan.
 */
export interface AdditionalRequirement {
  id: number;
  planId: number;
  categoryId: number | null;
  detail: string | null;
  url: string | null;
  category?: { id: number; name: string; active: boolean };
}
