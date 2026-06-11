import React from 'react';
import { Element } from 'react-scroll';
import Pastures from './pastures';
import { ELEMENT_ID } from '../../constants/variables';
import BasicInformation from './basicInformation';
import Conditions from './conditions';
import Schedules from './schedules';
import LivestockDistributionDetail from './livestockDistributionDetail';
import Usage from './usage';
import InvasivePlantChecklist from './invasivePlantChecklist';
import ManagementConsiderations from './managementConsiderations';
import MinisterIssues from './ministerIssues';
import AdditionalRequirements from './additionalRequirements';
import { Attachments, AttachmentsHeader } from './attachments';
import EditableProvider from '../../providers/EditableProvider';
import { isUUID } from 'uuid-v4';
import { useUser } from '../../providers/UserProvider';
import {
  canUserAttachMaps,
  canUserAddAttachments,
  canUserConsiderManagement,
  canUserAddAdditionalReqs,
  canUserAttachAdditionalAttachments,
  canUserAttachDecisionMaterials,
} from '../../utils';

// Components that use formik connect() HOC — bypass strict typing
const UntypedConditions = Conditions as any;
const UntypedBasicInformation = BasicInformation as any;
const UntypedPastures = Pastures as any;
const UntypedInvasivePlantChecklist = InvasivePlantChecklist as any;

interface PlanFormProps {
  plan: any;
  fetchPlan?: () => void;
  toastSuccessMessage?: (msg: string) => void;
  toastErrorMessage?: (msg: string) => void;
  isEditable?: boolean;
}

const PlanForm = ({ plan, fetchPlan, toastSuccessMessage, toastErrorMessage, isEditable = true }: PlanFormProps) => {
  const user = useUser();

  return (
    <EditableProvider editable={isEditable}>
      {plan?.conditions !== '' && (
        <Element name={ELEMENT_ID.CONDITIONS} id={ELEMENT_ID.CONDITIONS}>
          <UntypedConditions plan={plan} agreement={plan.agreement} />
        </Element>
      )}

      <Element name={ELEMENT_ID.BASIC_INFORMATION} id={ELEMENT_ID.BASIC_INFORMATION}>
        <UntypedBasicInformation
          plan={plan}
          fetchPlan={fetchPlan}
          toastSuccessMessage={toastSuccessMessage}
          toastErrorMessage={toastErrorMessage}
          agreement={plan.agreement}
        />
      </Element>
      <Element name={ELEMENT_ID.PASTURES} id={ELEMENT_ID.PASTURES}>
        <UntypedPastures pastures={plan.pastures} agreementType={plan.agreement.agreementType} />
      </Element>

      <Usage plan={plan} usage={plan.agreement.usage} />

      <Element name={ELEMENT_ID.SCHEDULE} id={ELEMENT_ID.SCHEDULE}>
        <Schedules plan={plan} />
      </Element>
      {(plan.agreement.agreementTypeId === 1 || plan.agreement.agreementTypeId === 2) && (
        <Element name={ELEMENT_ID.LIVESTOCK_DISTRIBUTION_DETAIL} id={ELEMENT_ID.LIVESTOCK_DISTRIBUTION_DETAIL}>
          <LivestockDistributionDetail livestockDistributionDetail={plan.livestockDistributionDetail} />
        </Element>
      )}
      <Element name={ELEMENT_ID.MINISTER_ISSUES} id={ELEMENT_ID.MINISTER_ISSUES}>
        <MinisterIssues issues={plan.ministerIssues} />
      </Element>
      <Element name={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST} id={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST}>
        <UntypedInvasivePlantChecklist
          namespace="invasivePlantChecklist"
          invasivePlantChecklist={plan.invasivePlantChecklist}
        />
      </Element>
      <Element name={ELEMENT_ID.ADDITIONAL_REQUIREMENTS} id={ELEMENT_ID.ADDITIONAL_REQUIREMENTS}>
        <EditableProvider editable={canUserAddAdditionalReqs(plan, user) as boolean}>
          <AdditionalRequirements additionalRequirements={plan.additionalRequirements} />
        </EditableProvider>
      </Element>
      <Element name={ELEMENT_ID.MANAGEMENT_CONSIDERATIONS} id={ELEMENT_ID.MANAGEMENT_CONSIDERATIONS}>
        <EditableProvider editable={canUserConsiderManagement(plan, user) as boolean}>
          <ManagementConsiderations planId={plan.id} managementConsiderations={plan.managementConsiderations} />
        </EditableProvider>
      </Element>
      {!isUUID(plan.id) && (
        <EditableProvider editable={canUserAddAttachments(plan, user) as boolean}>
          <Element name={ELEMENT_ID.ATTACHMENTS} id={ELEMENT_ID.ATTACHMENTS}>
            <AttachmentsHeader />
            <EditableProvider editable={canUserAttachDecisionMaterials(plan, user) as boolean}>
              <Attachments
                planId={plan.id}
                attachments={plan.files}
                propertyName="decisionAttachments"
                label="Decision Material"
              />
            </EditableProvider>
            <EditableProvider editable={canUserAttachMaps(plan, user) as boolean}>
              <Attachments planId={plan.id} attachments={plan.files} propertyName="mapAttachments" label="Map" />
            </EditableProvider>
            <EditableProvider editable={canUserAttachAdditionalAttachments(plan, user) as boolean}>
              <Attachments planId={plan.id} attachments={plan.files} propertyName="otherAttachments" label="Other" />
            </EditableProvider>
          </Element>
        </EditableProvider>
      )}
    </EditableProvider>
  );
};

export default PlanForm;
