import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Input, TextArea, Form } from 'semantic-ui-react';
import { REFERENCE_KEY } from '../../../constants/variables';

class EditalbeManagementConsiderationRow extends Component {
  static propTypes = {
    managementConsideration: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
  }

  render() {
    const { managementConsideration, references } = this.props;
    const { detail, url, considerationTypeId } = managementConsideration;
    const considerTypes = references[REFERENCE_KEY.MANAGEMENT_CONSIDERATION_TYPE] || [];
    const considerTypesMap = {};
    const considerTypeOptions = considerTypes.map((ct) => {
      considerTypesMap[ct.id] = ct;

      return {
        key: ct.id,
        value: ct.id,
        text: ct.name,
      };
    });
    // const currConsiderType = considerTypesMap[considerationTypeId];

    return (
      <div className="rup__m-consideration__row">
        <div>
          <Dropdown
            name="considerationTypeId"
            options={considerTypeOptions}
            value={considerationTypeId}
            // onChange={this.onActionFieldChanged}
            error={considerationTypeId === null}
            selection
            selectOnBlur={false}
            fluid
          />
        </div>
        <div>
          <Form>
            <TextArea
              name="detail"
              rows={3}
              value={detail}
              // onChange={this.onActionFieldChanged}
            />
            <Input
              name="url"
              value={url || ''}
              // onChange={this.onActionFieldChanged}
              style={{ marginTop: '10px' }}
              label="URL"
              fluid
            />
          </Form>
        </div>
      </div>
    );
  }
}

export default EditalbeManagementConsiderationRow;
