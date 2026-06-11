import React, { Fragment, useEffect } from 'react';
import { Icon, Modal, Header as SemanticHeader, Button } from 'semantic-ui-react';
import { startCase } from 'lodash';
import { Loading, PrimaryButton } from '../common';
import {
  isUserAgreementHolder,
  isUserAdmin,
  isUserAgrologist,
  canReadAll,
  getFirstFormikError,
  isUserDecisionMaker,
  isUserReadOnly,
} from '../../utils';
import PageForStaff from './pageForStaff';
import PageForAH from './pageForAH';
import { Form } from 'formik-semantic-ui';
import { useToast } from '../../providers/ToastProvider';
import { useReferences } from '../../providers/ReferencesProvider';
import RUPSchema from './schema';
import OnSubmitValidationError from '../common/form/OnSubmitValidationError';
import PDFView from './pdf/PDFView';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { getIn } from 'formik';
import { useCurrentPlan } from '../../providers/PlanProvider';

// These components use formik connect() which injects formik prop internally
const UntypedOnSubmitValidationError = OnSubmitValidationError as any;
const UntypedPageForStaff = PageForStaff as any;

interface BaseProps {
  user: any;
  history: any;
  match: any;
  location: any;
  [key: string]: any;
}

const Base = ({ user, history, match, location, ...props }: BaseProps) => {
  const {
    setCurrentPlanId,
    currentPlan,
    clientAgreements,
    fetchPlan,
    isFetchingPlan,
    errorFetchingPlan,
    savePlan,
  } = useCurrentPlan()!;

  const references = useReferences();

  const { successToast, errorToast } = useToast();

  const planId = match.params.planId || location.pathname.charAt('/range-use-plan/'.length);

  useEffect(() => {
    setCurrentPlanId(planId);
  }, [planId]);

  useEffect(() => {
    // Hard refetch plan when RUP page is navigated back to, to ensure no stale
    // data
    fetchPlan(planId, true);
  }, [location.pathname]);

  const handleValidationError = (formik: any) => {
    // Get the first field path in the formik errors object
    const [errorPathString, error] = getFirstFormikError(formik.errors);

    /**
     * Convert a field "path" in the form of
     *
     * 'pastures.0.plantCommunities.3.notes'
     *
     * into something more human-usable like:
     *
     * ['Pastures: My Pasture', 'Plant Communities: 3', 'Notes: Required field']
     *
     * By doing a lookup in `formik.values` based on the error path, by iterating
     * through ever-increasing chunks of the path. ie.
     * ['pastures', 'pastures.0', 'pastures.0.plantCommunities', ...]
     */
    const errorPath = errorPathString.split('.').reduce((acc: string[], value: string, i: number, paths: string[]) => {
      // Get previous chunk of path based on index
      const path = paths.slice(0, i + 1).join('.');
      const parentKey = paths[i - 1];

      if (!isNaN(parseFloat(value))) {
        const object = getIn(formik.values, path);
        return [...acc, `${startCase(parentKey)}: ${object.name || value}`];
      }

      if (i === paths.length - 1) {
        return [...acc, `${startCase(value)}: ${error}`];
      }

      return acc;
    }, []);

    // Add "RUP" to the beginning of the error message
    const formattedPath = ['RUP'].concat(errorPath);

    errorToast(`Could not submit due to invalid fields.\n\n`, {
      timeout: 5000,
      content: (
        <code>
          {formattedPath.map((line, i) => (
            <div key={i} style={{ marginLeft: i * 20, fontFamily: 'monospace' }}>
              &gt; {line}
            </div>
          ))}
        </code>
      ),
    });
  };

  const handleSubmit = async (plan: any, formik: any) => {
    try {
      // Update Plan
      const savedPlanId = await savePlan(plan);

      formik.setSubmitting(false);
      successToast('Successfully saved draft');

      await history.replace(`${RANGE_USE_PLAN}/${savedPlanId}`, {
        saved: true,
      });
    } catch (err: any) {
      formik.setStatus('error');
      formik.setSubmitting(false);
      const msg = err.data && err.data.error ? err.data.error : 'Error saving draft';
      errorToast(msg);
    }
  };

  const agreement = (currentPlan as any) && (currentPlan as any).agreement;
  const isFetchingPlanForTheFirstTime = !currentPlan && isFetchingPlan;

  if (errorFetchingPlan && !isFetchingPlan) {
    console.dir(errorFetchingPlan);
    console.dir(isFetchingPlanForTheFirstTime);
    console.dir(isFetchingPlan);
    return (
      <div className="rup__fetching-error">
        <Icon name="warning sign" size="large" color="red" />
        <div>
          <span className="rup__fetching-error__message">Error occurred while fetching the range use plan.</span>
        </div>
        {process.env.NODE_ENV !== 'production' && <p>Check console for details.</p>}
        <div>
          <PrimaryButton inverted onClick={history.goBack}>
            Go Back
          </PrimaryButton>
          <span className="rup__fetching-error__or-message">or</span>
          <PrimaryButton onClick={() => fetchPlan(planId, true)} content="Retry" />
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Loading active={isFetchingPlanForTheFirstTime} onlySpinner />

      {currentPlan && ((() => {
        const typedPlan = currentPlan as any;
        return location.pathname.endsWith('/export-pdf') && (() => {
          const closePDFModal = () => history.push(match.url);
          return (
            <Modal size="tiny" open={true} onClose={closePDFModal} dimmer="blurring">
              {React.createElement(SemanticHeader as any, { content: 'Download PDF', icon: 'file pdf' })}
              <Modal.Content>The PDF may take a few minutes to generate.</Modal.Content>
              <Modal.Actions>
                <Button type="button" onClick={closePDFModal}>
                  Close
                </Button>
                <PDFView
                  match={match}
                  agreementId={typedPlan.agreement.id}
                  mapAttachments={typedPlan.files.filter((item: any) => {
                    return item.type === 'mapAttachments';
                  })}
                />
              </Modal.Actions>
            </Modal>
          );
        })();
      })())}

      {currentPlan && (
        <Form
          initialValues={currentPlan}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={RUPSchema}
          onSubmit={handleSubmit}
          render={({ values: plan }: any) => (
            <>
              {/* TODO: Prompt removed in react-router-dom v6. 
                  Add useBlocker or beforeunload for unsaved changes warning */}
              <UntypedOnSubmitValidationError callback={handleValidationError} />

              {(isUserAdmin(user) ||
                isUserAgrologist(user) ||
                isUserDecisionMaker(user) ||
                canReadAll(user) ||
                isUserReadOnly(user)) && (
                <UntypedPageForStaff
                  references={references}
                  agreement={agreement}
                  plan={plan}
                  clientAgreements={clientAgreements}
                  fetchPlan={fetchPlan}
                  user={user}
                  history={history}
                  {...props}
                />
              )}

              {isUserAgreementHolder(user) && (
                <PageForAH
                  references={references}
                  agreement={agreement}
                  plan={plan}
                  clientAgreements={clientAgreements}
                  fetchPlan={fetchPlan}
                  user={user}
                  history={history}
                  {...(props as any)}
                />
              )}
            </>
          )}
        />
      )}
    </Fragment>
  );
};

export default Base;
