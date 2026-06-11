import { PageForAHProps } from '../pageForAH/props';

export interface PageForStaffProps extends PageForAHProps {
  isFetchingPlan: boolean;
  updateRUP: (...args: any[]) => any;
  formik: any;
}

export { defaultProps } from '../pageForAH/props';
