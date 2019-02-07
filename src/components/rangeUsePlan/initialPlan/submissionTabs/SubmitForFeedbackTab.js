import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import RightBtn from '../RightBtn';
import LeftBtn from '../LeftBtn';
import TabTemplate from '../TabTemplate';

class SubmitForReviewTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    onSubmitClicked: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      back: PropTypes.string,
      next: PropTypes.string,
      text1: PropTypes.string,
      checkbox1: PropTypes.string,
      submitBtn: PropTypes.string,
    }).isRequired,
  }

  onBackClicked = (e) => {
    const { handleTabChange, tab } = this.props;

    handleTabChange(e, { value: tab.back });
  }

  onSubmitClicked = (e) => {
    const { onSubmitClicked, handleTabChange, tab } = this.props;

    onSubmitClicked(e).then(() => {
      handleTabChange(e, { value: tab.next });
    });
  }

  render() {
    const { currTabId, tab, isSubmitting } = this.props;
    const { id, title, text1 } = tab;
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
              onClick={this.onSubmitClicked}
              loading={isSubmitting}
              content="Submit For Feedback"
            />
          </Fragment>
        }
        content={
          <div>
            {text1}
          </div>
        }
      />
    );
  }
}

export default SubmitForReviewTab;
