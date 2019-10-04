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
    .transform(handleNull()),
  pastures: Yup.array().of(
    Yup.object().shape({
      allowableAum: Yup.number()
        .nullable()
        .transform((v, originalValue) => (originalValue === '' ? null : v)),
      graceDays: Yup.number()
        .nullable()
        .transform(handleNull(0)),
      name: Yup.string().required('Please enter a name'),
      notes: Yup.string()
        .transform(handleNull())
        .nullable(),
      planId: Yup.number(),
      pldPercent: Yup.number()
        .typeError('Please enter a number')
        .nullable()
        .transform(handleNull(0)),
      plantCommunities: Yup.array().of(
        Yup.object().shape({
          approved: Yup.bool().required(),
          aspect: Yup.string()
            .nullable()
            .transform(handleNull()),
          elevationId: Yup.number()
            .required()
            .nullable()
            .transform(handleNull(0)),
          notes: Yup.string()
            .transform(handleNull())
            .required(),
          url: Yup.string().transform(handleNull()),
          purposeOfAction: Yup.string().required('Required field'),
          shrubUse: Yup.string().transform(handleNull()),
          rangeReadinessDate: Yup.string().required('Required field')
        })
      )
    })
  ),
  grazingSchedules: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().required(),
      narative: Yup.string().transform(handleNull()),
      grazingScheduleEntries: Yup.array().of(
        Yup.object().shape({
          dateIn: Yup.string().required(),
          dateOut: Yup.string().required()
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
