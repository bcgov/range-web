export const APP_NAME = 'MyRangeBC'

// page titles
const createTitle = title => `${title} | ${APP_NAME}`
export const LOGIN_TITLE = createTitle('Sign in')
export const DETAIL_RUP_TITLE = createTitle('View RUP')
export const SELECT_RUP_TITLE = createTitle('Select RUP')
export const MANAGE_CLIENT_TITLE = createTitle('Manage Clients')
export const MANAGE_ZONE_TITLE = createTitle('Manage Zones')
export const PAGE_NOT_FOUND_TITLE = createTitle('Page Not Found')

export const SELECT_RUP = 'Select RUP'
export const MANAGE_ZONES = 'Manage Zones'
export const MANAGE_CLIENTS = 'Manage Clients'

// Agreement Table
export const RANGE_NUMBER = 'RAN'
export const RANGE_NAME = 'Range Name'
export const AGREEMENT_HOLDER = 'Primary Agreement Holder'
export const STATUS = 'Status'
export const STAFF_CONTACT = 'Staff Contact'
export const EFFECTIVE_DATE = 'Effective Date'
export const SUBMITTED = 'Submitted'
export const AGREEMENT_SEARCH_PLACEHOLDER =
  "Enter RAN, agreement holder's name, or staff contact"
export const INITIAL_PLAN = 'Initial Plan'

// RUP View
export const PREVIEW_PDF = 'Preview PDF'
export const DOWNLOAD_PDF = 'Download PDF'
export const PLAN_ACTIONS = 'Plan Actions'
export const SAVE_DRAFT = 'Save Draft'
export const SUBMIT = 'Submit'
export const AMEND_PLAN = 'Amend Plan'
export const DISCARD_AMENDMENT = 'Discard Amendment'
export const SIGN_SUBMISSION = 'Sign Submission'
export const VIEW = 'View'
export const AWAITING_CONFIRMATION = 'Awaiting Confirmation'
export const VIEW_VERSIONS = 'View Versions'

// RUP tabs
export const CONDITIONS = 'Conditions'
export const RECOMENDATIONS = 'Recommendations'
export const BASIC_INFORMATION = 'Basic Information'
export const PASTURES = 'Pastures'
export const USAGE = 'Usage'
export const SCHEDULES = 'Schedules'
export const YEARLY_SCHEDULES = 'Yearly Schedules'
export const MINISTER_ISSUES = "Minister's Issues"
export const MINISTERS_ISSUES_AND_ACTIONS = "Minister's Issues and Actions"
export const INVASIVE_PLANTS = 'Invasive Plants'
export const ADDITIONAL_REQUIREMENTS = 'Additional Requirements'
export const MANAGEMENT_CONSIDERATIONS = 'Management Considerations'
export const ATTACHMENTS = 'Attachments'

// RUP basic information
export const PLAN_START = 'Plan Start Date'
export const PLAN_END = 'Plan End Date'
export const AGREEMENT_START = 'Agreement Start Date'
export const AGREEMENT_END = 'Agreement End Date'
export const AGREEMENT_DATE = 'Agreement Date'
export const AGREEMENT_TYPE = 'Agreement Type'
export const DISTRICT = 'District (Responsible)'
export const ZONE = 'Zone'
export const ALTERNATIVE_BUSINESS_NAME = 'Alternative Business Name'
export const AGREEMENT_HOLDERS = 'Agreement Holders'
export const TYPE = 'Type'
export const NOT_PROVIDED = 'Not provided'
export const NP = 'N/P'
export const NO_PLAN = 'No Plan'
export const NOT_SELECTED = 'Not selected'
export const NO_RUP_PROVIDED = 'No RUP found'
export const CONTACT_NAME = 'Contact Name'
export const CONTACT_EMAIL = 'Contact Email'
export const CONTACT_PHONE = 'Contact Phone'
export const EXTENDED = 'Extended'
export const EXEMPTION_STATUS = 'Exemption Status'
export const PLAN_DATE = 'Plan Date'
export const PLAN_START_DATE = 'Plan Start Date'
export const PLAN_END_DATE = 'Plan End Date'
export const PRIMARY_AGREEMENT_HOLDER = 'Primary Agreement Holder'
export const OTHER_AGREEMENT_HOLDER = 'Agreement Holder (Other)'

// RUP Usage
export const YEAR = 'Year'
export const AUTH_AUMS = 'Auth AUMs'
export const TEMP_INCREASE = 'Temp Increase'
export const BILLABLE_NON_USE = 'Non-Use'
export const TOTAL_ANNUAL_USE = 'Total Annual'

// RUP pastures
export const PASTURE_NAME = 'Pasture Name'
export const ALLOWABLE_AUMS = 'Allowable AUMs'
export const PRIVATE_LAND_DEDUCTION = 'Private Land Deduction (%)'
export const GRACE_DAYS = 'Grace Days'
export const PASTURE_NOTES = 'Pasture Notes (non legal content)'

// RUP Plant Communities
export const ASPECT = 'Aspect'
export const ELEVATION = 'Elevation (m)'
export const APPROVED_BY_MINISTER = 'Approved by minister'
export const PLANT_COMMUNITY_NOTES = 'Plant Community Description'
export const COMMUNITY_URL = 'Community URL'
export const PURPOSE_OF_ACTION = 'Purpose of Action'

// RUP schedules
export const PASTURE = 'Pasture'
export const LIVESTOCK_TYPE = 'Livestock Type'
export const NUM_OF_ANIMALS = '# of Animals'
export const DATE_IN = 'Date in'
export const DATE_OUT = 'Date out'
export const DAYS = 'Days'
export const PLD = 'PLD'
export const CROWN_AUMS = 'Crown AUMs'

// RUP minister issues
export const CONTACT_NO_EXIST = "Contact doesn't exist"
export const ACTION_NOTE =
  'Note: If an action involves a range development or removal of timber (ex. off-stream watering or fence) a separate authorization is required. Please contact a range staff member if you are considering such an action.'

// Manage Zone
export const NO_DESCRIPTION = 'No description available'
export const NOT_ASSIGNED = 'Not assigned'

// messages
export const UNEXPECTED_ERROR = 'An unexpected error occurred.'
export const STATUS404 =
  'The request is currently not available, please try later.'
export const STATUS500 =
  'Internal server error occurred, please contact the administrator (MyRangeBC@gov.bc.ca).'
export const UPDATE_PLAN_STATUS_SUCCESS =
  'You have successfully updated the status of the range use plan.'
export const UPDATE_AGREEMENT_ZONE_SUCCESS =
  'You have successfully updated the zone of the range use plan.'
export const ASSIGN_STAFF_TO_ZONE_SUCCESS =
  'You have successfully assigned the staff to the zone.'
export const SAVE_PLAN_AS_DRAFT_SUCCESS =
  'You have successfully saved the range use plan as a draft.'
export const STAFF_SAVE_PLAN_DRAFT_SUCCESS =
  'Your changes have been successfully saved to the range use plan.'
export const UPDATE_USER_PROFILE_SUCCESS =
  'You have successfully update your profile.'
export const SUBMIT_PLAN_SUCCESS =
  'You have successfully submitted the range use plan to the range staff.'
export const EMPTY_GRAZING_SCHEDULE_ENTRIES =
  'Schedule must have at least 1 entry.'
export const EMPTY_PASTURES = 'Plan must have at least one pasture.'
export const INVALID_GRAZING_SCHEDULE_ENTRY =
  'Schedule has one or more invalid entries.'
export const UNAPPROVED_PLANT_COMMUNITIES =
  'There are one or more plant communities that have not been approved by the minister'
export const UNIDENTIFIED_MINISTER_ISSUES =
  'There are one or more minister issues that have not been identified by the minister'
export const TOTAL_AUMS_EXCEEDS = 'Total AUMs exceeds authorized AUMs.'
export const USER_NOT_ACTIVE =
  'This account is not active yet. Please contact the administrator (MyRangeBC@gov.bc.ca).'
export const USER_NO_ROLE =
  'This account has not been assigned a role, please contact the administrator (MyRangeBC@gov.bc.ca).'
export const USER_NOT_REGISTERED = 'This account has not been registered.'
export const LOADING_USER = 'Loading User Information'
export const LINK_CLIENT_SUCCESS = 'You have successfully linked the client.'
export const NO_INTERNET = 'There is no Internet connection.'
export const TYPE_CLIENT_NAME = 'Type name of the client'
export const NO_RESULTS_FOUND = 'No result founds.'
export const ERROR_OCCUR = 'Error Occurred!'
export const REDIRECTING = 'Please wait while redirecting...'
export const CREATE_AMENDMENT_SUCCESS =
  'You have successfully created an amendment'
export const SIGN_IN_ERROR = 'Error occurred while signing in.'
export const UPDATE_USER_ERROR = 'Error occurred while updating your profile.'
export const NO_CLIENT_NUMBER_ASSIGNED =
  'Your account has not yet been linked to a client number. Please contact your local range staff office.'
export const GET_ZONES_ERROR = 'Error occurred while fetching zones'
export const GET_USERS_ERROR = 'Error occurred while fetching users'

// modals
export const COMPLETED_CONFIRM_HEADER = 'Update Status: Completed'
export const COMPLETED_CONFIRM_CONTENT =
  'COMPLETE indicates that a RUP has either been APPROVED or DISCARDED. If you change status to COMPLETE you will no longer be able to make edits to this RUP. Would you like to switch this RUP to complete?'
export const PENDING_CONFIRM_HEADER = 'Update Status: Pending'
export const PENDING_CONFIRM_CONTENT =
  'PENDING indicates that a RUP is in edit mode. It is used during initial creation if the decision maker has requested edits before approving. Do not switch the status to PENDING unless the decision maker has requested specific edits. Would you like to switch this RUP to Pending?'
export const CHANGE_REQUEST_CONFIRM_HEADER = 'Update Status: Change Request'
export const CHANGE_REQUEST_CONFIRM_CONTENT =
  "Are you sure you want to request changes? All agreement holders will need to review and sign again if they've signed previously."
export const WRONGLY_MADE_WITHOUT_EFFECT_CONFIRM_HEADER =
  'Update Status: Wrongly Made - Without Effect'
export const WRONGLY_MADE_WITHOUT_EFFECT_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const STANDS_CONFIRM_HEADER = 'Update Status: Stands'
export const STANDS_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const STANDS_REVIEW_HEADER = 'Stands - Requires Review'
export const STANDS_REVIEW_CONTENT =
  'Are you sure you want to update the status?'
export const STANDS_WRONGLY_MADE_CONFIRM_HEADER =
  'Update Status: Stands - Wrongly Made'
export const STANDS_WRONGLY_MADE_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const APPROVED_CONFIRM_HEADER = 'Update Status: Approved'
export const APPROVED_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const NOT_APPROVED_CONFIRM_HEADER = 'Update Status: Not Approved'
export const NOT_APPROVED_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const NOT_APPROVED_FWR_CONFIRM_HEADER =
  'Return to staff to request changes from agreement holder'
export const NOT_APPROVED_FWR_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const RECOMMEND_READY_CONFIRM_HEADER = 'Update Status: Recommend Ready'
export const RECOMMEND_READY_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const RECOMMEND_NOT_READY_CONFIRM_HEADER =
  'Update Status: Recommend Not Ready'
export const RECOMMEND_NOT_READY_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const RECOMMEND_FOR_SUBMISSION_CONFIRM_HEADER =
  'Update Status: Recommend For Submission'
export const RECOMMEND_FOR_SUBMISSION_CONFIRM_CONTENT =
  'Are you sure you want to update the status?'
export const AMEND_PLAN_CONFIRM_HEADER = 'Amend Range Use Plan'
export const AMEND_PLAN_CONFIRM_CONTENT =
  'Are you sure you want to amend this range use plan?'
export const SUBMIT_PLAN_CONFIRM_HEADER = 'Confirm'
export const SUBMIT_PLAN_CONFIRM_CONTENT =
  'You will not be able to edit this RUP after submission.'

export const UPDATE_CONTACT_CONFIRM_HEADER =
  'Confirmation: Update Contact with Zone'
export const UPDATE_CONTACT_CONFIRM_CONTENT =
  'Are you sure you want to update this contact?'
export const DELETE_SCHEDULE_CONFIRM_HEADER =
  'Confirmation: Deleting Grazing Schedule'
export const DELETE_SCHEDULE_CONFIRM_CONTENT =
  'This schedule will be permanently deleted. Are you sure you want to delete this schedule?'
export const DELETE_SCHEDULE_ENTRY_CONFIRM_HEADER =
  'Confirmation: Deleting Grazing Schedule Entry'
export const DELETE_SCHEDULE_ENTRY_CONFIRM_CONTENT =
  'This schedule entry will be permanently deleted. Are you sure you want to delete this schedule entry?'
export const DELETE_MINISTER_ISSUE_ACTION_CONFIRM_HEADER =
  'Confirmation: Deleting Minister Issue Action'
export const DELETE_MINISTER_ISSUE_ACTION_CONFIRM_CONTENT =
  'This action will be permanently deleted. Are you sure you want to delete this minister issue action?'
export const DELETE_MANAGEMENT_CONSIDERATION_CONFIRM_HEADER =
  'Confirmation: Deleting Management Consideration'
export const DELETE_MANAGEMENT_CONSIDERATION_CONFIRM_CONTENT =
  'This consideration will be permanently deleted. Are you sure you want to delete this management consideration?'

export const UPDATE_CLIENT_ID_CONFIRM_HEADER = 'Confirmation: Link Client'
export const UPDATE_CLIENT_ID_CONFIRM_CONTENT =
  'Are you sure you want to link this user to the client?'
export const SUBMIT_RUP_CHANGE_CONFIRM_HEADER = 'Ready to Submit?'
export const SUBMIT_RUP_CHANGE_CONFIRM_CONTENT =
  'Once submitted you can no longer make edits to the Range Use Plan. Do not submit until you are satisfied with all content.'

// banners
export const SELECT_RUP_BANNER_HEADER = 'Select Range Use Plan'
export const SELECT_RUP_BANNER_CONTENT =
  "View details of each range use plan. Enter RAN, agreement holder's name, or staff contact in the search box to find a specific range use plan."
export const MANAGE_ZONE_BANNER_HEADER = 'Manage Zones'
export const MANAGE_ZONE_BANNER_CONTENT =
  'Search for range staff and link them to their corresonding zone.'
export const MANAGE_CLIENT_BANNER_HEADER = 'Manage Clients'
export const MANAGE_CLIENT_BANNER_CONTENT =
  'Search for agreement holders and link them to their corresponding client.'

// tips
export const CONDITIONS_TIP =
  'Review and update as needed the proposed conditions that would be imposed under FRPA 112 as part of this decision'
export const PROPOSED_CONDITIONS_TIP =
  'Enter the approval conditions you recommend the DM impose as part of RUP approval consistent with FRPA 112'
export const BASIC_INFORMATION_TIP =
  'Agreement specifics from FTA (including usage) and plan specifics entered by staff. If there is agreement information that is incorrect, update FTA and wait until next FTA sync (daily).'
export const RANGE_NAME_TIP =
  "Each agreement needs to have a common name (descriptive or nickname) to easily distinguish between ranges when an agreement holder has more than one. If the agreement holder has only one agreement the range name might be simply 'crown.'"
export const PASTURES_TIP =
  "FRPA section 33 indicates that an RUP for grazing must include both a map showing pastures and a schedule having livestock class, number and period of use for each pasture. Where an agreement area is not subdivided into pastures there is a single pastures whose boundary matches that of the agreement. Pastures may be one of two types: 1. Closed: those having the entire boundary accurately defined by physical barriers (ex. fence or NRB) 2. Open: those not having the entire boundary accurately defined by physical barriers (i.e. at least a portion of the boundary reflects an approximate transition between one pasture and the next). You might choose to select a 'grace days' value appropriate for the pasture type."
export const PRIVATE_LAND_DEDUCTION_TIP =
  'Percentage of total forage grazed from this pasture attributed to private land.'
export const ALLOWABLE_AUMS_TIP =
  "Approved maximum AUM allocation for this pasture. The default is 'not set' to indicate that there is not an approved AUM allocation for the pasture. Overwrite this value if there is an approved AUM allocation."
export const PLANT_COMMUNITY_ACTIONS_TIP =
  'RPPR section 13(1) allows the minister to specify actions to establish or maintain a described plant community. Actions are to be determined by staff and accepted by the decision maker before sending the RUP or amendment to the agreement holder. In some situations it may be appropriate to discuss the specifics of the plant community with the agreement holder before determining the actions and seeking acceptance from the decision maker.'
export const CRITERIA_TIP =
  'RPPR section 13 allows the minister to specify range readiness and stubble height criteria that are either described in the Schedule or consistent with objectives set by government. Readiness defaults for species in this app are consistent with the schedule.'
export const RANGE_READINESS_OTHER_TIP =
  "Readiness may be expressed as a statement such as 'Soil sufficiently dry to prevent pugging'."
export const SHRUB_USE_TIP =
  'RPPR section 29 indicates that unless otherwise specified in the RUP acceptable average browse is 25% of current annual grown.'
export const MONITORING_AREAS_TIP =
  'Every plant community must have at least one monitoring area. Rather than an extensive sampling approach to determine an average criteria measurement (ex. leaf stage or stubble height), monitoring areas are selected in locations that reflect an average condition within the plant community for the purpose selected. The location of monitoring areas should be carefully selected based on the purpose(s) of the monitoring area. An appropriate location for sampling for average readiness criteria may not be appropriate for sampling for average stubble height. Recognizing that management occurs primarily at the pasture level, where a pasture includes multiple plant communities you will likely want to select monitoring areas within the plant communities that are most relevant for the various criteria included.'
export const MONITOING_AREA_PURPOSE_TIP =
  'Each monitoring area must be selected carefully based on the purpose it is needed. Range Readiness: date, average plant growth or text statement that identifies when range is ready to be grazed. Stubble Height: the average height of plants remaining after grazing. Shrub Use: average browse use level of current annual growth. Key Area: a relatively small portion of a range selected because of its location, use or grazing values as a monitoring point for grazing use. It is assumed that, if properly selected, key areas will reflect the overall acceptability of current grazing management over the range. Other: text description of why a monitoring area is selected (ex. tracking an issue).'
export const USAGE_TIP =
  'Authorized usaged entered in FTA. If incorrect or incomplete, update FTA and wait for daily sync of MyRangeBC with FTA.'
export const YEARLY_SCHEDULES_TIP =
  'FRPA section 33 states that every RUP must include a schedule that includes livestock class, number and period of use for each pasture. Every schedule must have at least one row in the schedule grid. The schedule description/narrative is optional but when included is legal content. On/off schedules (off being on private land) are addressed using PLD % at the pasture level. Straggler clause is recorded using the schedule narrative. Staff may either require that a schedule be provided for all plan years at the time of RUP approval OR that a new schedule be provided every year. Options to copy an entire schedule to another year or to copy a single schedule row are available by selecting the three dots at the right.'
export const MINISTERS_ISSUES_AND_ACTIONS_TIP =
  'FRPA section 33 indicates that actions to deal with issues identified by the minister must be specified in the RUP. Issues must be identified by the delegated decision maker (either on a site-specific basis or as a set of issues and conditions when they apply in a district) and documentation included on file before an RUP can be sent to an agreement holder for their input. Refer to the Minister’s Issue Policy for details on identifying issues for RUP content.'
export const IDENTIFIED_BY_MINISTER_TOGGLE_TIP =
  'Do not move the toggle to “identified” until documentation regarding the identification by the delegated decision maker is on file.'
export const INVASIVE_PLANTS_TIP =
  'RPPR 15 indicates that an RUP must include measures to prevent the introduction and spread of invasive plant species if the introduction, spread, or both are likely to be the result of the person’s range pracitices. This content is specific to the practices of the agreement holder not other crown land users. All range practices have the potential to result in introduction or spread of invasive plants and this is a required section of the plan.'
export const ADDITIONAL_REQUIREMENTS_TIP =
  'Other orders, agreements, plans etc. may have content that is relevant to range related activities. Inclusion of that content in the RUP is redundant and creates potential for inconsistency or error. This section is included to inform the agreement holder and the decision maker of other agreements for consideration/review when preparing and making a decision on an RUP. When an agreement is available online include the URL for convenience.'
export const MANAGEMENT_CONSIDERATIONS_TIP =
  'Agreement holders may have information related to their operations that they want to have documented with their RUP. While not legal, this content can help explain the context for operations. This section is completely optional and fully within the domain of the agreement holder.'
export const APPROVED_BY_MINISTER_TIP =
  'Place documentation of descision makers approval to include this plant community information on file before updating & sending to agreement holders.'
