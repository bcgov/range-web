import * as Yup from 'yup'

const handleNull = (defaultValue = '') => v => (v === null ? defaultValue : v)

const RUPSchema = Yup.object().shape({
  rangeName: Yup.string(),
  altBusinessName: Yup.string().transform(handleNull()),
  planStartDate: Yup.string()
    .required('Required field')
    .nullable()
    .transform(handleNull()),
  planEndDate: Yup.string()
    .required('Required field')
    .nullable()
    .transform(handleNull())
    .when('planStartDate', (planStartDate, schema) =>
      schema.test({
        test: planEndDate => new Date(planEndDate) > new Date(planStartDate),
        message: 'Plan end date should be after start date'
      })
    ),
  pastures: Yup.array().of(
    Yup.object().shape({
      allowableAum: Yup.number()
        .nullable()
        .transform((v, originalValue) => (originalValue === '' ? null : v))
        .typeError('Please enter a number'),
      graceDays: Yup.number()
        .transform((v, originalValue) => (originalValue === '' ? null : v))
        .nullable()
        .typeError('Please enter a number'),
      name: Yup.string().required('Please enter a name'),
      notes: Yup.string()
        .transform(handleNull())
        .nullable(),
      planId: Yup.number(),
      pldPercent: Yup.number()
        .min(0, 'Please enter a value between 0 and 100')
        .max(1, 'Please enter a value between 0 and 100')
        .transform((v, originalValue) => (originalValue === '' ? null : v))
        .nullable()
        .typeError('Please enter a number'),
      plantCommunities: Yup.array().of(
        Yup.object().shape({
          approved: Yup.bool().required(),
          aspect: Yup.string()
            .nullable()
            .transform(handleNull()),
          elevationId: Yup.number()
            .transform((v, originalValue) => (originalValue === '' ? null : v))
            .nullable(),
          notes: Yup.string()
            .transform(handleNull())
            .required('Required field'),
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
          rangeReadinessNote: Yup.string()
            .transform(handleNull())
            .nullable(),
          plantCommunityActions: Yup.array().of(
            Yup.object().shape({
              actionTypeId: Yup.number()
                .transform((v, originalValue) =>
                  originalValue === '' ? null : v
                )
                .nullable()
                .required('Required field'),
              details: Yup.string()
                .nullable()
                .required('Required field'),
              name: Yup.string()
                .nullable()
                .when('actionTypeId', {
                  is: 6,
                  then: Yup.string().required('Required field'),
                  otherwise: Yup.string()
                })
            })
          ),
          indicatorPlants: Yup.array().of(
            Yup.object().shape({
              plantSpeciesId: Yup.number()
                .transform((v, originalValue) =>
                  originalValue === '' ? null : v
                )
                .nullable()
                .required('Required field'),
              value: Yup.number()
                .transform((v, originalValue) =>
                  originalValue === '' ? null : v
                )
                .nullable()
                .required('Required field')
                .typeError('Please enter a number'),
              name: Yup.string()
                .nullable()
                .transform(handleNull(''))
                .when('plantSpeciesId', {
                  is: 81,
                  then: Yup.string().required('Required field'),
                  otherwise: Yup.string()
                })
            })
          ),
          monitoringAreas: Yup.array().of(
            Yup.object().shape({
              latitude: Yup.number()
                .transform((v, originalValue) =>
                  originalValue === '' ? null : v
                )
                .nullable()
                .typeError('Please enter a number'),
              longitude: Yup.number()
                .transform((v, originalValue) =>
                  originalValue === '' ? null : v
                )
                .nullable()
                .typeError('Please enter a number'),
              location: Yup.string()
                .nullable()
                .required('Required field'),
              rangelandHealthId: Yup.number()
                .transform((v, originalValue) =>
                  originalValue === '' ? null : v
                )
                .nullable()
                .required('Required field'),
              purposeTypeIds: Yup.array()
                .of(Yup.number())
                .required('Required field')
            })
          )
        })
      )
    })
  ),
  grazingSchedules: Yup.array().of(
    Yup.object().shape({
      narative: Yup.string().transform(handleNull()),
      grazingScheduleEntries: Yup.array()
        .min(1)
        .of(
          Yup.object().shape({
            dateIn: Yup.string().required(true),
            dateOut: Yup.string().required(true),
            livestockCount: Yup.number()
              .transform((v, originalValue) =>
                originalValue === '' ? null : v
              )
              .nullable()
              .required(true),
            pastureId: Yup.number()
              .transform((v, originalValue) =>
                originalValue === '' ? null : v
              )
              .nullable()
              .required(true),
            livestockTypeId: Yup.number()
              .transform((v, originalValue) =>
                originalValue === '' ? null : v
              )
              .nullable()
              .required(true)
          })
        )
    })
  ),
  invasivePlantChecklist: Yup.object().shape({
    equipmentAndVehiclesParking: Yup.bool()
      .required()
      .default(false),
    beginInUninfestedArea: Yup.bool()
      .required()
      .default(false),
    undercarrigesInspected: Yup.bool()
      .required()
      .default(false),
    revegetate: Yup.bool()
      .required()
      .default(false),
    other: Yup.string().transform(handleNull())
  }),
  additionalRequirements: Yup.array().of(
    Yup.object().shape({
      id: Yup.string(),
      categoryId: Yup.number()
        .required('Please choose a category')
        .nullable()
        .transform(handleNull(0)),
      detail: Yup.string()
        .required('Please enter some details')
        .transform(handleNull()),
      url: Yup.string().transform(handleNull())
    })
  ),
  ministerIssues: Yup.array().of(
    Yup.object().shape({
      pastures: Yup.array(),
      detail: Yup.string()
        .required('Required field')
        .transform(handleNull()),
      objective: Yup.string()
        .required('Required field')
        .transform(handleNull()),
      ministerIssueActions: Yup.array().of(
        Yup.object().shape({
          detail: Yup.string()
            .required('Required field')
            .transform(handleNull()),
          actionTypeId: Yup.number()
            .required('Required field')
            .transform(handleNull(0)),
          noGrazeStartMonth: Yup.number()
            .nullable()
            .transform(handleNull(0)),
          noGrazeStartDay: Yup.number()
            .nullable()
            .transform(handleNull(0)),
          noGrazeEndMonth: Yup.number()
            .nullable()
            .transform(handleNull(0)),
          noGrazeEndDay: Yup.number()
            .nullable()
            .transform(handleNull(0))
        })
      )
    })
  )
})

export default RUPSchema
