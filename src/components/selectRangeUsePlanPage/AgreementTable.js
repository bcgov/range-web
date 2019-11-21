import React, { useState, useEffect } from 'react'
import { Pagination, Icon, Segment } from 'semantic-ui-react'
import * as strings from '../../constants/strings'
import { Loading } from '../common'
import AgreementTableRow from './AgreementTableRow'
import AHWarning from './AHWarning'
import { useQueryParam, StringParam } from 'use-query-params'

const AgreementTable = ({
  agreements,
  loading,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [activeId, setActiveId] = useQueryParam('selected', StringParam)

  const [currentAgreements, setCurrentAgreements] = useState([])
  const [currentTotalPages, setCurrentTotalPages] = useState(0)

  useEffect(() => {
    if (agreements) {
      setActiveId(null)
      setCurrentAgreements(agreements)
    }
  }, [agreements])

  useEffect(() => {
    if (!isNaN(totalPages)) {
      setCurrentTotalPages(totalPages)
    }
  }, [totalPages])

  return (
    <Segment basic style={{ marginTop: '0' }}>
      <Loading active={loading && !agreements} />

      <AHWarning />

      <div className="agrm__table">
        <div className="agrm__table__header-row">
          <div className="agrm__table__header-row__cell">
            {strings.RANGE_NUMBER}
          </div>
          <div className="agrm__table__header-row__cell">
            {strings.RANGE_NAME}
          </div>
          <div className="agrm__table__header-row__cell">
            {strings.AGREEMENT_HOLDER}
          </div>
          <div className="agrm__table__header-row__cell">
            {strings.STAFF_CONTACT}
          </div>
          <div className="agrm__table__header-row__cell">{strings.STATUS}</div>
          <div className="agrm__table__header-row__cell">
            <Icon name="plus circle" size="large" />
          </div>
        </div>

        {currentAgreements.map(agreement => (
          <AgreementTableRow
            key={agreement.id}
            agreement={agreement}
            active={agreement.id === activeId}
            onSelect={() =>
              agreement.id !== activeId
                ? setActiveId(agreement.id)
                : setActiveId(null)
            }
            noneSelected={!activeId}
          />
        ))}
      </div>

      <div className="agrm__pagination">
        <Pagination
          size="mini"
          siblingRange="2"
          activePage={currentPage}
          onPageChange={onPageChange}
          totalPages={currentTotalPages}
          ellipsisItem={{
            content: <Icon name="ellipsis horizontal" />,
            icon: true
          }}
          firstItem={{
            content: <Icon name="angle double left" />,
            icon: true
          }}
          lastItem={{
            content: <Icon name="angle double right" />,
            icon: true
          }}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{ content: <Icon name="angle right" />, icon: true }}
        />
      </div>
    </Segment>
  )
}

export default AgreementTable
