import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextArea, Form } from 'semantic-ui-react';
import RightBtn from '../RightBtn';
import LeftBtn from '../LeftBtn';
import TabTemplate from '../TabTemplate';
import { NUMBER_OF_LIMIT_FOR_NOTE } from '../../../../constants/variables';

class AddDescriptionTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    onCancelClicked: PropTypes.func.isRequired,
    onNextClicked: PropTypes.func.isRequired,
    handleNoteChange: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      next: PropTypes.string,
      lengthOfNote: PropTypes.string,
      radio2: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {

  }

  onNextClicked = (e) => {
    const { onNextClicked, tab } = this.props;

    onNextClicked(e, { value: tab.next });
  }

  render() {
    const {
      currTabId,
      tab,
      onCancelClicked,
      handleNoteChange,
      note,
    } = this.props;
    const { id, title, placeholder } = tab;
    const lengthOfNote = `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}`;
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
              onClick={onCancelClicked}
              content="Cancel"
            />
            <RightBtn
              onClick={this.onNextClicked}
              content="Next"
            />
          </Fragment>
        }
        content={
          <Form>
            <div className="rup__multi-tab__note">
              <div className="rup__multi-tab__note__title">
                Add Description ({NUMBER_OF_LIMIT_FOR_NOTE} characters). It will be visible to Range Staff and other Agreement Holders.
              </div>
              <TextArea
                placeholder={placeholder}
                onChange={handleNoteChange}
                value={note}
              />
              <div className="rup__multi-tab__note__text-length">
                {lengthOfNote}
              </div>
            </div>
          </Form>
        }
      />
    );
  }
}

export default AddDescriptionTab;
