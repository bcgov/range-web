export const getUserFullName = user => (
  user && user.givenName && user.familyName && `${user.givenName} ${user.familyName}`
);

export const getUserInitial = (user) => {
  const familyName = user && user.familyName;
  const givenName = user && user.givenName;

  if (familyName && givenName && typeof familyName === 'string' && typeof givenName === 'string') {
    return givenName.charAt(0) + familyName.charAt(0);
  }

  return 'NP';
};