// tenure agreement table header labels
export const RANGE_NUMBER = 'RAN Number';
export const RANGE_NAME = 'Range Name';
export const AGREEMENT_HOLDER = 'Agreement Holder';
export const STATUS = 'Status';
export const STAFF_CONTACT = 'Staff Contact';

// Range use plan basic information
export const PLAN_START = 'Plan Start Date';
export const PLAN_END = 'Plan End Date';
export const AGREEMENT_START = 'Agreement Start Date';
export const AGREEMENT_END = 'Agreement End Date';
export const AGREEMENT_DATE = 'Agreement Date';
export const AGREEMENT_TYPE = 'Agreement Type';
export const DISTRICT = 'District (Responsible)';
export const ZONE = 'Zone';
export const ALTERNATIVE_BUSINESS_NAME = 'Alternative Business Name';
export const AGREEMENT_HOLDERS = 'Agreement Holders';
export const TYPE = 'Type';
export const NOT_PROVIDED = 'Not provided';
export const NP = 'N/P';
export const NOT_SELECTED = 'Not selected';
export const NO_RUP_PROVIDED = 'No RUP found';
export const CONTACT_NAME = 'Contact Name';
export const CONTACT_EMAIL = 'Contact Email';
export const CONTACT_PHONE = 'Contact Phone';
export const EXTENDED = 'Extended';
export const EXEMPTION_STATUS = 'Exemption Status';
export const PLAN_DATE = 'Plan Date';
export const PRIMARY_AGREEMENT_HOLDER = 'Primary Agreement Holder';
export const OTHER_AGREEMENT_HOLDER = 'Agreement Holder (Other)';

// Range use plan pastures
export const ALLOWABLE_AUMS = 'Allowable AUMs';
export const PRIVATE_LAND_DEDUCTION = 'Private Land Deduction (%)';
export const GRACE_DAYS = 'Grace Days';
export const PASTURE_NOTES = 'Pasture Notes';

// Range use plan schedules
export const PASTURE = 'Pasture';
export const LIVESTOCK_TYPE = 'Livestock Type';
export const NUM_OF_ANIMALS = '# of Animals';
export const DATE_IN = 'Date in';
export const DATE_OUT = 'Date out';
export const DAYS = 'Days';
export const PLD = 'PLD';
export const CROWN_AUMS = 'Crown AUMs';

export const CONTACT_NO_EXIST = 'Contact doesn\'t exist';

// messages
export const UNEXPECTED_ERROR = 'An unexpected error occurred.';
export const STATUS404 = 'The request is currently not available, please try later.';
export const STATUS500 = 'Internal server error occurred, please contact the administrator.';
export const UPDATE_PLAN_STATUS_SUCCESS = 'You have successfully updated the status of the range use plan.';
export const UPDATE_AGREEMENT_ZONE_SUCCESS = 'You have successfully updated the zone of the range use plan.';
export const ASSIGN_STAFF_TO_ZONE_SUCCESS = 'You have successfully assigned the staff to the zone.';
export const SAVE_PLAN_AS_DRAFT_SUCCESS = 'You have successfully saved the range use plan as a draft.';
export const SUBMIT_PLAN_SUCCESS = 'You have successfully submitted the range use plan to the range staff.';
export const EMPTY_GRAZING_SCHEDULE_ENTRIES = 'Schedule must have at least 1 entry.';
export const INVALID_GRAZING_SCHEDULE_ENTRY = 'Schedule has one or more invalid entries.';
export const TOTAL_AUMS_EXCEEDS = 'Total AUMs exceeds authorized AUMs.';
export const USER_NOT_ACTIVE = 'This account is not active yet, please contact the administrator.';
export const USER_NO_ROLE = 'This account doesn\'t have a role, please contact the administrator.';
export const USER_NOT_REGISTERED = 'This account has not been registered.';
export const LOADING_USER = 'Loading User Information';
export const LINK_CLIENT_SUCCESS = 'You have successfully linked the client.';
export const NO_INTERNET = 'There is no Internet connection.';
export const TYPE_CLIENT_NAME = 'Type name of the client';
export const NO_RESULTS_FOUND = 'No result founds.';
export const ERROR_OCCUR = 'Error Occured!';

// modals
export const COMPLETED_CONFIRMATION_HEADER = 'Update Status: Completed';
export const COMPLETED_CONFIRMATION_CONTENT = 'COMPLETE indicates that a RUP has either been APPROVED or DISCARDED. If you change status to COMPLETE you will no longer be able to make edits to this RUP. Would you like to switch this RUP to complete?';
export const PENDING_CONFIRMATION_HEADER = 'Update Status: Pending';
export const PENDING_CONFIRMATION_CONTENT = 'PENDING indicates that a RUP is in edit mode. It is used during initial creation if the decision maker has requested edits before approving. Do not switch the status to PENDING unless the decision maker has requested specific edits. Would you like to switch this RUP to Pending?';
export const UPDATE_CONTACT_CONFIRMATION_HEADER = 'Confirmation: Update Contact';
export const UPDATE_CONTACT_CONFIRMATION_CONTENT = 'Are you sure you want to update the contact?';
export const DELETE_SCHEDULE_FOR_AH_HEADER = 'Confirmation: Deleting Grazing Schedule';
export const DELETE_SCHEDULE_FOR_AH_CONTENT = 'This schedule will be permanently deleted. Are you sure you want to delete this schedule?';
export const DELETE_SCHEDULE_ENTRY_FOR_AH_HEADER = 'Confirmation: Deleting Grazing Schedule Entry';
export const DELETE_SCHEDULE_ENTRY_FOR_AH_CONTENT = 'This schedule entry will be permanently deleted. Are you sure you want to delete this schedule entry?';
export const UPDATE_CLIENT_ID_FOR_AH_HEADER = 'Confirmation: Link Client';
export const UPDATE_CLIENT_ID_FOR_AH_CONTENT = 'Are you sure you want to link this user to the client?';
export const SUBMIT_RUP_CHANGE_FOR_AH_HEADER = 'Ready to Submit?';
export const SUBMIT_RUP_CHANGE_FOR_AH_CONTENT = 'Once submitted you can no longer make edits to the Range Use Plan. Do not submit until you are satisfied with all content.';

// banners
export const DETAIL_RUP_BANNER_CONTENT = 'View the full PDF file or update the status of the range use plan.';
export const DETAIL_RUP_EDIT_BANNER_CONTENT = 'Please finalize your changes and submit for final approval';
export const SELECT_RUP_BANNER_HEADER = 'Select Range Use Plan';
export const SELECT_RUP_BANNER_CONTENT = 'View details of each range use plan. Enter RAN number, agreement holder\'s name, or staff contact in the search box to search for a specific range use plan.';
export const MANAGE_ZONE_BANNER_HEADER = 'Manage Zone';
export const MANAGE_ZONE_BANNER_CONTENT = 'Follow steps to assign a zone from the current staff to other staff.';
export const RUP_CREATED_FOR_AH_CONTENT = 'Please confirm your range use plan.';
export const RUP_IN_DRAFT_FOR_AH_CONTENT = 'Please finalize your changes and submit for Range staff review.';
export const RUP_PENDING_FOR_AH_CONTENT = 'Your range use plan is currently being reviewed by range staff.';
export const RUP_CHANGE_REQUESTED_FOR_AH_CONTENT = 'Your range use plan was reviewed by Range staff and requires revisions. Please make changes and resubmit.';
export const RUP_COMPLETE_FOR_AH_CONTENT = 'Your range use plan is approved by Range staff.';
export const MANAGE_CLIENT_BANNER_HEADER = 'Manage Client';
export const MANAGE_CLIENT_BANNER_CONTENT = 'Follow the steps below to link the user to their client number.';

// statuses of range use plan in user perspective
export const INPUT_REQUIRED = 'Input Required';
export const REVIEW_REQUIRED = 'Review Required';
export const IN_REVIEW = 'In Review';
export const REVISIONS_REQUESTED = 'Revisions Requested';
export const SENT_FOR_INPUT = 'Sent for Input';
export const IN_PROGRESS = 'In Progress';
