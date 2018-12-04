export const isBundled = process.env.NODE_ENV === 'production';

export const LOCAL_STORAGE_KEY = {
  AUTH: 'range-web-auth',
  USER: 'range-web-user',
  REFERENCE: 'range-web-reference',
};

export const TOAST_TIMEOUT = 9000;
export const NUMBER_OF_LIMIT_FOR_NOTE = 140;
export const SEARCH_DEBOUNCE_DELAY = 1000;
export const STICKY_HEADER_HEIGHT = 55;
export const CONTENT_MARGIN_TOP = 20;
export const CONTENT_MARGIN_BOTTOM = 40;

export const PLAN_STATUS = {
  PENDING: 'P',
  COMPLETED: 'O',
  DRAFT: 'D',
  CREATED: 'C',
  CHANGE_REQUESTED: 'R',
  STAFF_DRAFT: 'SD',
  WRONGLY_MADE_WITHOUT_EFFECT: 'WM',
  STANDS_WRONGLY_MADE: 'SW',
  STANDS: 'S',
  NOT_APPROVED_FURTHER_WORK_REQUIRED: 'NF',
  NOT_APPROVED: 'NA',
  APPROVED: 'A',
  SUBMITTED_FOR_REVIEW: 'SR',
  SUBMITTED_FOR_FINAL_DECISION: 'SFD',
  RECOMMEND_READY: 'RR',
  RECOMMEND_NOT_READY: 'RNR',
  RECOMMEND_FOR_SUBMISSION: 'RFS',
  READY_FOR_FINAL_DECISION: 'RFD',
  AWAITING_CONFIRMATION: 'AC',
};

export const APPROVED_PLAN_STATUSES = [
  PLAN_STATUS.APPROVED, PLAN_STATUS.STANDS, PLAN_STATUS.STANDS_WRONGLY_MADE,
];

export const NOT_DOWNLOADABLE_PLAN_STATUSES = [
  PLAN_STATUS.DRAFT, PLAN_STATUS.STAFF_DRAFT,
];

export const EDITABLE_PLAN_STATUSES = [
  PLAN_STATUS.CREATED, PLAN_STATUS.DRAFT, PLAN_STATUS.CHANGE_REQUESTED,
  PLAN_STATUS.RECOMMEND_NOT_READY, PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED,
];

export const REQUIRE_NOTES_PLAN_STATUSES = [
  PLAN_STATUS.CHANGE_REQUESTED, PLAN_STATUS.STANDS_WRONGLY_MADE,
  PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED, PLAN_STATUS.RECOMMEND_NOT_READY,
];

export const FEEDBACK_REQUIRED_FROM_STAFF_PLAN_STATUSES = [
  PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION, PLAN_STATUS.SUBMITTED_FOR_REVIEW,
];

export const AMENDMENT_TYPE = {
  MINOR: 'MNA',
  MANDATORY: 'MA',
  INITIAL: 'A',
};

export const CLIENT_TYPE = {
  PRIMARY: 'A',
  OTHER: 'B',
};

export const DATE_FORMAT = {
  SERVER_SIDE: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  CLIENT_SIDE: 'MMMM D, YYYY',
  CLIENT_SIDE_WITH_HOURS: 'MMM D, YYYY (HH:mm a)',
  CLIENT_SIDE_WITHOUT_YEAR: 'MMM D',
};

export const USER_ROLE = {
  ADMINISTRATOR: 'myra_admin',
  RANGE_OFFICER: 'myra_range_officer',
  AGREEMENT_HOLDER: 'myra_client',
};

export const PURPOSE_OF_ACTION = {
  ESTABLISH: 'establish',
  MAINTAIN: 'maintain',
  NONE: 'none',
};

export const PLANT_CRITERIA = {
  RANGE_READINESS: 'rangereadiness',
  STUBBLE_HEIGHT: 'stubbleheight',
  SHRUBUSE: 'shrubuse',
};

export const CONFIRMATION_OPTION = {
  CONFIRM: 'Confirm',
  REQUEST: 'Request clarification or changes',
};

export const CONFIRMATION_MODAL_ID = {
  MANAGE_ZONE: 'MANAGE_ZONE',
  MANAGE_CLIENT: 'MANAGE_CLIENT',
  UPDATE_PLAN_STATUS: 'UPDATE_PLAN_STATUS',
  DELETE_GRAZING_SCHEDULE: 'DELETE_GRAZING_SCHEDULE',
  DELETE_GRAZING_SCHEDULE_ENTRY: 'DELETE_GRAZING_SCHEDULE_ENTRY',
  SUBMIT_PLAN: 'SUBMIT_PLAN',
};

export const REFERENCE_KEY = {
  AGREEMENT_EXEMPTION_STATUS: 'AGREEMENT_EXEMPTION_STATUS',
  AGREEMENT_TYPE: 'AGREEMENT_TYPE',
  PLAN_STATUS: 'PLAN_STATUS',
  LIVESTOCK_TYPE: 'LIVESTOCK_TYPE',
  LIVESTOCK_IDENTIFIER_TYPE: 'LIVESTOCK_IDENTIFIER_TYPE',
  MINISTER_ISSUE_TYPE: 'MINISTER_ISSUE_TYPE',
  MINISTER_ISSUE_ACTION_TYPE: 'MINISTER_ISSUE_ACTION_TYPE',
  CLIENT_TYPE: 'CLIENT_TYPE',
  AMENDMENT_TYPE: 'AMENDMENT_TYPE',
};

export const IMAGE_SRC = {
  NAV_LOGO: '/images/navbar_logo.png',
  COW_PIC: '/images/cow.jpg',
  LOGIN_LOGO: '/images/login_logo.png',
  SIGNIN_BACKGROUND: '/images/signin_background.jpg',
  LOGIN_PARAGRAPH3: '/images/login_paragraph3.jpg',
  LOGIN_PARAGRAPH4: '/images/login_paragraph4.jpg',
  LOGIN_PARAGRAPH5: '/images/login_paragraph5.jpg',
  BASIC_INFORMATION_ICON: '/images/icon_basicinformation.svg',
  PASTURES_ICON: '/images/icon_pastures.svg',
  SCHEDULES_ICON: '/images/icon_schedules.svg',
  MINISTER_ISSUES_ICON: '/images/icon_ministersissues.svg',
  ADDITIONAL_REQS_ICON: '/images/icon_additionalreqs.svg',
  INVASIVE_PLANTS_ICON: '/images/icon_invasiveplants.svg',
  MANAGEMENT_ICON: '/images/icon_management.svg',
  MAP_ICON: '/images/icon_map.svg',
  PLANT_COMMUNITY_ACTIONS_ICON: '/images/icon_plantcommunityaction.svg',
  INFO_ICON: '/images/icon_info.svg',
  PASTURE_ICON: '/images/icon_pasture.svg',
  PLANT_COMMUNITY_ICON: '/images/icon_plantcommunity.svg',
};

export const ELEMENT_ID = {
  RUP_STICKY_HEADER: 'rup__sticky-header',
  BASIC_INFORMATION: 'rup__basic-information',
  PASTURES: 'rup__pastures',
  GRAZING_SCHEDULE: 'rup__grazing-schedule',
  MINISTER_ISSUES: 'rup__minister-issues',
  INVASIVE_PLANT_CHECKLIST: 'rup__ip-checklist',
  ADDITIONAL_REQUIREMENTS: 'rup__additional-requirements',
  MANAGEMENT_CONSIDERATIONS: 'rup__management-considerations',
  RUP_ZONE_DROPDOWN: 'rup__zone-dropdown',
  SIGN_OUT: 'sign-out',
  MANAGE_ZONE_ZONES_DROPDOWN: 'manage-zone__zone-dropdown',
  MANAGE_ZONE_CONTACTS_DROPDOWN: 'manage-zone__contact-dropdown',
  LOGIN_BUTTON: 'login-button',
  LOGIN_IDIR_BUTTON: 'login-idir-button',
  LOGIN_BCEID_BUTTON: 'login-bceid-button',
  SEARCH_TERM: 'searchTerm',
  MANAGE_CLIENT_USERS_DROPDOWN: 'manage-client__users-dropdown',
  MANAGE_CLIENT_CLIENTS_DROPDOWN: 'manage-client__clients-dropdown',
};
