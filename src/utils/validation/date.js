export const extractYearFromScheduleDate = (dateValue) => {
  if (typeof dateValue === 'string') {
    const datePrefixMatch = dateValue.match(/^(\d{4})-\d{2}-\d{2}/);
    if (datePrefixMatch) {
      return Number(datePrefixMatch[1]);
    }
  }

  return new Date(dateValue).getUTCFullYear();
};
