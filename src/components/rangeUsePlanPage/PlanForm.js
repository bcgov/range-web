import React from 'react';
import PropTypes from 'prop-types';
import { Element } from 'react-scroll';
import Pastures from './pastures';
import { ELEMENT_ID } from '../../constants/variables';
import BasicInformation from './basicInformation';
import Conditions from './conditions';
import GrazingSchedules from './grazingSchedules';
import Usage from './usage';
import InvasivePlantChecklist from './invasivePlantChecklist';
import ManagementConsiderations from './managementConsiderations';
import MinisterIssues from './ministerIssues';
import AdditionalRequirements from './additionalRequirements';
import { Attachments, AttachmentsHeader } from './attachments';
import EditableProvider from '../../providers/EditableProvider';
import { isUUID } from 'uuid-v4';
import { useUser } from '../../providers/UserProvider';
import { canUserAttachMaps, canUserAddAttachments, canUserConsiderManagement, canUserAddAdditionalReqs } from '../../utils';

const PlanForm = ({
  plan,
  fetchPlan,
  toastSuccessMessage,
  toastErrorMessage,
  isEditable = true,
}) => {
  const user = useUser();

  return (
    <EditableProvider editable={isEditable}>
      {plan?.conditions !== '' && (
        <Element name={ELEMENT_ID.CONDITIONS} id={ELEMENT_ID.CONDITIONS}>
          <Conditions plan={plan} agreement={plan.agreement} />
        </Element>
      )}

      <Element
        name={ELEMENT_ID.BASIC_INFORMATION}
        id={ELEMENT_ID.BASIC_INFORMATION}
      >
        <BasicInformation
          plan={plan}
          fetchPlan={fetchPlan}
          toastSuccessMessage={toastSuccessMessage}
          toastErrorMessage={toastErrorMessage}
          agreement={plan.agreement}
        />
      </Element>
      <Element name={ELEMENT_ID.PASTURES} id={ELEMENT_ID.PASTURES}>
        <Pastures pastures={plan.pastures} />
      </Element>

      <Usage plan={plan} usage={plan.agreement.usage} />

      <Element
        name={ELEMENT_ID.GRAZING_SCHEDULE}
        id={ELEMENT_ID.GRAZING_SCHEDULE}
      >
        <GrazingSchedules plan={plan} />
      </Element>
      <Element
        name={ELEMENT_ID.MINISTER_ISSUES}
        id={ELEMENT_ID.MINISTER_ISSUES}
      >
        <MinisterIssues issues={plan.ministerIssues} />
      </Element>
      <Element
        name={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST}
        id={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST}
      >
        <InvasivePlantChecklist
          namespace="invasivePlantChecklist"
          invasivePlantChecklist={plan.invasivePlantChecklist}
        />
      </Element>
      <Element
        name={ELEMENT_ID.ADDITIONAL_REQUIREMENTS}
        id={ELEMENT_ID.ADDITIONAL_REQUIREMENTS}
      >
        <EditableProvider editable={canUserAddAdditionalReqs(plan, user)}>
          <AdditionalRequirements
            additionalRequirements={plan.additionalRequirements}
          />
        </EditableProvider>
      </Element>
      <Element
        name={ELEMENT_ID.MANAGEMENT_CONSIDERATIONS}
        id={ELEMENT_ID.MANAGEMENT_CONSIDERATIONS}
      >
        <EditableProvider editable={canUserConsiderManagement(plan, user)}>
          <ManagementConsiderations
            planId={plan.id}
            managementConsiderations={plan.managementConsiderations}
          />
        </EditableProvider>
      </Element>
      {!isUUID(plan.id) && (
        <EditableProvider editable={canUserAddAttachments(plan, user)}>
          <Element name={ELEMENT_ID.ATTACHMENTS} id={ELEMENT_ID.ATTACHMENTS}>
            <AttachmentsHeader />
            <EditableProvider editable={canUserAttachMaps(plan, user)}>
              <Attachments
                planId={plan.id}
                attachments={plan.files}
                propertyName="decisionAttachments"
                label="Decision Material"
              />
              <Attachments
                planId={plan.id}
                attachments={plan.files}
                propertyName="mapAttachments"
                label="Map"
              />
              <Attachments
                planId={plan.id}
                attachments={plan.files}
                propertyName="otherAttachments"
                label="Other"
              />
            </EditableProvider>
          </Element>
        </EditableProvider>
      )}
    </EditableProvider>
  );
};

PlanForm.propTypes = {
  plan: PropTypes.shape({
    pastures: PropTypes.array.isRequired,
  }),
};

export default PlanForm;
