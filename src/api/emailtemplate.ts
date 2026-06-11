import * as API from '../constants/api';
import { getAuthHeaderConfig, axios } from '../utils';

export const updateEmailTemplate = async (
  templateId: string,
  name: string,
  fromEmail: string,
  subject: string,
  body: string,
): Promise<any> => {
  return axios.put(
    API.UPDATE_EMAIL_TEMPLATE(templateId),
    {
      name: name,
      fromEmail: fromEmail,
      subject: subject,
      body: body,
    },
    getAuthHeaderConfig(),
  );
};
