import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form } from '@storybook/components'

const roleOptions = [
  {
    key: 'myra_range_officer',
    value: 'myra_range_officer',
    text: 'Range Officer'
  },
  {
    key: 'myra_client',
    value: 'myra_client',
    text: 'Agreement Holder'
  }
]

export default class ViewportTool extends Component {
  handleChange = e => {
    this.props.channel.emit('role/change', e.target.value)
  }

  render() {
    return (
      <Form.Select
        placeholder="Select role"
        style={{
          margin: 'auto 0 auto 15px'
        }}
        onChange={this.handleChange}>
        {roleOptions.map(role => (
          <option key={role.key} value={role.value}>
            {role.text}
          </option>
        ))}
      </Form.Select>
    )
  }
}

ViewportTool.propTypes = {
  api: PropTypes.shape({
    on: PropTypes.func
  }).isRequired,
  channel: PropTypes.object.isRequired
}
