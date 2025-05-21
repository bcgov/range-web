import * as Yup from 'yup';
import { moveDecimalsRight } from '../common/form/PercentField';

const handleNull =
  (defaultValue = '') =>
  (v) =>
    v === null ? defaultValue : v;

const RUPSchema = Yup.object().shape({
  rangeName: Yup.string().required('Required field'),
  altBusinessName: Yup.string().transform(handleNull()),
  planStartDate: Yup.string().required('Required field').nullable().transform(handleNull()),
  planEndDate: Yup.string()
    .required('Required field')
    .nullable()
    .transform(handleNull())
    .when('planStartDate', (planStartDate, schema) =>
      schema.test({
        test: (planEndDate) => new Date(planEndDate) > new Date(planStartDate),
        message: 'Plan end date should be after start date',
      }),
    ),
  pastures: Yup.array().of(
    Yup.object().shape({
      allowableAum: Yup.number()
        .nullable()
        .transform((v, originalValue) => (originalValue === '' ? null : v))
        .integer('Value must be a whole number')
        .typeError('Please enter a number'),
      graceDays: Yup.number()
        .transform((v, originalValue) => (originalValue === '' ? null : v))
        .nullable()
        .integer('Value must be a whole number')
        .typeError('Please enter a number'),
      name: Yup.string().required('Please enter a name'),
      notes: Yup.string().transform(handleNull()).nullable(),
      planId: Yup.number(),
      pldPercent: Yup.number()
        .min(0, 'Please enter a value between 0 and 100')
        .max(1, 'Please enter a value between 0 and 100')
        .test('whole percent', 'Value must be a whole number', (item) => {
          return item ? (moveDecimalsRight(item) % 1 === 0 ? true : false) : true;
        })
        .transform((v, originalValue) => (originalValue === '' ? null : v))
        .nullable()
        .typeError('Please enter a number'),
      plantCommunities: Yup.array().of(
        Yup.object().shape({
          approved: Yup.bool().required(),
          aspect: Yup.string().nullable().transform(handleNull()),
          elevationId: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable(),
          notes: Yup.string().transform(handleNull()).required('Required field'),
          url: Yup.string().transform(handleNull()),
          purposeOfAction: Yup.string().required('Required field'),
          shrubUse: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable(),
          rangeReadinessMonth: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable(),
          rangeReadinessDay: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable(),
          rangeReadinessNote: Yup.string().transform(handleNull()).nullable(),
          plantCommunityActions: Yup.array().of(
            Yup.object().shape({
              actionTypeId: Yup.number()
                .transform((v, originalValue) => (originalValue === '' ? null : v))
                .nullable()
                .required('Required field'),
              details: Yup.string().nullable().required('Required field'),
              name: Yup.string()
                .nullable()
                .when('actionTypeId', {
                  is: 6,
                  then: Yup.string().required('Required field'),
                  otherwise: Yup.string(),
                }),
            }),
          ),
          indicatorPlants: Yup.array().of(
            Yup.object().shape({
              plantSpeciesId: Yup.number()
                .transform((v, originalValue) => (originalValue === '' ? null : v))
                .nullable()
                .required('Required field'),
              value: Yup.number()
                .transform((v, originalValue) => (originalValue === '' ? null : v))
                .nullable()
                .required('Required field')
                .typeError('Please enter a number'),
              name: Yup.string()
                .nullable()
                .transform(handleNull(''))
                .when('plantSpeciesId', {
                  is: 81,
                  then: Yup.string().required('Required field'),
                  otherwise: Yup.string(),
                }),
            }),
          ),
          monitoringAreas: Yup.array().of(
            Yup.object().shape({
              latitude: Yup.number()
                .transform((v, originalValue) => (originalValue === '' ? null : v))
                .nullable()
                .typeError('Please enter a number'),
              longitude: Yup.number()
                .transform((v, originalValue) => (originalValue === '' ? null : v))
                .nullable()
                .typeError('Please enter a number'),
              location: Yup.string().nullable().required('Required field'),
              rangelandHealthId: Yup.number()
                .transform((v, originalValue) => (originalValue === '' ? null : v))
                .nullable(),
              purposeTypeIds: Yup.array().of(Yup.number()).required('Required field'),
            }),
          ),
        }),
      ),
    }),
  ),
  schedules: Yup.array().of(
    Yup.object().shape({
      narative: Yup.string().transform(handleNull()),
      scheduleEntries: Yup.array().of(
        Yup.object().shape({
          dateIn: Yup.string()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable()
            .required('Date in is required'),
          dateOut: Yup.string()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable()
            .required('Date out is required')
            .when('dateIn', (dateIn, schema) =>
              schema.test({
                test: (dateOut) => {
                  if (!dateIn || !dateOut) return true; // Skip test if either date is missing
                  return new Date(dateOut) > new Date(dateIn);
                },
                message: 'Date out must be after date in',
              }),
            ),
          pastureId: Yup.mixed()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable()
            .test('pasture-area-required', 'Area/Pasture is required', function (value) {
              // Always require pastureId/area - the message will be contextual
              return value != null && value !== '';
            }),
          // Grazing schedule fields - only required when present
          livestockCount: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable()
            .test('livestock-required', 'Livestock count is required', function (value) {
              const { livestockTypeId } = this.parent;
              // If livestockTypeId is provided, then livestockCount is required
              if (livestockTypeId != null && livestockTypeId !== '') {
                return value != null && value !== '';
              }
              return true;
            }),
          livestockTypeId: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable()
            .test('livestock-type-required', 'Livestock type is required', function (value) {
              const { livestockCount } = this.parent;
              // If livestockCount is provided, then livestockTypeId is required
              if (livestockCount != null && livestockCount !== '') {
                return value != null && value !== '';
              }
              return true;
            }),
          graceDays: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable(),
          // Hay cutting schedule fields
          stubbleHeight: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable()
            .typeError('Please enter a number')
            .test('stubble-height-required', 'Stubble height is required', function (value) {
              const { livestockCount, livestockTypeId } = this.parent;
              // If neither livestock fields are provided, this is likely a hay cutting schedule
              if (
                (livestockCount == null || livestockCount === '') &&
                (livestockTypeId == null || livestockTypeId === '')
              ) {
                return value != null && value !== '';
              }
              return true;
            }),
          tonnes: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable()
            .typeError('Please enter a number')
            .test('tonnes-required', 'Tonnes is required', function (value) {
              const { livestockCount, livestockTypeId } = this.parent;
              // If neither livestock fields are provided, this is likely a hay cutting schedule
              if (
                (livestockCount == null || livestockCount === '') &&
                (livestockTypeId == null || livestockTypeId === '')
              ) {
                return value != null && value !== '';
              }
              return true;
            }),
        }),
      ),
    }),
  ),
  invasivePlantChecklist: Yup.object().shape({
    equipmentAndVehiclesParking: Yup.bool().required().default(false),
    beginInUninfestedArea: Yup.bool().required().default(false),
    undercarrigesInspected: Yup.bool().required().default(false),
    revegetate: Yup.bool().required().default(false),
    other: Yup.string().transform(handleNull()),
  }),
  additionalRequirements: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      categoryId: Yup.number().required('Please choose a category').nullable().transform(handleNull(0)),
      detail: Yup.string().required('Please enter some details').transform(handleNull()),
      url: Yup.string().transform(handleNull()),
    }),
  ),
  managementConsiderations: Yup.array().of(
    Yup.object().shape({
      detail: Yup.string().required('Required field').transform(handleNull()),
    }),
  ),
  files: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().required('File has not uploaded yet'),
    }),
  ),
  ministerIssues: Yup.array().of(
    Yup.object().shape({
      pastures: Yup.array(),
      detail: Yup.string().required('Required field').transform(handleNull()),
      objective: Yup.string().required('Required field').transform(handleNull()),
      ministerIssueActions: Yup.array().of(
        Yup.object().shape({
          detail: Yup.string().required('Required field').transform(handleNull()),
          actionTypeId: Yup.number().required('Required field').transform(handleNull(0)),
          noGrazeStartMonth: Yup.number().nullable().transform(handleNull(0)),
          noGrazeStartDay: Yup.number().nullable().transform(handleNull(0)),
          noGrazeEndMonth: Yup.number().nullable().transform(handleNull(0)),
          noGrazeEndDay: Yup.number().nullable().transform(handleNull(0)),
        }),
      ),
    }),
  ),
});

export default RUPSchema;
