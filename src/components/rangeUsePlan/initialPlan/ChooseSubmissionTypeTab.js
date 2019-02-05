import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Radio, Form } from 'semantic-ui-react';
import { PLAN_STATUS } from '../../../constants/variables';
import RightBtn from './RightBtn';
import LeftBtn from './LeftBtn';
import TabTemplate from './TabTemplate';

/* eslint-disable jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control */

class ChooseSubmissionTypeTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    statusCode: PropTypes.string,
    handleStatusCodeChange: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    onCancelClicked: PropTypes.func,
    tab: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      back: PropTypes.string,
      next: PropTypes.string,
      radio1: PropTypes.string,
      radio2: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    statusCode: null,
    onCancelClicked: () => {},
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
      onCancelClicked,
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
              onClick={back ? this.onBackClicked : onCancelClicked}
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
            <Form.Field className="amendment__submission__radio-field">
              <Radio
                className="amendment__submission__radio"
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
            <Form.Field className="amendment__submission__radio-field">
              <Radio
                className="amendment__submission__radio"
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
