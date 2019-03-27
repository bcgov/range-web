import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Radio, Form } from 'semantic-ui-react';
import { PLAN_STATUS } from '../../../../constants/variables';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';

/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */

class ChooseSubmissionTypeTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    statusCode: PropTypes.string,
    handleStatusCodeChange: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      back: PropTypes.string.isRequired,
      next: PropTypes.string.isRequired,
      radio1: PropTypes.string.isRequired,
      radio2: PropTypes.string.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    statusCode: null,
  }

  onBackClicked = (e) => {
    const { handleTabChange, tab } = this.props;

    handleTabChange(e, { value: tab.back });
  }

  onNextClicked = (e) => {
    const { handleTabChange, tab } = this.props;

    handleTabChange(e, { value: tab.next });
  }

  render() {
    const {
      currTabId,
      tab,
      statusCode,
      handleStatusCodeChange,
      onClose,
    } = this.props;
    const { id, title, back, radio1, radio2 } = tab;
    const isActive = id === currTabId;

    if (!isActive) {
      return null;
    }

    return (
      <TabTemplate
        isActive={isActive}
        title={title}
        actions={
          <Fragment>
            <LeftBtn
              onClick={back ? this.onBackClicked : onClose}
              content={back ? 'Back' : 'Cancel'}
            />
            <RightBtn
              onClick={this.onNextClicked}
              disabled={!statusCode}
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
                    <b>Submit for Staff Feedback: </b>
                    {radio1}
                  </label>
                }
                name="radioGroup"
                value={PLAN_STATUS.SUBMITTED_FOR_REVIEW}
                checked={statusCode === PLAN_STATUS.SUBMITTED_FOR_REVIEW}
                onChange={handleStatusCodeChange}
              />
            </Form.Field>
            <Form.Field className="rup__multi-tab__radio-field">
              <Radio
                className="rup__multi-tab__radio"
                label={
                  <label>
                    <b>Submit for Final Decision: </b>
                    {radio2}
                  </label>
                }
                name="radioGroup"
                value={PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION}
                checked={statusCode === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION}
                onChange={handleStatusCodeChange}
              />
            </Form.Field>
          </Form>
        }
      />
    );
  }
}

export default ChooseSubmissionTypeTab;
