import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import RightBtn from './RightBtn';
import LeftBtn from './LeftBtn';
import TabForm from './TabForm';

class SubmitForFinalDecisionTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    isAgreed: PropTypes.bool.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      back: PropTypes.string,
      next: PropTypes.string,
      text1: PropTypes.string,
    }).isRequired,
  }

  onBackClicked = (e) => {
    const { handleTabChange, tab } = this.props;

    handleTabChange(e, { value: tab.back });
  }

  render() {
    const {
      currTabId,
      tab,
      isSubmitting,
      onSubmitClicked,
      handleAgreeCheckBoxChange,
      isAgreed,
    } = this.props;
    const { id, title, text1, checkbox1, submitBtn } = tab;
    const isActive = id === currTabId;

    if (!isActive) {
      return null;
    }

    return (
      <TabForm
        isActive={isActive}
        title={title}
        actions={
          <Fragment>
            <LeftBtn
              onClick={this.onBackClicked}
              content="Back"
            />
            <RightBtn
              onClick={onSubmitClicked}
              loading={isSubmitting}
              disabled={!isAgreed}
              content={submitBtn}
            />
          </Fragment>
        }
        content={
          <Form>
            <div style={{ marginBottom: '20px' }}>
              {text1}
            </div>
            <Form.Checkbox
              label={checkbox1}
              checked={isAgreed}
              onChange={handleAgreeCheckBoxChange}
            />
          </Form>
        }
      />
    );
  }
}

export default SubmitForFinalDecisionTab;
