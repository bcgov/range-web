/**
 * A grazing or hay cutting schedule entry — a single row specifying livestock movement.
 */
export interface ScheduleEntry {
  id: number;
  scheduleId: number;
  pastureId: number | null;
  dateIn: string | null;
  dateOut: string | null;
  /** Grazing schedule fields */
  livestockCount: number | null;
  livestockTypeId: number | null;
  graceDays: number | null;
  /** Hay cutting schedule fields */
  stubbleHeight: number | null;
  tonnes: number | null;
}

/**
 * A grazing or hay cutting schedule within a Plan.
 */
export interface Schedule {
  id: number;
  year: number;
  narative: string | null;
  planId: number;
  canonicalId?: number | null;
  sortBy: string | null;
  sortOrder: string | null;
  createdAt?: string;
  scheduleEntries: ScheduleEntry[];
}
