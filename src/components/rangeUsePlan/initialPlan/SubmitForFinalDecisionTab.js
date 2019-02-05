import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import RightBtn from './RightBtn';
import LeftBtn from './LeftBtn';
import TabForm from './TabForm';

class SubmitForFinalDecisionTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    tab: PropTypes.shape({}).isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onBackClicked: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    isAgreed: PropTypes.bool.isRequired,
  }

  onBackClicked = (e) => {
    const { onBackClicked, tab } = this.props;

    onBackClicked(e, { value: tab.back });
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
    const { id, title, planType, text1, checkbox1 } = tab;
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
              content={`Submit ${planType}`}
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
              onChange={handleAgreeCheckBoxChange}
            />
          </Form>
        }
      />
    );
  }
}

export default SubmitForFinalDecisionTab;
