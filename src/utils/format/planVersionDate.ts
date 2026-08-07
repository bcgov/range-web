import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const PLAN_TIMEZONE = 'America/Vancouver';

export const formatPlanVersionDate = (date: string | Date | null | undefined): string =>
  date ? dayjs.utc(date).tz(PLAN_TIMEZONE).format('MMM DD YYYY h:mm a') : '';
