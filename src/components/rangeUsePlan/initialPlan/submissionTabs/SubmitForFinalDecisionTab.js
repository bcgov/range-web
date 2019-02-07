import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import RightBtn from '../RightBtn';
import LeftBtn from '../LeftBtn';
import TabTemplate from '../TabTemplate';

class SubmitForFinalDecisionTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool,
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
      rightBtn1: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    isSubmitting: false,
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
      isSubmitting,
      onSubmitClicked,
      handleAgreeCheckBoxChange,
      isAgreed,
    } = this.props;
    const { id, next, title, text1, checkbox1, rightBtn1 } = tab;
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
              onClick={this.onBackClicked}
              content="Back"
            />
            <RightBtn
              onClick={next ? this.onNextClicked : onSubmitClicked}
              loading={isSubmitting}
              disabled={!isAgreed}
              content={rightBtn1}
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
