import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextArea, Form } from 'semantic-ui-react';
import RightBtn from '../tab/RightBtn';
import LeftBtn from '../tab/LeftBtn';
import TabTemplate from '../tab/TabTemplate';
import { NUMBER_OF_LIMIT_FOR_NOTE } from '../../../../constants/variables';

class AddDescriptionTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onNextClicked: PropTypes.func.isRequired,
    handleNoteChange: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      next: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
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
      onClose,
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
              onClick={onClose}
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
                Add Description ({NUMBER_OF_LIMIT_FOR_NOTE} characters). It will be visible to range staff and other agreement holders.
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
