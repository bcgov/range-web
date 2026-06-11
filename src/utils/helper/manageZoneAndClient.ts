import { NOT_ASSIGNED, NO_DESCRIPTION } from '../../constants/strings';
import { getUserFullName } from './user';

interface ZoneLike {
  id: number;
  code: string;
  user?: any;
  description?: string;
  district: { code: string; [key: string]: any };
  [key: string]: any;
}

interface UserLike {
  id: number;
  email?: string;
  [key: string]: any;
}

interface ClientLike {
  clientNumber?: string;
  id: string | number;
  name: string;
  [key: string]: any;
}

interface OptionResult {
  value: number | string;
  text: string;
  description: string;
  key?: string | number;
}

export const getZoneOption = (zone: ZoneLike): OptionResult => {
  const { id: zoneId, code: zoneCode, user: staff, description: zoneDescription, district } = zone;
  const option: OptionResult = {
    value: zoneId,
    text: zoneCode,
    description: NOT_ASSIGNED,
  };
  let description = zoneDescription;
  if (zoneDescription === 'Please update contact and description' || zoneDescription === 'Please update contact') {
    description = NO_DESCRIPTION;
  }
  option.text += ` (${description})`;
  option.text += ` - ${district.code}`;

  if (staff) {
    option.description = getUserFullName(staff);
  }

  return option;
};

export const getContactOption = (user: UserLike): OptionResult => ({
  value: user.id,
  description: user.email || '',
  text: getUserFullName(user),
});

export const getClientOption = (client: ClientLike): OptionResult & { key: string | number } => {
  const { clientNumber, id, name } = client;

  return {
    key: id,
    value: id,
    text: `${name}`,
    description: `Client #: ${clientNumber}`,
  };
};
