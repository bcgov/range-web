import moment from 'moment'
import {
  CLIENT_TYPE,
  DAYS_ON_THE_AVERAGE,
  DATE_FORMAT,
  PDF_DRAFT_STATUSES,
  PDF_IN_EFFECT_STATUSES,
  PDF_NOT_IN_EFFECT_STATUSES
} from '../../../constants/variables'
import { NOT_PROVIDED } from '../../../constants/strings'

export const getPDFStatus = status => {
  if (PDF_DRAFT_STATUSES.includes(status.code)) {
    return 'DRAFT'
  } else if (PDF_IN_EFFECT_STATUSES.includes(status.code)) {
    return 'IN EFFECT'
  } else if (PDF_NOT_IN_EFFECT_STATUSES.includes(status.code)) {
    return 'NOT IN EFFECT'
  }
}

export const getPlantCommunityCriteria = (indicatorPlants, criteria) => {
  return indicatorPlants.reduce((acc, indicator) => {
    if (indicator.criteria === criteria) {
      acc.push({ name: indicator.plantSpecies.name, value: indicator.value })
    }
    return acc
  }, [])
}

export const createDateWithMoment = (day, month, year) => {
  if (month && day) {
    return moment()
      .set('year', year || new Date().getFullYear())
      .set('month', month - 1)
      .set('date', day)
      .toDate()
  }

  return null
}

/**
 * Present the date time in a more readable way
 *
 * @param {string | Date} isoFormatDate The stringified date time
 * @param {boolean} isYearIncluded The boolean to specify whether the year is needed
 * @returns {string} a formatted string or 'Not provided'
 */
export const formatDateFromServer = (
  isoFormatDate,
  isYearIncluded = true,
  notProvided = NOT_PROVIDED
) => {
  if (isoFormatDate) {
    const m = moment(isoFormatDate, DATE_FORMAT.SERVER_SIDE)

    if (isYearIncluded) {
      return m.format(DATE_FORMAT.CLIENT_SIDE)
    }
    return m.format(DATE_FORMAT.CLIENT_SIDE_WITHOUT_YEAR)
  }
  return notProvided
}

export const handleNullValue = (value, notProvided) => {
  if (!value) {
    return typeof notProvided === 'string' ? notProvided : NOT_PROVIDED
  }
  return value
}

/**
 * Convert the zone code / descriiption to its string equivolent
 *
 * @param {Zone} zone The zone to be operated on
 * @returns The `String` representing the district
 */
export const getDistrict = zone => {
  if (!zone) {
    return NOT_PROVIDED
  }
  if (zone.district && zone.district.description) {
    return `${zone.district.code} - ${zone.district.description}`
  }
  return zone.district.code
}

export const getAgreementExemptionStatus = agreement => {
  if (agreement && agreement.agreementExemptionStatus) {
    return agreement.agreementExemptionStatus.description
  }

  return NOT_PROVIDED
}

/**
 * Convert the agreement type code / descriiption to its string equivolent
 *
 * @param {AgreementType} agreementType The zone to be operated on
 * @returns The `String` representing the agreement type
 */
export const getAgreementType = agreementType => {
  if (!agreementType) {
    return NOT_PROVIDED
  }
  if (agreementType.description) {
    return `${agreementType.code} - ${agreementType.description}`
  }
  return agreementType.code
}

/**
 * Capitalize the first letter for a string
 *
 * @param {String} string The string to be operated on
 * @returns A string with the first letter capitalized
 */

export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)

export const getClientFullName = contact => {
  if (contact && contact.name) {
    const array = contact.name
      .split(' ')
      .map(string => capitalize(string.toLowerCase()))

    return array.join(' ')
  }

  return NOT_PROVIDED
}

/**
 * Convert the contact type / role to its string equivolent
 *
 * @param {Contact} contact The contact to be operated on
 * @returns The `String` representing the contacts role
 */
export const getContactRole = contact => {
  if (!contact) {
    return NOT_PROVIDED
  }
  if (contact.clientTypeCode === CLIENT_TYPE.PRIMARY) {
    return 'Primary'
  }

  return 'Secondary'
}

export const getUserFullName = user => {
  const { givenName, familyName, username } = user || {}
  if (givenName && familyName) {
    return `${capitalize(givenName)} ${capitalize(familyName)}`
  }

  return username
}

/**
 * Handlebars helper to build the full name of the primary agreement holder
 *
 * @param {[Contact]} contacts The `Agreement` contacts
 * @returns A string representing the full name of the promary contact
 */
export const getPrimaryClientFullName = contacts => {
  const [pcontact] = contacts.filter(
    contact => contact.clientTypeCode === CLIENT_TYPE.PRIMARY
  )

  return getClientFullName(pcontact)
}

export const getYesOrNo = boolean => (boolean ? 'Yes' : 'No')

const shift = (number, precision) => {
  const numArray = `${number}`.split('e')
  return +`${numArray[0]}e${numArray[1] ? +numArray[1] + precision : precision}`
}

const round = (number, precision) =>
  shift(Math.round(shift(number, +precision)), -precision)

/**
 * Round the float to 1 decimal
 *
 * @param {float} number
 * @returns the rounded float number
 */
export const roundToSingleDecimalPlace = number => round(number, 1)

/**
 *
 * @param {number} numberOfAnimals
 * @param {number} totalDays
 * @param {number} auFactor parameter provided from the livestock type
 * @returns {float} the total AUMs
 */
export const calcTotalAUMs = (numberOfAnimals = 0, totalDays, auFactor = 0) =>
  (numberOfAnimals * totalDays * auFactor) / DAYS_ON_THE_AVERAGE

/**
 * Present user friendly string when getting null or undefined value
 *
 * @param {string | Date} first the string in the class Date form
 * @param {string | Date} second the string in the class Date form
 * @param {bool} isUserFriendly
 * @returns {number | string} the number of days or 'N/P'
 */
export const calcDateDiff = (first, second, isUserFriendly) => {
  if (first && second) {
    return moment(first).diff(moment(second), 'days') + 1
  }
  return isUserFriendly ? 'N/P' : 0
}

/**
 * Calculate Private Land Deduction Animal Unit Month
 *
 * @param {number} totalAUMs
 * @param {float} pasturePldPercent
 * @returns {float} the pld AUMs
 */
export const calcPldAUMs = (totalAUMs, pasturePldPercent = 0) =>
  totalAUMs * pasturePldPercent

/**
 * Calculate Crown Animal Unit Month
 *
 * @param {number} totalAUMs
 * @param {number} pldAUMs
 * @returns {float} the crown AUMs
 */
export const calcCrownAUMs = (totalAUMs, pldAUMs) => totalAUMs - pldAUMs

/**
 * Calculate the total Crown Animal Unit Month
 *
 * @param {Array} entries grazing schedule entries
 * @returns {float} the total crown AUMs
 */
export const calcCrownTotalAUMs = (entries = []) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  if (entries.length === 0) {
    return 0
  }
  return entries.map(entry => entry.crownAUMs).reduce(reducer)
}

export const getPastureNames = (pastureIds = [], pastures = {}) => {
  const pastureNames = pastureIds.map(pId => {
    const pasture = pastures.find(p => p.id === pId)
    return pasture && pasture.name
  })
  const { length } = pastureNames
  switch (length) {
    case 0:
      return NOT_PROVIDED
    case 1:
    case 2:
      return pastureNames.join(' and ')
    default:
      return `${pastureNames.slice(0, length - 1).join(', ')}, and ${
        pastureNames[length - 1]
      }`
  }
}

export const formatGrazingSchedules = ({
  grazingSchedules: gss,
  pastures,
  agreement
}) => {
  if (!pastures || !gss || !agreement) return []

  return gss.map(schedule => {
    const { grazingScheduleEntries: gse, year } = schedule
    const grazingScheduleEntries =
      gse &&
      gse.map(entry => {
        const {
          pastureId,
          livestockType,
          livestockCount,
          dateIn,
          dateOut
        } = entry
        const days = calcDateDiff(dateOut, dateIn, false)
        const pasture = pastures.find(p => p.id === pastureId)
        const graceDays = entry.graceDays || (pasture && pasture.graceDays)
        const pldPercent = pasture && pasture.pldPercent
        const auFactor = livestockType && livestockType.auFactor

        const totalAUMs = calcTotalAUMs(livestockCount, days, auFactor)
        const pldAUMs = roundToSingleDecimalPlace(
          calcPldAUMs(totalAUMs, pldPercent)
        )
        const crownAUMs = roundToSingleDecimalPlace(
          calcCrownAUMs(totalAUMs, pldAUMs)
        )
        return {
          ...entry,
          pasture,
          graceDays,
          days,
          pldAUMs,
          crownAUMs
        }
      })
    const crownTotalAUMs = roundToSingleDecimalPlace(
      calcCrownTotalAUMs(grazingScheduleEntries)
    )
    const yearUsage = agreement.usage.find(u => u.year === year)
    const authorizedAUMs = yearUsage && yearUsage.authorizedAum
    return {
      ...schedule,
      grazingScheduleEntries,
      crownTotalAUMs,
      authorizedAUMs
    }
  })
}

export const formatMinisterIssues = ({ ministerIssues, pastures }) =>
  ministerIssues.map(mi => {
    const ministerIssue = { ...mi }
    ministerIssue.pastureNames = getPastureNames(
      ministerIssue.pastures,
      pastures
    )
    ministerIssue.actionsExist =
      ministerIssue.ministerIssueActions &&
      ministerIssue.ministerIssueActions.length > 0

    return ministerIssue
  })

export const getGrazingScheduleEntrieHeader = () => [
  { header: 'Pasture', dataKey: 'p' },
  { header: 'Livestock Type', dataKey: 'lt' },
  { header: '# of Animals', dataKey: 'noa' },
  { header: 'Date in', dataKey: 'di' },
  { header: 'Date out', dataKey: 'do' },
  { header: 'Days', dataKey: 'd' },
  { header: 'Grace Days', dataKey: 'gd' },
  { header: 'PLD', dataKey: 'pld' },
  { header: 'Crown AUMs', dataKey: 'ca' }
]

export const formatGrazingScheduleEntries = grazingScheduleEntries => {
  if (!grazingScheduleEntries) return []

  return grazingScheduleEntries.map(entry => {
    const {
      pasture,
      graceDays,
      livestockCount,
      days,
      pldAUMs,
      crownAUMs,
      dateIn,
      dateOut,
      livestockType
    } = entry
    const { name: livestockTypeName } = livestockType || {}
    const { name: pastureName } = pasture || {}
    return {
      p: handleNullValue(pastureName, 'N/P'),
      lt: handleNullValue(livestockTypeName, 'N/P'),
      noa: handleNullValue(livestockCount, 'N/P'),
      di: formatDateFromServer(dateIn, false),
      do: formatDateFromServer(dateOut, false),
      d: handleNullValue(days, 'N/P'),
      gd: handleNullValue(graceDays, 'N/P'),
      pld: pldAUMs,
      ca: crownAUMs
    }
  })
}

export const getMonitoringAreaPurposes = (purposes, otherPurpose) => {
  if (!purposes || !purposes.length) {
    return NOT_PROVIDED
  }
  const purposeNames = purposes.map(
    purp => purp.purposeType && purp.purposeType.name
  )
  if (otherPurpose) {
    purposeNames.push(otherPurpose)
  }

  const { length } = purposeNames
  switch (length) {
    case 0:
      return NOT_PROVIDED
    case 1:
    case 2:
      return purposeNames.join(' and ')
    default:
      return `${purposeNames.slice(0, length - 1).join(', ')}, and ${
        purposeNames[length - 1]
      }`
  }
}

export const getMonthAndDateIntegers = (month, day) => {
  let monthAndDate = NOT_PROVIDED
  if (month && day) {
    monthAndDate = moment()
      .set('year', new Date().getFullYear())
      .set('month', month - 1)
      .set('date', day)
      .format('MMMM D')
  }

  return monthAndDate
}
