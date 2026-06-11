/**
 * The invasive plant management checklist on a Plan.
 */
export interface InvasivePlantChecklist {
  id?: number;
  planId?: number;
  equipmentAndVehiclesParking: boolean;
  beginInUninfestedArea: boolean;
  undercarrigesInspected: boolean;
  revegetate: boolean;
  other: string | null;
}
