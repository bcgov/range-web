import { useState } from 'react';
import uuid from 'uuid-v4';
import { downloadScheduleCsv } from '../../../api';
import { useToast } from '../../../providers/ToastProvider';

export const UNSAVED_SCHEDULE_MESSAGE = 'Save the plan before exporting this schedule.';
export const EXPORT_ERROR_MESSAGE = 'Error exporting schedule';

interface ExportableSchedule {
  id: string | number;
  planId: string | number;
  year: number;
}

/**
 * Downloads a schedule as CSV from the API.
 *
 * The export is served by the API rather than built in the browser so the rows
 * always reflect the persisted schedule — including its saved sort order — and
 * so grazing and hay cutting schedules share one source of truth for columns.
 */
const useScheduleCsvExport = (schedule: ExportableSchedule) => {
  const { successToast, errorToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportCsv = async (): Promise<void> => {
    // A schedule that only exists in the Formik form has a client-generated
    // UUID and no server-side row to export yet.
    if (uuid.isUUID(String(schedule.id))) {
      errorToast(UNSAVED_SCHEDULE_MESSAGE);
      return;
    }

    setIsExporting(true);

    try {
      await downloadScheduleCsv(schedule.planId, schedule.id, `${schedule.year}_schedule.csv`);
      successToast(`Exported ${schedule.year} schedule`);
    } catch (error: any) {
      errorToast(error?.data?.error || EXPORT_ERROR_MESSAGE);
    } finally {
      setIsExporting(false);
    }
  };

  return { exportCsv, isExporting };
};

export default useScheduleCsvExport;
