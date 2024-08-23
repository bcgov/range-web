import * as API from '../constants/api';
import { getAuthHeaderConfig, axios } from '../utils';

export const updateEmailTemplate = async (templateId, name, fromEmail, subject, body) => {
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
