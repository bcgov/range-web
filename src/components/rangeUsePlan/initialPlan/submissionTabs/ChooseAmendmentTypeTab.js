import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Radio, Form, TextArea } from 'semantic-ui-react';
import { AMENDMENT_TYPE, NUMBER_OF_LIMIT_FOR_NOTE } from '../../../../constants/variables';
import RightBtn from '../RightBtn';
import LeftBtn from '../LeftBtn';
import TabTemplate from '../TabTemplate';

/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */

class ChooseAmendmentTypeTab extends Component {
  static propTypes = {
    isMandatory: PropTypes.bool.isRequired,
    isMinor: PropTypes.bool.isRequired,
    isAmendmentTypeDecided: PropTypes.bool.isRequired,
    currTabId: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    amendmentTypeCode: PropTypes.string,
    handleAmendmentTypeChange: PropTypes.func.isRequired,
    handleNoteChange: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      next: PropTypes.string.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    amendmentTypeCode: null,
  }

  onNextClicked = (e) => {
    const { handleTabChange, tab } = this.props;

    handleTabChange(e, { value: tab.next });
  }

  render() {
    const {
      currTabId,
      tab,
      note,
      amendmentTypeCode,
      onClose,
      handleAmendmentTypeChange,
      handleNoteChange,
      isMandatory,
      isMinor,
      isAmendmentTypeDecided,
    } = this.props;
    const { id, title } = tab;
    const isActive = id === currTabId;

    if (!isActive) {
      return null;
    }

    const lengthOfNote = note
      ? `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}`
      : `0/${NUMBER_OF_LIMIT_FOR_NOTE}`;

    return (
      <TabTemplate
        isActive={isActive}
        title={title}
        actions={
          <Fragment>
            <LeftBtn
              onClick={onClose}
              content="Cancel"
            />
            <RightBtn
              onClick={this.onNextClicked}
              disabled={amendmentTypeCode === null && !isAmendmentTypeDecided}
              content="Next"
            />
          </Fragment>
        }
        content={
          <Form>
            <Form.Field className="rup__multi-tab__radio-field">
              <Radio
                className="rup__multi-tab__radio"
                label={
                  <label>
                    <b>Minor Amendment: </b>
                    Otherwise conforms to this Act, the regulations and the standards, and does not materially affect the likelihood of achieving the intended results specified in the plan.
                  </label>
                }
                name="radioGroup"
                value={AMENDMENT_TYPE.MINOR}
                checked={isMinor}
                onChange={handleAmendmentTypeChange}
                disabled={isAmendmentTypeDecided}
              />
            </Form.Field>
            <Form.Field className="rup__multi-tab__radio-field">
              <Radio
                className="rup__multi-tab__radio"
                label={
                  <label>
                    <b>Mandatory Amendment: </b>
                    Does not meet the minor amendment criteria, or has been required by the decision makers.
                  </label>
                }
                name="radioGroup"
                value={AMENDMENT_TYPE.MANDATORY}
                checked={isMandatory}
                onChange={handleAmendmentTypeChange}
                disabled={isAmendmentTypeDecided}
              />
            </Form.Field>

            <div className="rup__multi-tab__note__title">
              Add Description ({NUMBER_OF_LIMIT_FOR_NOTE} characters). It will be visible to Range Staff and other Agreement Holders.
            </div>
            <TextArea
              placeholder="Summarize what the proposed amendment includes.
              Ex. “change to grazing schedule to address mid season drought.”"
              onChange={handleNoteChange}
              value={note}
            />
            <div className="rup__multi-tab__note__text-length">
              {lengthOfNote}
            </div>
          </Form>
        }
      />
    );
  }
}

export default ChooseAmendmentTypeTab;
