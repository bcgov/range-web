import React, { useEffect, useRef } from 'react';
import { Icon } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { downloadPDFBlob } from '../../utils';
import { fetchRupPDF } from '../../actionCreators';
import { Loading, ErrorPage, PrimaryButton } from '../common';
import { getPlanPDF, getIsFetchingPlanPDF, getPlanPDFErrorOccured } from '../../reducers/rootReducer';
import { RootState, AppDispatch } from '../../configureStore';

interface PDFViewFromServerProps {
  match: {
    params: {
      planId?: string;
      agreementId?: string;
    };
  };
}

const PDFViewFromServer = ({ match }: PDFViewFromServerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const planPDFBlob = useSelector((state: RootState) => getPlanPDF(state)) as any;
  const isFetchingPDF = useSelector((state: RootState) => getIsFetchingPlanPDF(state)) as boolean;
  const errorFetchingPDF = useSelector((state: RootState) => getPlanPDFErrorOccured(state)) as boolean;
  const downloadPDFLinkRef = useRef<HTMLAnchorElement>(null);

  const { planId, agreementId } = match.params;

  const onDownloadClicked = () => {
    downloadPDFBlob(planPDFBlob, downloadPDFLinkRef.current!, `${agreementId}.pdf`);
  };

  useEffect(() => {
    if (planId && agreementId) {
      (dispatch(fetchRupPDF(planId)) as any).then(() => {
        onDownloadClicked();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="rup-pdf">
      <a className="rup-pdf__link" href="download" ref={downloadPDFLinkRef}>
        link
      </a>

      {isFetchingPDF && <Loading />}

      {errorFetchingPDF && <ErrorPage message="Error occurred while fetching pdf." />}

      {planPDFBlob && (
        <div>
          If your download does not begin, please click the button to try again.
          <PrimaryButton inverted style={{ marginLeft: '10px' }} onClick={onDownloadClicked}>
            <Icon name="print" />
            Download PDF
          </PrimaryButton>
          <div className="rup-pdf__close-btn__container">
            <button className="rup-pdf__close-btn" onClick={() => window.close()}>
              Close window
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PDFViewFromServer;
