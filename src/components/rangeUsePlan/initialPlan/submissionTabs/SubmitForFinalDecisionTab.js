import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import RightBtn from '../RightBtn';
import LeftBtn from '../LeftBtn';
import TabTemplate from '../TabTemplate';
import { isSingleClient } from '../../../../utils';

class SubmitForFinalDecisionTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    isSubmitting: PropTypes.bool,
    handleTabChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    handleAgreeCheckBoxChange: PropTypes.func.isRequired,
    isAgreed: PropTypes.bool.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      back: PropTypes.string.isRequired,
      next: PropTypes.string.isRequired,
      text1: PropTypes.string.isRequired,
      rightBtn1: PropTypes.string.isRequired,
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

  onSubmitClicked = (e) => {
    this.props.onSubmitClicked(e).then(() => {
      this.onNextClicked(e);
    });
  }

  render() {
    const {
      currTabId,
      tab,
      isSubmitting,
      handleAgreeCheckBoxChange,
      isAgreed,
      clients,
    } = this.props;
    const { id, title, text1, checkbox1, rightBtn1 } = tab;
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
              onClick={isSingleClient(clients) ? this.onSubmitClicked : this.onNextClicked}
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
