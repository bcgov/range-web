import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid-v4';
import { Icon, Dropdown, Input, TextArea, Form } from 'semantic-ui-react';
import { REFERENCE_KEY, CONFIRMATION_MODAL_ID } from '../../../constants/variables';
import { DELETE_MANAGEMENT_CONSIDERATION_CONFIRM_CONTENT, DELETE_MANAGEMENT_CONSIDERATION_CONFIRM_HEADER } from '../../../constants/strings';

class EditalbeManagementConsiderationRow extends Component {
  static propTypes = {
    managementConsideration: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    managementConsiderationUpdated: PropTypes.func.isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
    deleteRUPManagementConsideration: PropTypes.func.isRequired,
    managementConsiderationDeleted: PropTypes.func.isRequired,
  }

  onConsiderationChanged = (e, { name, value }) => {
    const {
      managementConsideration: mc,
      managementConsiderationUpdated,
    } = this.props;
    const managementConsideration = {
      ...mc,
      [name]: value,
    };

    managementConsiderationUpdated({ managementConsideration });
  }

  onDeleteConsiderationBtnClicked = () => {
    const {
      managementConsideration,
      deleteRUPManagementConsideration,
      managementConsiderationDeleted,
    } = this.props;
    const { id: considerationId, planId } = managementConsideration;

    const onDeleted = () => {
      managementConsiderationDeleted({ planId, considerationId });
    };

    if (planId && considerationId && !uuid.isUUID(considerationId)) {
      deleteRUPManagementConsideration(planId, considerationId).then(onDeleted);
    } else {
      onDeleted();
    }
  }

  openDeleteConsiderationConfirmationModal = () => {
    this.props.openConfirmationModal({
      id: CONFIRMATION_MODAL_ID.DELETE_MANAGEMENT_CONSIDERATION,
      header: DELETE_MANAGEMENT_CONSIDERATION_CONFIRM_HEADER,
      content: DELETE_MANAGEMENT_CONSIDERATION_CONFIRM_CONTENT,
      onYesBtnClicked: this.onDeleteConsiderationBtnClicked,
      closeAfterYesBtnClicked: true,
    });
  }

  render() {
    const { managementConsideration, references } = this.props;
    const { detail, url, considerationTypeId } = managementConsideration;
    const considerTypes = references[REFERENCE_KEY.MANAGEMENT_CONSIDERATION_TYPE] || [];
    const considerTypeOptions = considerTypes.map((ct) => {
      return {
        key: ct.id,
        value: ct.id,
        text: ct.name,
      };
    });
    const ellipsisOptions = [
      { key: 'delete', text: 'Delete', onClick: this.openDeleteConsiderationConfirmationModal },
    ];

    return (
      <div className="rup__m-consideration__row">
        <div>
          <Dropdown
            name="considerationTypeId"
            options={considerTypeOptions}
            value={considerationTypeId}
            onChange={this.onConsiderationChanged}
            error={considerationTypeId === null}
            selection
            selectOnBlur={false}
            fluid
          />
        </div>
        <div>
          <Form style={{ display: 'flex' }}>
            <div style={{ width: '100%' }}>
              <TextArea
                name="detail"
                rows={3}
                value={detail}
                onChange={this.onConsiderationChanged}
              />
              <Input
                name="url"
                value={url || ''}
                onChange={this.onConsiderationChanged}
                style={{ marginTop: '5px' }}
                label="URL"
                fluid
              />
            </div>
            <div className="rup__m-consideration__ellipsis">
              <Dropdown
                trigger={<Icon name="ellipsis vertical" style={{ margin: '0' }} />}
                options={ellipsisOptions}
                icon={null}
                pointing="right"
                style={{ marginLeft: '5px', marginTop: '10px' }}
              />
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default EditalbeManagementConsiderationRow;
