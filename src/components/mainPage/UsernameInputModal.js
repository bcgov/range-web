import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Modal, Segment, Form } from 'semantic-ui-react'
import { Loading, ErrorMessage, PrimaryButton } from '../common'
import {
  getUser,
  getIsUpdatingUser,
  getUpdatingUserErrorOccured
} from '../../reducers/rootReducer'
import { allowAlphabetOnly, doesUserHaveFullName } from '../../utils'
import { updateUser } from '../../actionCreators'
import { UPDATE_USER_ERROR, APP_NAME } from '../../constants/strings'

class UsernameInputModal extends Component {
  static propTypes = {
    user: PropTypes.shape({
      givenName: PropTypes.string,
      familyName: PropTypes.string
    }).isRequired,
    updateUser: PropTypes.func.isRequired,
    isUpdatingUser: PropTypes.bool.isRequired,
    UpdatingUserErrorOccured: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)

    const { givenName, familyName } = this.props.user
    this.state = {
      familyName,
      givenName
    }
  }

  onSubmitClicked = e => {
    e.preventDefault()
    const { familyName, givenName } = this.state
    this.props.updateUser({ familyName, givenName })
  }

  onInputPressed = e => {
    allowAlphabetOnly(e)
  }

  onInputChanged = (e, { name, value }) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    const { user, isUpdatingUser, UpdatingUserErrorOccured } = this.props
    const { familyName, givenName } = this.state
    const isGivenEmpty = givenName === ''
    const isFamilyEmpty = familyName === ''
    const missingLastAndFirstName = !doesUserHaveFullName(user)

    return (
      <Modal
        dimmer="blurring"
        style={{ width: '400px' }}
        open={missingLastAndFirstName}>
        <Segment>
          <Loading active={false} />
          <div className="un-input-modal">
            <div className="un-input-modal__header">Welcome to {APP_NAME}</div>
            <span className="un-input-modal__wave" role="img" aria-label="Wave">
              👋
            </span>
            <div className="un-input-modal__msg">
              Hey Stranger, What&#39;s your name?
            </div>
            <Form error={UpdatingUserErrorOccured}>
              <ErrorMessage
                message={UPDATE_USER_ERROR}
                style={{ marginBottom: '15px' }}
              />
              <Form.Input
                name="givenName"
                label="First Name"
                value={givenName}
                error={isGivenEmpty}
                onChange={this.onInputChanged}
                onKeyPress={this.onInputPressed}
              />
              <Form.Input
                name="familyName"
                label="Last Name"
                value={familyName}
                error={isFamilyEmpty}
                onChange={this.onInputChanged}
                onKeyPress={this.onInputPressed}
              />
              <PrimaryButton
                fluid
                disabled={isGivenEmpty || isFamilyEmpty}
                loading={isUpdatingUser}
                onClick={this.onSubmitClicked}>
                Submit
              </PrimaryButton>
            </Form>
          </div>
        </Segment>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  user: getUser(state),
  isUpdatingUser: getIsUpdatingUser(state),
  UpdatingUserErrorOccured: getUpdatingUserErrorOccured(state)
})

export default connect(mapStateToProps, {
  updateUser
})(UsernameInputModal)
